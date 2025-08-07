'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import EventsService, { Event, User } from '../../services/events.service';
import InterestsService, { Interest } from '../../services/interests.service';
import ProtectedRoute from '../../components/ProtectedRoute';
import InterestTags from '../../components/InterestTags';
import { useAuth } from '../../hooks/useAuth';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRsvpLoading, setIsRsvpLoading] = useState(false);
  const [suggestedAttendees, setSuggestedAttendees] = useState<User[]>([]);
  const [eventInterests, setEventInterests] = useState<Interest[]>([]);
  const [error, setError] = useState('');
  const eventId = params.id as string;

  const isOrganizer = user?.id === event?.organizerId;
  const isAttending = event?.attendees?.some(attendee => attendee.id === user?.id);

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      try {
        const data = await EventsService.getEventById(eventId);
        setEvent(data);

        // Fetch interests for this event
        // Solo obtener intereses si el evento tiene la propiedad interests
        // In the fetchEvent function
        if (data.interests && data.interests.length > 0) {
          const allInterests = await InterestsService.getAllInterests();
          const filteredInterests = allInterests.filter(interest => 
            data.interests?.includes(interest.id)
          );
          setEventInterests(filteredInterests);
        } else {
          // Si no hay intereses específicos, limpiar el estado
          setEventInterests([]);
        }

        // Fetch suggested attendees if user is the organizer
        if (user?.id === data.organizerId) {
          const suggested = await EventsService.getSuggestedAttendees(eventId);
          setSuggestedAttendees(suggested);
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Error al cargar el evento. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId, user?.id]);

  const handleRSVP = async () => {
    setIsRsvpLoading(true);
    try {
      await EventsService.rsvpToEvent(eventId);
      toast.success('Te has unido al evento');
      
      // Refresh event data
      const updatedEvent = await EventsService.getEventById(eventId);
      setEvent(updatedEvent);
    } catch (err: any) {
      console.error('Error joining event:', err);
      toast.error(err.response?.data?.message || 'Error al unirse al evento');
    } finally {
      setIsRsvpLoading(false);
    }
  };

  const handleCancelRSVP = async () => {
    setIsRsvpLoading(true);
    try {
      await EventsService.cancelRsvp(eventId);
      toast.success('Has cancelado tu asistencia al evento');
      
      // Refresh event data
      const updatedEvent = await EventsService.getEventById(eventId);
      setEvent(updatedEvent);
    } catch (err: any) {
      console.error('Error canceling RSVP:', err);
      toast.error(err.response?.data?.message || 'Error al cancelar la asistencia');
    } finally {
      setIsRsvpLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.')) {
      try {
        await EventsService.deleteEvent(eventId);
        toast.success('Evento eliminado con éxito');
        router.push('/events');
        router.refresh();
      } catch (err: any) {
        console.error('Error deleting event:', err);
        toast.error(err.response?.data?.message || 'Error al eliminar el evento');
      }
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !event) {
    return (
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
          <div className="bg-red-100 text-red-700 p-4 rounded-md">
            {error || 'No se pudo encontrar el evento solicitado.'}
          </div>
          <div className="mt-4">
            <button
              onClick={() => router.push('/events')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Volver a Eventos
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-blue-600">{event.title}</h1>
            {isOrganizer && (
              <div className="flex space-x-2">
                <button
                  onClick={() => router.push(`/events/${eventId}/edit`)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Editar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
          <p className="text-gray-500 mt-2">
            Organizado por: {event.organizer?.name || 'Usuario'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{format(new Date(event.date), 'PPP p', { locale: es })}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span>{event.attendees?.length || 0} asistentes</span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Descripción</h2>
          <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
        </div>

        {eventInterests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Intereses</h2>
            <InterestTags interests={eventInterests} />
          </div>
        )}
        
        {event.tags && event.tags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Etiquetas</h2>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                >
                  {typeof tag === 'string' ? tag : tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {!isOrganizer && (
          <div className="mt-8">
            {isAttending ? (
              <button
                onClick={handleCancelRSVP}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isRsvpLoading}
              >
                {isRsvpLoading ? 'Procesando...' : 'Cancelar Asistencia'}
              </button>
            ) : (
              <button
                onClick={handleRSVP}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isRsvpLoading}
              >
                {isRsvpLoading ? 'Procesando...' : 'Unirse al Evento'}
              </button>
            )}
          </div>
        )}

        {event.attendees && event.attendees.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Asistentes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {event.attendees.map((attendee) => (
                <div key={attendee.id} className="flex items-center p-3 bg-gray-50 rounded-md">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    {attendee.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{attendee.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {isOrganizer && suggestedAttendees.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Asistentes Sugeridos</h2>
            <p className="text-gray-600 mb-4">Personas con intereses similares que podrían estar interesadas en tu evento:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {suggestedAttendees.map((attendee) => (
                <div key={attendee.id} className="flex items-center p-3 bg-gray-50 rounded-md">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    {attendee.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{attendee.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={() => router.push('/events')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Volver a Eventos
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}