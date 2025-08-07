import Header from '../components/Header';
import { useRedirectIfAuthenticated } from '../hooks/redirected'
import { useAuthStore } from '../store/authStore'

export default function HomePage() {
	const { isInitializing } = useAuthStore();

  useRedirectIfAuthenticated({ redirectTo: '/' });

	if (isInitializing) return <div>Cargando...</div>;

	return (
		<div>
			<Header />
			<h1>Welcome to the Home Page</h1>
			<p>This is the main content of the home page.</p>

			<ul>
				<li>
					<a href='/login'>Login</a>
				</li>
				<li>
					<a href='/chat'>Mensajes</a>
				</li>
			</ul>
		</div>
	);
}
