import LoginForm from '../components/LoginForm';
import UserBar from '../components/UserBar';
import { useRedirectIfAuthenticated } from '../hooks/redirected'

function LoginView() {
	// Si el usuario ya está autenticado, lo redirige a la página principal del chat.
	useRedirectIfAuthenticated({ redirectTo: '/chat' });
	
  return (
  <>
    <h1>Login View</h1>
    <UserBar />
    <LoginForm />
  </>  );
}

export default LoginView;
