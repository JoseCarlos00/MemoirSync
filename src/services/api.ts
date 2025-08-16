import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { BASE_URL_API } from '../config/constants';

const api = axios.create({
	baseURL: BASE_URL_API,
	withCredentials: true, // Necesario para enviar las cookies HttpOnly
	timeout: 5000,
});

// Interceptor de request: incluye el accessToken automáticamente
api.interceptors.request.use((config) => {
	try {
		const token = useAuthStore.getState().accessToken;
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
	} catch (error) {
		console.error('Error fetching access token:', error);
	}
	return config;
});

// Interceptor de response: intenta refrescar el token si el accessToken expiró
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// Si el accessToken expiró y no hemos reintentado aún
		if (error.response?.status === 403 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// Hacer petición al endpoint de refresh
				const res = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
					withCredentials: true,
				});

				const { accessToken } = res.data;

				// Decodificar el nuevo token (sin validarlo, sólo leer payload)
				const decoded = JSON.parse(atob(accessToken.split('.')[1]));

				// Actualizar el estado global con el nuevo token y usuario
				useAuthStore.getState().login({ accessToken, user: decoded });

				// Reintentar la petición original con el nuevo token
				originalRequest.headers.Authorization = `Bearer ${accessToken}`;
				return api(originalRequest);
			} catch (refreshError) {
				// Si falla el refresh token, cerrar sesión
				console.error('Error refreshing token:', refreshError);
				useAuthStore.getState().logout();
				window.location.href = '/login';
			}
		}

		return Promise.reject(error);
	}
);

export default api;
