import LoginForm from '../components/LoginForm';
import UserBar from '../components/UserBar';
import { useRedirectIfAuthenticated } from '../hooks/redirected'
import { useAuthStore } from '../store/authStore'

function LoginView() {
  const { isInitializing } = useAuthStore()
  
	// Si el usuario ya está autenticado, lo redirige a la página principal del chat.
	useRedirectIfAuthenticated({ redirectTo: '/' });
	
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
