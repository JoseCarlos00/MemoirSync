import { useAuthStore } from '../store/authStore';

export const useUser = () => {
	const user = useAuthStore((state) => state.user);
	const isAdmin = user?.role === 'admin';
	return { user, isAdmin };
};
