import { create } from 'zustand';

export const useChatStore = create((set) => ({
	messages: [],
	loading: false,
	selectedChatId: null,
	totalMessages: 0,

	setMessages: (messages) => set({ messages }),
	addMessages: (newMessages) =>
		set((state) => ({
			messages: [...newMessages, ...state.messages], // agrega al inicio
		})),
	setLoading: (loading) => set({ loading }),
	clearMessages: () => set({ messages: [] }),
	setTotalMessages: (total) => set({ totalMessages: total }),
}));
