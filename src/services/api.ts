import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
	// baseURL: 'https://192.168.1.10:3000/api',
	baseURL: 'https://localhost:3000/api',
	withCredentials: true, // Necesario para enviar las cookies HttpOnly
});

// Interceptor para incluir el accessToken automáticamente
api.interceptors.request.use((config) => {
	const token = useAuthStore.getState().accessToken;

  console.log(`Using access token: ${token}`); // Debugging line to check the token
  
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default api;
