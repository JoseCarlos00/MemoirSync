import { Link } from 'react-router-dom'
import Header from '../components/Header';
import { useRedirectIfAuthenticated } from '../hooks/redirected'
import { useAuthStore } from '../store/authStore'

export default function HomePage() {
	const { isInitializing } = useAuthStore();

  useRedirectIfAuthenticated({ redirectTo: '/' });

	if (isInitializing) return <div>Cargando...</div>;

	return (
		<div className='bg-gray-900 min-h-screen text-white flex flex-col p-4'>
			<Header />
			<h1>Welcome to the Home Page</h1>
			<p>This is the main content of the home page.</p>

			<ul className='mt-4 space-y-2 flex flex-col gap-1.5 border border-amber-50 w-min px-2 py-1 rounded-md'>
				<li className="text-teal-400 font-bold hover:text-teal-500">
					<Link to='/login'>Login</Link>
				</li>
				<li className="text-teal-400 font-bold hover:text-teal-500">
					<Link to='/chat'>Chat</Link>
				</li>
				<li className="text-teal-400 font-bold hover:text-teal-500">
					<Link to='/admin/AdminUpload'>Admin Upload</Link>
				</li>
				<li className="text-teal-400 font-bold hover:text-teal-500">
					<Link to='/unauthorized'>Unauthorized</Link>
				</li>
				<li className="text-teal-400 font-bold hover:text-teal-500">
					<Link to='/not-found'>Not Found</Link>
				</li>
			</ul>
		</div>
	);
}
