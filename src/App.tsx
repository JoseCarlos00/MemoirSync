import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import api from './services/api';

function App() {
  const { login, logout, setInitializing, isInitializing, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  console.log('[App.tsx] isInitializing:', isInitializing);
  console.log('[App.tsx] isAuthenticated:', isAuthenticated);
  

  useEffect(() => {
		const refreshToken = async () => {
			try {
				const response = await api.post('auth/refresh');
				const { accessToken } = response.data;
				const decoded = JSON.parse(atob(accessToken.split('.')[1]));

				login({ accessToken, user: decoded });
			} catch (err: any) {
				// No hay refreshToken o está vencido
        console.error('Error refreshing token:', err?.response?.data || err.message);
        
				logout();
			} finally {
				setInitializing(false);
			}
		};

		refreshToken();
    
    // if (isInitializing) {
    //    refreshToken();
		// 	}
	}, []);


  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      // Si la inicialización ha terminado y el usuario no está autenticado,
      navigate('/login', { replace: true });
    }
  }, [isInitializing, isAuthenticated]);

  // Mientras se inicializa, puedes mostrar un spinner global
  if (isInitializing) {
    return <div>Loading application...</div>;
  }

  console.log('User is authenticated:', isAuthenticated);
  

  // Si está autenticado, renderiza las rutas hijas (protegidas) a través de Outlet.
  return isAuthenticated ? <Outlet /> : null;
}

export default App;
