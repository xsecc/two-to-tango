'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Event } from '../services/events.service';
import { useAuth } from '../hooks/useAuth';
import EventsService from '../services/events.service';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

interface EventListProps {
  events: Event[];
  isLoading: boolean;
  emptyMessage?: string;
  showDeleteButton?: boolean;
  onEventDeleted?: (eventId: string) => void;
}

export default function EventList({ 
  events, 
  isLoading, 
  emptyMessage = 'No hay eventos disponibles',
  showDeleteButton = false,
  onEventDeleted
}: EventListProps) {
  const { user } = useAuth();
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  const handleDelete = async (eventId: string, eventTitle: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el evento "${eventTitle}"? Esta acción no se puede deshacer.`)) {
      setDeletingEventId(eventId);
      try {
        await EventsService.deleteEvent(eventId);
        toast.success('Evento eliminado con éxito');
        if (onEventDeleted) {
          onEventDeleted(eventId);
        }
      } catch (err: any) {
        console.error('Error deleting event:', err);
        toast.error(err.response?.data?.message || 'Error al eliminar el evento');
      } finally {
        setDeletingEventId(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-700">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => {
        const isOrganizer = user && event.organizerId === user.id;
        const isDeleting = deletingEventId === event.id;
        

        
        return (
          <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-5">
              <h3 className="font-bold text-xl mb-2 text-blue-600 line-clamp-1">{event.title}</h3>
              
              <div className="flex items-center text-sm text-gray-800 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>
                  {format(new Date(event.date), 'PPP', { locale: es })}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{format(new Date(event.date), 'HH:mm')}</span>
              </div>
              
              <div className="flex items-start text-sm text-gray-600 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="line-clamp-1">{event.location}</span>
              </div>
              
              <p className="text-gray-700 mb-4 line-clamp-2">{event.description}</p>
              
              <div className="flex justify-between items-center">
                <Link 
                  href={`/events/${event.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Ver detalles
                </Link>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{event.attendees?.length || 0} asistentes</span>
                  </div>
                  
                  {showDeleteButton && isOrganizer && (
                    <div className="flex space-x-1">
                      <Link
                        href={`/events/${event.id}/edit`}
                        className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(event.id, event.title)}
                        disabled={deletingEventId === event.id}
                        className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {deletingEventId === event.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}