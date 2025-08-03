import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css'
import './styles/tailwind.css';


import App from './App.tsx'

// Import views
import ChatView from './views/ChatView'
import LoginView from './views/LoginView'
import NotFoundPage from './views/NotFoundPage'

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
	},
	{
		path: '/login',
		element: <LoginView />,
	},
	{
		path: '/chat',
		element: <ChatView />,
	},
	{
		path: '*',
		element: <NotFoundPage />,
	},
]);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
