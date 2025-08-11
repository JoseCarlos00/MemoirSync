// useChat.ts
import { useCallback } from 'react';
import { useChatStore } from '../store/chatStore';
import api from '../services/api';
import { type Message } from '../interfaces/message';

interface FetchMessagesOptions {
	limit?: number;
	beforeId?: string;
	startDate?: string;
	endDate?: string;
}

export function useChat() {
	const {
		messages,
		loading,
		setMessages,
		addMessages,
		setLoading,
		setTotalMessages,
		error,
		setError,
		updateMessage: updateMessageInStore,
	} = useChatStore();

	const hasMore = useChatStore((state) => state.messages.length < state.totalMessages);

	const fetchMessages = useCallback(
		async (options: FetchMessagesOptions = {}) => {
			setLoading(true);
			try {
				const { data } = await api.get('/messages', { params: options });
				setMessages(data.messages);
				setTotalMessages(data.total);
				setError(null); // Limpiar errores si la petición es exitosa
			} catch (error) {
				console.error('Error fetching messages:', error);
				setError('No se pudieron cargar los mensajes.');
			} finally {
				setLoading(false);
			}
		},
		[setLoading, setMessages, setTotalMessages, setError]
	);

	const fetchMoreMessages = useCallback(
		async (options: FetchMessagesOptions = {}) => {
			const currentMessages = useChatStore.getState().messages;
			if (currentMessages.length === 0) return;
			setLoading(true);
			try {
				const firstMsgId = currentMessages[0]._id;
				const { data } = await api.get('/messages', {
					params: { ...options, beforeId: firstMsgId },
				});
				addMessages(data.messages);
				setError(null); // Limpiar errores si la petición es exitosa
				// El total se actualiza con la corrección del backend
			} catch (error) {
				console.error('Error fetching more messages:', error);
				setError('No se pudieron cargar más mensajes.');
			} finally {
				setLoading(false);
			}
		},
		[addMessages, setLoading, setError]
	);

	const updateMessage = useCallback(
		(messageId: string, updates: Partial<Message>) => {
			updateMessageInStore(messageId, updates);
		},
		[updateMessageInStore]
	);

	return {
		messages,
		fetchMessages,
		fetchMoreMessages,
		loading,
		hasMore,
		error,
		updateMessage,
	};
}
