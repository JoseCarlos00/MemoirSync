import { Link } from 'react-router-dom'
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
					<Link to='/login'>Login</Link>
				</li>
				<li>
					<Link to='/chat'>Chat</Link>
				</li>
				<li>
					<Link to='/admin/AdminUpload'>Admin Upload</Link>
				</li>
				<li>
					<Link to='/unauthorized'>Unauthorized</Link>
				</li>
				<li>
					<Link to='/not-found'>Not Found</Link>
				</li>
			</ul>
		</div>
	);
}
