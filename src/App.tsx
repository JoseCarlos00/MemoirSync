import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import api from './services/api';
import { useAuthStore } from './store/authStore';

export default function App() {
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
				console.log('Checking auth...'); // Debugging line to track auth check);
				
        const { data } = await api.post('/auth/refresh');
				console.log(`Refreshing session:`, data); // Debugging line to check the token
				
        login({ accessToken: data.accessToken, user: data.payload });
      } catch (err) {
        console.warn('Sesión no válida');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <p>Cargando...</p>;

  return <Outlet />;
}

