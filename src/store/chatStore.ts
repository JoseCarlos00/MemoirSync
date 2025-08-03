import { create } from 'zustand';

export const useChatStore = create((set) => ({
	messages: [],
	loading: false,
	selectedChatId: null,

	setMessages: (messages) => set({ messages }),
	appendMessages: (newMessages) => set((state) => ({ messages: [...state.messages, ...newMessages] })),
	setLoading: (loading) => set({ loading }),
	clearMessages: () => set({ messages: [] }),
}));
