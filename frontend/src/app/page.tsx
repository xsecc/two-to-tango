'use client';

import Link from 'next/link';
import { useAuth } from './hooks/useAuth';

export default function Home() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4" style={{ backgroundColor: '#FAFAFA' }}>
      {/* Título principal con color primario */}
      <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#0052CC' }}>Two to Tango</h1>
      
      {/* Texto secundario */}
      <p className="text-xl md:text-2xl mb-8 max-w-2xl" style={{ color: '#212121' }}>
        Encuentra eventos que coincidan con tus intereses y conoce personas con pasiones similares.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        {isAuthenticated ? (
          <Link 
            href="/events" 
            className="font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            style={{ 
              backgroundColor: '#0052CC', 
              color: '#FFFFFF',
              border: 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#003d99'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0052CC'}
          >
            Explorar Eventos
          </Link>
        ) : (
          <>
            <Link 
              href="/auth/login" 
              className="font-bold py-3 px-8 rounded-lg text-lg transition-colors"
              style={{ 
                backgroundColor: '#0052CC', 
                color: '#FFFFFF',
                border: 'none'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#003d99'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0052CC'}
            >
              Iniciar Sesión
            </Link>
            <Link 
              href="/auth/register" 
              className="font-bold py-3 px-8 rounded-lg text-lg transition-colors"
              style={{ 
                backgroundColor: '#FFFFFF', 
                color: '#0052CC',
                border: '2px solid #0052CC'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
            >
              Registrarse
            </Link>
          </>
        )}
      </div>
      
      {/* Tarjetas con superficie blanca */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0' }}>
          <h3 className="text-xl font-semibold mb-3" style={{ color: '#0052CC' }}>Encuentra Eventos</h3>
          <p style={{ color: '#212121' }}>Descubre eventos que coincidan con tus intereses y pasiones.</p>
        </div>
        
        <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0' }}>
          <h3 className="text-xl font-semibold mb-3" style={{ color: '#0052CC' }}>Conoce Personas</h3>
          <p style={{ color: '#212121' }}>Conecta con personas que comparten tus mismos intereses.</p>
        </div>
        
        <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0' }}>
          <h3 className="text-xl font-semibold mb-3" style={{ color: '#0052CC' }}>Organiza Eventos</h3>
          <p style={{ color: '#212121' }}>Crea tus propios eventos y encuentra asistentes interesados.</p>
        </div>
      </div>
    </div>
  );
}
