'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import EventsService, { Event } from '../../services/events.service';
import ProtectedRoute from '../../components/ProtectedRoute';
import EventList from '../../components/EventList';

export default function MyEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [organizedEvents, setOrganizedEvents] = useState<Event[]>([]);
  const [attendingEvents, setAttendingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEvents = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const allEvents = await EventsService.getAllEvents();
      
      // Filter events organized by the current user
      const userOrganizedEvents = allEvents.filter(event => event.organizerId === user.id);
      setOrganizedEvents(userOrganizedEvents);
      
      // Filter events the user is attending (but not organizing)
      const userAttendingEvents = allEvents.filter(
        event => event.attendees?.some(attendee => attendee.id === user.id) && 
                event.organizerId !== user.id
      );
      setAttendingEvents(userAttendingEvents);
      
      // Combine all events related to the user
      setEvents([...userOrganizedEvents, ...userAttendingEvents]);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Error al cargar los eventos. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const handleEventDeleted = (eventId: string) => {
    // Remove the deleted event from the state
    setOrganizedEvents(prev => prev.filter(event => event.id !== eventId));
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Mis Eventos</h1>
          <Link
            href="/events/create"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Crear Evento
          </Link>
        </div>

        {error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">{error}</div>
        ) : (
          <>
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Eventos que organizo</h2>
              <EventList 
                events={organizedEvents} 
                isLoading={isLoading} 
                emptyMessage="No estás organizando ningún evento actualmente."
                showDeleteButton={true}
                onEventDeleted={handleEventDeleted}
              />
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Eventos a los que asisto</h2>
              <EventList 
                events={attendingEvents} 
                isLoading={isLoading} 
                emptyMessage="No estás asistiendo a ningún evento actualmente."
                showDeleteButton={false}
              />
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}