'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import EventsService, { Event } from '../../services/events.service';
import InterestsService, { Interest } from '../../services/interests.service';
import ProtectedRoute from '../../components/ProtectedRoute';
import EventList from '../../components/EventList';

export default function SearchEventsPage() {
  const searchParams = useSearchParams();
  const interestId = searchParams.get('interest');
  
  const [events, setEvents] = useState<Event[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [selectedInterest, setSelectedInterest] = useState<string | null>(interestId);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const data = await InterestsService.getAllInterests();
        setInterests(data);
      } catch (err) {
        console.error('Error fetching interests:', err);
        setError('Error al cargar los intereses');
      }
    };

    fetchInterests();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const allEvents = await EventsService.getAllEvents();
        
        if (selectedInterest) {
          // Filter events by organizer's interests
          const filteredEvents = allEvents.filter(event => 
            event.organizer?.interests?.includes(selectedInterest)
          );
          setEvents(filteredEvents);
        } else {
          setEvents(allEvents);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Error al cargar los eventos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [selectedInterest]);

  const handleInterestChange = (interestId: string) => {
    setSelectedInterest(interestId === selectedInterest ? null : interestId);
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Buscar Eventos</h1>
          <Link
            href="/events"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Ver todos los eventos
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Filtrar por interés</h2>
          <div className="flex flex-wrap gap-2">
            {interests.map(interest => (
              <button
                key={interest.id}
                onClick={() => handleInterestChange(interest.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedInterest === interest.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              >
                {interest.name}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
        ) : (
          <div>
            {selectedInterest && (
              <div className="mb-4 flex items-center">
                <p className="text-gray-600 mr-2">
                  Mostrando eventos para: 
                  <span className="font-medium">
                    {interests.find(i => i.id === selectedInterest)?.name}
                  </span>
                </p>
                <button 
                  onClick={() => setSelectedInterest(null)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Limpiar filtro
                </button>
              </div>
            )}
            
            <EventList 
              events={events} 
              isLoading={isLoading} 
              emptyMessage={selectedInterest 
                ? "No hay eventos disponibles para este interés" 
                : "No hay eventos disponibles"}
            />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}