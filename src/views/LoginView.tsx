import LoginForm from '../components/LoginForm';
import UserBar from '../components/UserBar';
import { useRedirectAuthenticated } from '../hooks/useRedirectAuthenticated'
import { useAuthStore } from '../store/authStore'

function LoginView() {
  const { isInitializing } = useAuthStore()
  
	// Si el usuario ya está autenticado, lo redirige a la página principal del chat.
	useRedirectAuthenticated({ redirectTo: '/' });
	
  return (
  <>
    {isInitializing ? (
      <div>Cargando...</div>
    ) : (
      <>
        <UserBar />
        <LoginForm />
      </>
    )}
  </>  );
}

export default LoginView;
