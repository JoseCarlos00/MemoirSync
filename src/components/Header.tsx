import { memo } from "react";
import api from "../services/api"
import { useAuthStore } from "../store/authStore"

function Header() {
	const { user, logout } = useAuthStore();


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
		<header className='bg-sky-600 text-white p-4 shadow-md'>
			<h1 className='text-xl font-bold'>MemoirSync Chat</h1>
			<p className='text-sm'>Bienvenido a tu chat personal</p>

			{user && (
				<div className='flex items-center justify-between mt-4'>
					<p>User: {user.name}</p>
					<button
						onClick={handleLogout}
						className='bg-red-500 text-white text-xs px-3 py-1 rounded cursor-pointer'
					>
						Cerrar sesión
					</button>
				</div>
			)}
		</header>
	);
}

export default memo(Header);


