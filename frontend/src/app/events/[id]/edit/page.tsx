'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import EventsService, { Event } from '../../../services/events.service';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useAuth } from '../../../hooks/useAuth';

const updateEventSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  location: z.string().min(3, 'La ubicación debe tener al menos 3 caracteres'),
  date: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, 'La fecha debe ser válida'),
  tags: z.string().optional(),
});

type UpdateEventFormData = z.infer<typeof updateEventSchema>;

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const eventId = params.id as string;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateEventFormData>({
    resolver: zodResolver(updateEventSchema),
  });

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      try {
        const data = await EventsService.getEventById(eventId);
        setEvent(data);
        
        // Check if user is the organizer
        if (user?.id !== data.organizerId) {
          setError('No tienes permiso para editar este evento');
          return;
        }
        
        // Format date for datetime-local input
        const eventDate = new Date(data.date);
        const formattedDate = eventDate.toISOString().slice(0, 16);
        
        // Format tags for input
        const formattedTags = data.tags ? data.tags.join(', ') : '';
        
        // Reset form with event data
        reset({
          title: data.title,
          description: data.description,
          location: data.location,
          date: formattedDate,
          tags: formattedTags,
        });
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
  }, [eventId, reset, user?.id]);

  const onSubmit = async (data: UpdateEventFormData) => {
    setIsSubmitting(true);
    
    try {
      // Process tags if provided
      const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()) : [];
      
      await EventsService.updateEvent(eventId, {
        ...data,
        tags,
      });
      
      toast.success('Evento actualizado con éxito');
      router.push(`/events/${eventId}`);
    } catch (err: any) {
      console.error('Error updating event:', err);
      toast.error(err.response?.data?.message || 'Error al actualizar el evento');
    } finally {
      setIsSubmitting(false);
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

  if (error) {
    return (
      <ProtectedRoute>
        <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
          <div className="bg-red-100 text-red-700 p-4 rounded-md">
            {error}
          </div>
          <div className="mt-4">
            <button
              onClick={() => router.push(`/events/${eventId}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Volver al Evento
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Editar Evento</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-1">
              Título
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description')}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-900 mb-1">
              Ubicación
            </label>
            <input
              id="location"
              type="text"
              {...register('location')}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-900 mb-1">
              Fecha y Hora
            </label>
            <input
              id="date"
              type="datetime-local"
              {...register('date')}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-900 mb-1">
              Etiquetas (separadas por comas)
            </label>
            <input
              id="tags"
              type="text"
              placeholder="música, arte, tecnología"
              {...register('tags')}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            {errors.tags && (
              <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push(`/events/${eventId}`)}
              className="px-4 py-2 border border-gray-400 rounded-md text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}