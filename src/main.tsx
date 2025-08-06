import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css'


import App from './App.tsx'

// Import views
import RequireRole from './components/RequireRole'; // Importar el nuevo componente
import ChatView from './views/ChatView'
import LoginView from './views/LoginView'
import NotFoundPage from './views/NotFoundPage'
import HomePage from './views/HomePage'
import UnauthorizedView from './views/UnauthorizedView';


const router = createBrowserRouter([
	{
		element: <App />, // App actúa como un layout para rutas protegidas
		children: [
			{
				// Rutas para usuarios con rol 'user' o 'admin'
				element: <RequireRole allowedRoles={['user', 'admin']} />,
				children: [
					{
						path: '/chat',
						element: <ChatView />,
					},
				],
			},
			{
				// Rutas solo para 'admin'
				element: <RequireRole allowedRoles={['admin']} />,
				children: [
					// Ejemplo: { path: '/admin/dashboard', element: <AdminDashboard /> },
				],
			},
		],
	},
	// Rutas públicas
	{
		path: '/',
		element: <HomePage />,
	},
	{
		path: '/login',
		element: <LoginView />,
	},
	{
		path: '/unauthorized',
		element: <UnauthorizedView />,
	},
	{
		path: '*',
		element: <NotFoundPage />,
	},
]);

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
