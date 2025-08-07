import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import api from "../services/api"

export const useRedirectIfAuthenticated = ({ redirectTo }: { redirectTo: string }) => {
	const { isAuthenticated, isInitializing, login, setInitializing } = useAuthStore();
	const navigate = useNavigate();

	console.log({ isInitializing, isAuthenticated });
	

	useEffect(() => {
			const initializeAuth = async () => {
				try {
					// Petición silenciosa para obtener un nuevo accessToken
					const response = await api.post('/auth/refresh');
					const { accessToken } = response.data;
					const decoded = JSON.parse(atob(accessToken.split('.')[1]));

					console.log('Silent authentication successful:', decoded);
					
					
					login({ accessToken, user: decoded });
				} catch (error: any) {
					// Si hay un error (ej. refresh token inválido o expirado),
					// simplemente no hacemos login.
					console.log('Error during silent authentication:', error);
					console.log('Respuesta del servidor:', error.response.data);
				} finally {
					// Marcamos la inicialización como completada, haya funcionado o no.
					setInitializing(false);
				}
			};
	
			if (isInitializing) {
				initializeAuth();
			}
		}, [isInitializing, login, setInitializing]);
	
	useEffect(() => {
		// No hacer nada mientras la app se está inicializando
		if (isInitializing) {
			return;
		}
		// Si la inicialización terminó y el usuario está autenticado, redirigir.
		if (!isInitializing && isAuthenticated) {
			navigate(redirectTo, { replace: true });
		}
	}, [isAuthenticated, isInitializing, navigate, redirectTo]);
};
