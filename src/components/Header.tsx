import { useAuthStore } from "../store/authStore"

export default function Header() {
	const { user, logout } = useAuthStore();


  return (
		<header className='bg-sky-600 text-white p-4 shadow-md'>
			<h1 className='text-xl font-bold'>MemoirSync Chat</h1>
			<p className='text-sm'>Bienvenido a tu chat personal</p>

			{user && (
				<div className='flex items-center justify-between mt-4'>
					<p>User: {user.name}</p>
					<button
						onClick={logout}
						className='bg-red-500 text-white text-xs px-3 py-1 rounded'
					>
						Cerrar sesión
					</button>
				</div>
			)}
		</header>
	);
}
