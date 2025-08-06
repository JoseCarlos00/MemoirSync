import { useAuthStore } from '../store/authStore';

export default function UserBar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="flex items-center justify-between bg-gray-100 p-2">
      <span className="text-sm text-gray-700">
        {user ? `Usuario: ${user.name}` : 'No autenticado'}
      </span>
      {user && (
        <button
          onClick={logout}
          className="bg-red-500 text-white text-xs px-3 py-1 rounded"
        >
          Cerrar sesión
        </button>
      )}
    </div>
  );
}
