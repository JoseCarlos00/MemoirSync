import { useCallback } from 'react';
import { useChatStore } from '../store/chatStore';
import api from '../services/api';

interface FetchMessagesOptions {
	limit: number;
	offset: number;
	startDate?: string;
	endDate?: string;
}

export function useChat() {
	const { messages, loading, setMessages, addMessages, setLoading, setTotalMessages } = useChatStore();
	const hasMore = useChatStore((state) => state.messages.length < state.totalMessages);

	const fetchMessages = useCallback(async (options: FetchMessagesOptions) => {
		setLoading(true);
		try {
			const { data } = await api.get('/messages', { params: options });
			console.log('Fetched messages:', data);
			setMessages(data.messages); // primera carga
			setTotalMessages(data.total); // establecer el total de mensajes
		} catch (error) {
				console.error('Error fetching messages:', error);
		} finally {
			setLoading(false);
		}
	}, [setLoading, setMessages, setTotalMessages]);

	const fetchMoreMessages = useCallback(async (options: FetchMessagesOptions) => {
		setLoading(true);
		try {
			const { data } = await api.get('/messages', { params: options });
			console.log('Fetched more messages:', data);
			addMessages(data.messages); // agregar al inicio
			setTotalMessages(data.total); // actualizar el total de mensajes
		} catch (error) {
			console.error('Error fetching more messages:', error);
		} finally {
			setLoading(false);
		}
	}, [setLoading, addMessages, setTotalMessages]);

	return { messages, fetchMessages, fetchMoreMessages, loading, hasMore };
}
