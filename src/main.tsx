import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css'


import App from './App.tsx'

// Import views
import ChatView from './views/ChatView'
import LoginView from './views/LoginView'
import NotFoundPage from './views/NotFoundPage'
import HomePage from './views/HomePage'


const router = createBrowserRouter([
	{
		element: <App />, // App actúa como un layout para rutas protegidas
		children: [
			{
				path: '/chat',
				element: <ChatView />,
			},
			// ... aquí puedes añadir más rutas que requieran autenticación
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
		path: '*',
		element: <NotFoundPage />,
	},
]);

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
