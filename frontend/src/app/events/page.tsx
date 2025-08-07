'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import EventsService, { Event } from '../services/events.service';
import ProtectedRoute from '../components/ProtectedRoute';
import EventList from '../components/EventList';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const data = await EventsService.getAllEvents();
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Error al cargar los eventos. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Eventos</h1>
          <Link
            href="/events/create"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Crear Evento
          </Link>
        </div>

        {error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
        ) : (
          <EventList 
            events={events} 
            isLoading={isLoading} 
            emptyMessage="No hay eventos disponibles. ¡Sé el primero en crear un evento!"
          />
        )}
      </div>
    </ProtectedRoute>
  );
}