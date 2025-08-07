'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import UsersService, { User } from '../../services/users.service';
import EventsService, { Event } from '../../services/events.service';
import InterestsService, { Interest } from '../../services/interests.service';
import InterestTags from '../../components/InterestTags';

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  
  const [user, setUser] = useState<User | null>(null);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to profile page if viewing own profile
    if (currentUser && currentUser.id === id) {
      router.push('/profile');
      return;
    }

    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch user data
        const userData = await UsersService.getUserById(id);
        setUser(userData);
        
        // Fetch all interests to map IDs to names
        const interestsData = await InterestsService.getAllInterests();
        setInterests(interestsData);
        
        // Fetch events created by this user
        const allEvents = await EventsService.getAllEvents();
        const filteredEvents = allEvents.filter(event => event.organizerId === id);
        setUserEvents(filteredEvents);
      } catch (err: any) {
        console.error('Error fetching user data:', err);
        setError(err.response?.data?.message || 'Error al cargar los datos del usuario');
        toast.error('No se pudo cargar el perfil del usuario');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [id, currentUser, router]);

  // Get interest names from IDs
  const getUserInterests = () => {
    if (!user?.interests || !interests.length) return [];
    
    return user.interests
      .map(interestId => interests.find(i => i.id === interestId))
      .filter(interest => interest !== undefined) as Interest[];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
        <p className="text-gray-700 mb-4">{error || 'Usuario no encontrado'}</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const userInterests = getUserInterests();

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">{user.name}</h1>
        
        {userInterests.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 border-b pb-2">Intereses</h2>
            <InterestTags interests={userInterests} />
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Eventos organizados</h2>
        
        {userEvents.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Este usuario aún no ha organizado eventos</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {userEvents.map(event => (
              <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-medium text-lg mb-2 text-blue-600">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {format(new Date(event.date), 'PPP', { locale: es })} a las {format(new Date(event.date), 'HH:mm')}
                </p>
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{event.description}</p>
                <Link 
                  href={`/events/${event.id}`}
                  className="text-blue-600 hover:underline text-sm inline-block"
                >
                  Ver detalles
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}