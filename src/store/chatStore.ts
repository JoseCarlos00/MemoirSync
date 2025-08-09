import { create } from 'zustand';
import { type Message } from '../interfaces/message';

interface ChatState {
	messages: Message[];
	loading: boolean;
	selectedChatId: string | null;
	totalMessages: number;
	setMessages: (messages: Message[]) => void;
	addMessages: (newMessages: Message[]) => void;
	setLoading: (loading: boolean) => void;
	clearMessages: () => void;
	setTotalMessages: (total: number) => void;
	updateMessage: (messageId: string, updates: Partial<Message>) => void;
}

export const useChatStore = create<ChatState>((set) => ({
	messages: [],
	loading: false,
	selectedChatId: null,
	totalMessages: 0,

	setMessages: (messages) => set({ messages }),
	addMessages: (newMessages) =>
		set((state) => ({
			messages: [...state.messages, ...newMessages],
		})),
	setLoading: (loading) => set({ loading }),
	clearMessages: () => set({ messages: [], totalMessages: 0 }),
	setTotalMessages: (total) => set({ totalMessages: total }),
	updateMessage: (messageId, updates) =>
		set((state) => ({
			messages: state.messages.map((msg) =>
				msg._id === messageId ? { ...msg, ...updates } : msg
			),
		})),
}));
