'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import UsersService from '../services/users.service';
import InterestsService, { Interest } from '../services/interests.service';
import ProtectedRoute from '../components/ProtectedRoute';
import InterestTags from '../components/InterestTags';

const updateProfileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
});

type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [userInterests, setUserInterests] = useState<Interest[]>([]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
  });

  useEffect(() => {
    if (user) {
      reset({ name: user.name });
    }
  }, [user, reset]);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const data = await InterestsService.getAllInterests();
        setInterests(data);
        
        // Set selected interests if user has any
        if (user?.interests && user.interests.length > 0) {
          setSelectedInterests(user.interests);
          
          // Filter interests to get only the ones the user has
          const userSelectedInterests = data.filter(interest => 
            user.interests && user.interests.includes(interest.id)
          );
          setUserInterests(userSelectedInterests);
        }
      } catch (err) {
        console.error('Error fetching interests:', err);
        toast.error('Error al cargar los intereses');
      }
    };

    fetchInterests();
  }, [user]);

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interestId)) {
        return prev.filter((id) => id !== interestId);
      } else {
        return [...prev, interestId];
      }
    });
  };

  const onSubmit = async (data: UpdateProfileFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await UsersService.updateUser(user.id, {
        ...data,
        interestIds: selectedInterests,
      });
      
      // Update user interests display
      const updatedUserInterests = interests.filter(interest => 
        selectedInterests.includes(interest.id)
      );
      setUserInterests(updatedUserInterests);
      
      toast.success('Perfil actualizado con éxito');
    } catch (err: any) {
      console.error('Error updating profile:', err);
      toast.error(err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Mi Perfil</h1>
        
        <div className="mb-8 p-4 bg-gray-50 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Información de la Cuenta</h2>
          <p className="text-gray-600 mb-3"><span className="font-medium">Email:</span> {user?.email}</p>
          
          {userInterests.length > 0 && (
            <div>
              <p className="text-gray-800 font-medium mb-2">Mis intereses:</p>
              <InterestTags interests={userInterests} />
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-1">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Intereses
            </label>
            <div className="grid grid-cols-2 gap-2">
              {interests.map((interest) => (
                <div key={interest.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`interest-${interest.id}`}
                    checked={selectedInterests.includes(interest.id)}
                    onChange={() => toggleInterest(interest.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-400 rounded"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor={`interest-${interest.id}`}
                    className="ml-2 block text-sm text-gray-900"
                  >
                    {interest.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}