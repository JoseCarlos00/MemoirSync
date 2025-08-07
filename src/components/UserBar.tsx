import api from '../services/api'
import { useAuthStore } from '../store/authStore';

export default function UserBar() {
  const {user, logout} = useAuthStore();

  	const handleLogout = async () => {
			logout();
			try {
				const response = await api.post('/auth/logout');
				console.log('Logout exitoso:', response.data);
			} catch (error: any) {
				console.error('Error al cerrar sesión:', error?.response?.data || error?.message);
			}
		};

  return (
		<div className='flex items-center justify-between bg-gray-100 p-2'>
			<span className='text-sm text-gray-700'>{user ? `Usuario: ${user.name}` : 'No autenticado'}</span>
			{user && (
				<button
					onClick={handleLogout}
					className='bg-red-500 text-white text-xs px-3 py-1 rounded'
				>
					Cerrar sesión
				</button>
			)}
		</div>
	);
}
