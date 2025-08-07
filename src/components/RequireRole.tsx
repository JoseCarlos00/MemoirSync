import { useAuthStore } from '../store/authStore';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface RequireRoleProps {
	allowedRoles: string[];
}

const RequireRole = ({ allowedRoles }: RequireRoleProps) => {
	const { user, isAuthenticated, isInitializing } = useAuthStore();
	const location = useLocation();

	// Muestra un loader mientras se determina el estado de autenticación
	if (isInitializing) return <div>Cargando...</div>;

	// El usuario no está autenticado
	if (!isAuthenticated || !user)
		return (
			<Navigate
				to='/login'
				replace
				state={{ from: location }}
			/>
		);

	// El usuario está autenticado pero no tiene el rol correcto
	if (!allowedRoles.includes(user.role))
		return (
			<Navigate
				to='/unauthorized'
				replace
			/>
		);

	return <Outlet />; // Renderiza el componente hijo (la ruta protegida)
};

export default RequireRole;
