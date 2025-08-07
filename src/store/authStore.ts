import { create } from 'zustand';

interface User {
  _id: string;
  username: string;
  name: string;
  role: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isInitializing: boolean; // Para saber si estamos comprobando el token inicial
  isAuthenticated: boolean; // Computed property to check if the user is authenticated
  login: (data: { accessToken: string; user: User }) => void;
  logout: () => void;
  setInitializing: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isInitializing: true, // Empezamos en true para forzar la comprobación
  isAuthenticated: false, // Computed property to check if the user is authenticated
  login: ({ accessToken, user }) => set({ accessToken, user, isInitializing: false, isAuthenticated: true }),
  logout: () => set({ accessToken: null, user: null, isInitializing: false, isAuthenticated: false }),
  setInitializing: (status) => set({ isInitializing: status }),
}));
