// useChat.ts
import { useCallback } from 'react';
import { useChatStore } from '../store/chatStore';
import api from '../services/api';
import { MEDIA_URL_REPLACE_FROM, MEDIA_URL_REPLACE_TO } from '../config/constants';
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

	const totalMessages = useChatStore((state) => state.totalMessages);
	const hasMore = useChatStore((state) => state.messages.length < state.totalMessages);

	const fetchMessages = useCallback(
		async (options: FetchMessagesOptions = {}) => {
			setLoading(true);
			try {
				const { data } = await api.get('/messages', { params: options });

				// const parsedMessages = parseMessage(data.messages as Message[]);

				setMessages(data.messages);
				setTotalMessages(data.total);
				setError(null); // Limpiar errores si la petición es exitosa

				console.log('Messages fetched:', data);
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

				// const parsedMessages = parseMessage(data.messages as Message[]);
				
				addMessages(data.messages);
				// El backend puede devolver un total actualizado (ej. si se añaden nuevos mensajes mientras navegas).
				// Actualizarlo asegura que la condición `hasMore` sea siempre correcta.
				if (typeof data.total === 'number') {
					setTotalMessages(data.total);
				}

				setError(null);
				console.log('More messages fetched:',data);
				
			} catch (error) {
				console.error('Error fetching more messages:', error);
				setError('No se pudieron cargar más mensajes.');
			} finally {
				setLoading(false);
			}
		},
		[addMessages, setLoading, setTotalMessages, setError]
	);

	const updateMessage = useCallback(
		(messageId: string, updates: Partial<Message>) => {
			updateMessageInStore(messageId, updates);
		},
		[updateMessageInStore]
	);

	return {
		messages,
		totalMessages,
		fetchMessages,
		fetchMoreMessages,
		loading,
		hasMore,
		error,
		updateMessage,
	};
}

export function parseMessage(messages:Message[]) {
	// Si no hay valores para reemplazar, devolvemos los mensajes originales.
	if (!MEDIA_URL_REPLACE_FROM || !MEDIA_URL_REPLACE_TO) {
		return messages;
	}

	return messages.map((message) => {
		// Solo modifica mensajes que no son de texto y tienen una mediaUrl
		if (message.type !== 'text') {
			return {
				...message,
				mediaUrl: message.mediaUrl.replace(MEDIA_URL_REPLACE_FROM, MEDIA_URL_REPLACE_TO),
			};
		}

		if (message.replyTo && message.replyTo.type !== 'text') {
			return {
				...message,
				replyTo: {
					...message.replyTo,
					mediaUrl: message.replyTo.mediaUrl.replace(MEDIA_URL_REPLACE_FROM, MEDIA_URL_REPLACE_TO),
				}
		}
		}
		// Devuelve el mensaje original si no necesita modificación.
		return message;
	});
}
