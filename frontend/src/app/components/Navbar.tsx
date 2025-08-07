'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [isEventsDropdownOpen, setIsEventsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const eventsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Evitar problemas de hidratación
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      if (eventsTimeoutRef.current) clearTimeout(eventsTimeoutRef.current);
      if (userTimeoutRef.current) clearTimeout(userTimeoutRef.current);
    };
  }, []);

  // Función para cerrar dropdowns cuando se hace click fuera
  const handleClickOutside = () => {
    setIsEventsDropdownOpen(false);
    setIsUserDropdownOpen(false);
  };

  // Funciones para manejar eventos dropdown
  const handleEventsMouseEnter = () => {
    if (eventsTimeoutRef.current) {
      clearTimeout(eventsTimeoutRef.current);
      eventsTimeoutRef.current = null;
    }
    if (isMounted) {
      setIsEventsDropdownOpen(true);
    }
  };

  const handleEventsMouseLeave = () => {
    eventsTimeoutRef.current = setTimeout(() => {
      setIsEventsDropdownOpen(false);
    }, 500);
  };

  const handleUserMouseEnter = () => {
    if (userTimeoutRef.current) {
      clearTimeout(userTimeoutRef.current);
      userTimeoutRef.current = null;
    }
    if (isMounted) {
      setIsUserDropdownOpen(true);
    }
  };

  const handleUserMouseLeave = () => {
    userTimeoutRef.current = setTimeout(() => {
      setIsUserDropdownOpen(false);
    }, 500);
  };

  if (!isMounted) {
    // Renderizar versión simple durante la hidratación
    return (
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-blue-600">
                  Two to Tango
                </Link>
              </div>
              <div className="flex space-x-8">
                <div className="relative group">
                  <Link
                    href="/events" 
                    className="border-transparent text-gray-700 hover:border-blue-500 hover:text-blue-700 inline-flex items-center justify-center px-1 pt-1 border-b-2 text-base font-bold"
                  >
                    Eventos
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link
                      href="/events"
                      className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100"
                    >
                      Todos los Eventos
                    </Link>
                    <Link
                      href="/events/search"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Buscar por Interés
                    </Link>
                  </div>
                </div>
                {isAuthenticated && (
                  <>
                    <Link
                      href="/events/my-events"
                      className="border-transparent text-gray-500 hover:border-blue-500 hover:text-blue-700 inline-flex items-center px-1 pt-1 border-b-2 text-base font-bold"
                    >
                      Mis Eventos
                    </Link>
                    <Link
                      href="/events/create"
                      className="border-transparent text-gray-500 hover:border-blue-500 hover:text-blue-700 inline-flex items-center px-1 pt-1 border-b-2 text-base font-bold"
                    >
                      Crear Evento
                    </Link>
                  </>
                )}
              </div>
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="relative group">
                    <button className="text-gray-500 hover:text-blue-700 flex items-center text-base font-bold">
                      {user?.name || 'Perfil'}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Mi Perfil
                      </Link>
                      <Link
                        href="/events/my-events"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Mis Eventos
                      </Link>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-base font-bold"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/auth/login"
                    className="text-gray-500 hover:text-blue-700 text-base font-bold"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-base font-bold"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                Two to Tango
              </Link>
            </div>
            <div className="flex space-x-8">
              <div 
                className="relative"
                onMouseEnter={handleEventsMouseEnter}
                onMouseLeave={handleEventsMouseLeave}
              >
                <div
                  className="border-transparent text-gray-700 hover:border-blue-500 hover:text-blue-700 inline-flex items-center justify-center px-1 pt-1 border-b-2 text-base font-bold cursor-pointer"
                  onClick={() => {
                    setIsEventsDropdownOpen(!isEventsDropdownOpen);
                    setIsUserDropdownOpen(false);
                  }}
                >
                  Eventos
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {isEventsDropdownOpen && (
                  <div 
                    className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                    onMouseEnter={handleEventsMouseEnter}
                    onMouseLeave={handleEventsMouseLeave}
                  >
                    <Link
                      href="/events"
                      className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100"
                      onClick={() => setIsEventsDropdownOpen(false)}
                    >
                      Todos los Eventos
                    </Link>
                    <Link
                      href="/events/search"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsEventsDropdownOpen(false)}
                    >
                      Buscar por Interés
                    </Link>
                  </div>
                )}
              </div>
              {isAuthenticated && (
                <>
                  <Link
                    href="/events/my-events"
                    className="border-transparent text-gray-500 hover:border-blue-500 hover:text-blue-700 inline-flex items-center px-1 pt-1 border-b-2 text-base font-bold"
                  >
                    Mis Eventos
                  </Link>
                  <Link
                    href="/events/create"
                    className="border-transparent text-gray-500 hover:border-blue-500 hover:text-blue-700 inline-flex items-center px-1 pt-1 border-b-2 text-base font-bold"
                  >
                    Crear Evento
                  </Link>
                </>
              )}
            </div>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div 
                  className="relative"
                  onMouseEnter={handleUserMouseEnter}
                  onMouseLeave={handleUserMouseLeave}
                >
                  <div 
                    className="text-gray-500 hover:text-blue-700 flex items-center text-base font-bold cursor-pointer"
                    onClick={() => {
                      setIsUserDropdownOpen(!isUserDropdownOpen);
                      setIsEventsDropdownOpen(false);
                    }}
                  >
                    {user?.name || 'Perfil'}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {isUserDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                      onMouseEnter={handleUserMouseEnter}
                      onMouseLeave={handleUserMouseLeave}
                    >
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Mi Perfil
                      </Link>
                      <Link
                        href="/events/my-events"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Mis Eventos
                      </Link>
                    </div>
                  )}
                </div>
                <button
                  onClick={logout}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-base font-bold"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-gray-500 hover:text-blue-700 text-base font-bold"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-base font-bold"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Overlay para cerrar dropdowns al hacer click fuera */}
      {(isEventsDropdownOpen || isUserDropdownOpen) && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={handleClickOutside}
        />
      )}
    </nav>
  );
};

export default Navbar;