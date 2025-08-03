import { create } from 'zustand';

export const useAuthStore = create((set) => ({
	accessToken: null,
	user: null,

	login: ({ accessToken, user }) => set({ accessToken, user }),
	logout: () => set({ accessToken: null, user: null }),
}));
