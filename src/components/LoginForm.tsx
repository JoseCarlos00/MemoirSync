import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

export default function LoginForm() {
	const login = useAuthStore((state) => state.login);
	const [username, setUsername] = useState('admin');
	const [password, setPassword] = useState('password');
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			console.log('Iniciando sesión...');
			
			const response = await api.post('/auth/login', {
				username,
				password,
			});

			const { accessToken, message } = response.data;
			const decoded = JSON.parse(atob(accessToken.split('.')[1]));

			console.log({ accessToken, message, decoded }); // Debugging line to check the response
			
			login({ accessToken, user: decoded });

			setError(null);
		} catch (err: any) {
			console.error('Error en el inicio de sesión:', err);
			console.log('Respuesta del servidor:', err?.response?.data);
			
			setError('Credenciales inválidas');
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className='space-y-4 p-4 max-w-sm mx-auto'
		>
			<h2 className='text-xl font-bold'>Iniciar sesión</h2>

			<input
				type='text'
				placeholder='Usuario'
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				className='w-full p-2 border rounded'
			/>

			<input
				type='password'
				placeholder='Contraseña'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className='w-full p-2 border rounded'
			/>

			{error && <p className='text-red-500 text-sm'>{error}</p>}

			<button
				type='submit'
				className='bg-green-600 text-white px-4 py-2 rounded w-full'
			>
				Entrar
			</button>
		</form>
	);
}
