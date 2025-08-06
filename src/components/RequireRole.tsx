import { useAuthStore } from '../store/authStore';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface RequireRoleProps {
	allowedRoles: string[];
}

const RequireRole = ({ allowedRoles }: RequireRoleProps) => {
	const { user, isAuthenticated, isInitializing } = useAuthStore();
	const location = useLocation();

	if (isInitializing) {
		// Muestra un loader mientras se determina el estado de autenticación.
		return <div>Verificando permisos...</div>;
	}

	// El usuario está autenticado y su rol está en la lista de permitidos
	if (isAuthenticated && user?.role && allowedRoles.includes(user.role)) {
		return <Outlet />; // Renderiza el componente hijo (la ruta protegida)
	}

	// El usuario está autenticado pero no tiene el rol correcto
	if (isAuthenticated) {
		return (
			<Navigate
				to='/unauthorized'
				state={{ from: location }}
				replace
			/>
		);
	}

	// El usuario no está autenticado, App.tsx se encargará de redirigir a /login
	return (
		<Navigate
			to='/login'
			state={{ from: location }}
			replace
		/>
	);
};

export default RequireRole;
