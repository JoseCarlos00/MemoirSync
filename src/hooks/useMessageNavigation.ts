import { useState, useCallback, useEffect, type RefObject } from 'react';
import { type VirtuosoHandle } from 'react-virtuoso';
import { type Message } from '../interfaces/message';
import { HIGHLIGHT_DURATION_MS, MESSAGE_FETCH_LIMIT } from '../config/constants';

interface UseMessageNavigationProps {
	messages: Message[];
	hasMore: boolean;
	loading: boolean;
	fetchMoreMessages: (options?: { limit?: number }) => Promise<void>;
	virtuosoRef: RefObject<VirtuosoHandle | null>;
	firstItemIndex: number;
	showTemporaryStatus: (message: string) => void;
}

export const useMessageNavigation = ({
	messages,
	hasMore,
	loading,
	fetchMoreMessages,
	virtuosoRef,
	firstItemIndex,
	showTemporaryStatus,
}: UseMessageNavigationProps) => {
	const [searchingFor, setSearchingFor] = useState<string | null>(null);
	const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
	const [searchStatusMessage, setSearchStatusMessage] = useState<string | null>(null);

	const highlightMessage = useCallback((messageId: string) => {
		setHighlightedMessageId(messageId);
		// Quitar el resaltado después de un tiempo para que sea temporal
		setTimeout(() => {
			setHighlightedMessageId(null);
		}, HIGHLIGHT_DURATION_MS);
	}, []);

	const handleNavigateToReply = useCallback(
		(messageId: string) => {
			const index = messages.findIndex(m => m._id === messageId);

			if (index !== -1 && virtuosoRef.current) {
				virtuosoRef.current.scrollToIndex({
					index: index + firstItemIndex, // Virtuoso necesita el índice absoluto
					align: 'center',
					behavior: 'smooth',
				});
				highlightMessage(messageId);
			} else if (hasMore) {
				setSearchStatusMessage('Buscando mensaje original...');
				setSearchingFor(messageId);
			} else {
				showTemporaryStatus('El mensaje original no se pudo encontrar y no hay más mensajes que cargar.');
			}
		},
		[messages, firstItemIndex, hasMore, highlightMessage, showTemporaryStatus, virtuosoRef]
	);

	// Efecto para buscar y cargar mensajes hasta encontrar el respondido.
	useEffect(() => {
		const findAndLoad = async () => {
			if (!searchingFor || loading) return;

			const index = messages.findIndex(m => m._id === searchingFor);
			if (index !== -1) {
				// Mensaje encontrado, hacemos scroll, lo resaltamos y terminamos la búsqueda.
				virtuosoRef.current?.scrollToIndex({
					index: index + firstItemIndex,
					align: 'center',
					behavior: 'smooth',
				});
				highlightMessage(searchingFor);
				setSearchStatusMessage(null); // Limpiar mensaje de estado
				setSearchingFor(null);
			} else if (hasMore) {
				// Si no se encuentra y hay más, cargamos el siguiente lote.
				await fetchMoreMessages({ limit: MESSAGE_FETCH_LIMIT });
			} else {
				// No hay más mensajes y no se encontró.
				showTemporaryStatus('No se pudo encontrar el mensaje original tras buscar en todo el historial.');
				setSearchStatusMessage(null);
				setSearchingFor(null);
			}
		};

		findAndLoad();
	}, [searchingFor, messages, hasMore, loading, fetchMoreMessages, firstItemIndex, highlightMessage, showTemporaryStatus, virtuosoRef]);

	return { highlightedMessageId, searchStatusMessage, handleNavigateToReply };
};
