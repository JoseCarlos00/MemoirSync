// src/hooks/useChat.js
import { useChatStore } from '../store/chatStore';
import api from '../services/api';

export function useChat() {
	const { messages, loading, setMessages, appendMessages, setLoading, clearMessages } = useChatStore();

	// Obtener mensajes con filtros
	const fetchMessages = async ({ startDate, endDate, limit = 20, page = 1 }) => {
		try {
			setLoading(true);

			const params = {
				limit,
				page,
			};

			if (startDate) params.start_date = startDate;
			if (endDate) params.end_date = endDate;

			const response = await api.get('/messages', { params });

			setMessages(response.data.data || []);
		} catch (error) {
			console.error('Error al obtener mensajes:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	// Cargar más mensajes (scroll infinito, por ejemplo)
	const fetchMoreMessages = async ({ startDate, endDate, limit = 20, page = 2 }) => {
		try {
			setLoading(true);

			const params = {
				limit,
				page,
			};

			if (startDate) params.start_date = startDate;
			if (endDate) params.end_date = endDate;

			const response = await api.get('/messages', { params });

			appendMessages(response.data.data || []);
		} catch (error) {
			console.error('Error al cargar más mensajes:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	return {
		messages,
		loading,
		fetchMessages,
		fetchMoreMessages,
		clearMessages,
	};
}
