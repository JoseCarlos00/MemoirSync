// En el componente raíz de tu aplicación, por ejemplo App.tsx

import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import api from './services/api';

function App() {
  const { login, setInitializing, isInitializing, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Petición silenciosa para obtener un nuevo accessToken
        const response = await api.post('/auth/refresh');
        const { accessToken, payload } = response.data;

        login({ accessToken, user: payload });
      } catch (error) {
        // Si hay un error (ej. refresh token inválido o expirado),
        // simplemente no hacemos login.
        console.log('Error during silent authentication:', error);
        
        console.log('No active session found.');
      } finally {
        // Marcamos la inicialización como completada, haya funcionado o no.
        setInitializing(false);
      }
    };

    if (isInitializing) {
      initializeAuth();
    }
  }, [isInitializing, login, setInitializing]);

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      // Si la inicialización ha terminado y el usuario no está autenticado,
      // lo redirigimos a la página de login.
      navigate('/login', { replace: true });
    }
  }, [isInitializing, isAuthenticated, navigate]);

  // Mientras se inicializa, puedes mostrar un spinner global
  if (isInitializing) {
    return <div>Loading application...</div>;
  }

  console.log('User is authenticated:', isAuthenticated);
  

  // Si está autenticado, renderiza las rutas hijas (protegidas) a través de Outlet.
  return isAuthenticated ? <Outlet /> : null;
}

export default App;
