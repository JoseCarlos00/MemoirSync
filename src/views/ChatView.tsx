import { useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { useChat } from '../hooks/useChat';
import ChatBubble from '../components/chat/ChatBubble';
import HeaderChat from '../components/HeaderChat';
import { useVirtualizer } from '@tanstack/react-virtual';

import '../views/ChatView.css';

export default function ChatView() {
	const { messages, fetchMessages, fetchMoreMessages, loading, hasMore, updateMessage } = useChat();
	const parentRef = useRef<HTMLDivElement>(null);

	// Refs para mantener la posición del scroll
	const isFetchingMore = useRef(false);
	const prevScrollHeight = useRef(0);
	const initialLoadComplete = useRef(false);

	// Carga inicial de mensajes al montar el componente
	useEffect(() => {
		fetchMessages({
			limit: 30,
			offset: 0,
		});
	}, [fetchMessages]);

	const estimateSize = useCallback(
		(index: number) => {
			const message = messages[index];
			if (!message) return 100; // Un valor por defecto razonable

			// Altura base para cualquier burbuja (padding, etc.)
			let height = 40;

			switch (message.type) {
				case 'text':
					// Estimación basada en la longitud del texto.
					// Aprox. 45 caracteres por línea en móvil, cada línea ~20px de alto.
					// Se suma un poco más por el timestamp.
					height += Math.ceil(message.content.length / 45) * 20 + 20;
					break;
				case 'image':
					// Con el nuevo MessageImage, la altura es predecible.
					// max-w-xs (320px) + aspect-square. El caption y la hora se superponen.
					height += 320 + 8; // 320px de la imagen + 8px de padding (p-1)
					break;
				case 'audio':
					height += 60; // Altura para un reproductor de audio
					break;
				case 'video':
					height += 250; // Altura promedio para un video
					break;
				case 'sticker':
					// El componente de sticker tiene un tamaño fijo de 190x190
					// más padding y el timestamp.
					height += 190 + 10 + 16; // 190px (img) + 10px (pb-2.5) + ~16px (TimeFormat)
					break;
				default:
					height += 50; // Para mensajes no soportados
			}

			// Si el mensaje tiene una reacción, añade espacio extra
			if (message.reactionEmoji) height += 24;

			return height;
		},
		[messages]
	);

	const rowVirtualizer = useVirtualizer({
		count: messages.length,
		getScrollElement: () => parentRef.current,
		estimateSize,
		overscan: 10,
	});

	// Lógica para infinite scroll
	useEffect(() => {
		const virtualItems = rowVirtualizer.getVirtualItems();
		if (virtualItems.length === 0 || !hasMore || loading) {
			return;
		}

		const firstItem = virtualItems[0];
		if (firstItem && firstItem.index < 5 && !isFetchingMore.current) {
			// Cargar más cuando estemos cerca de los primeros 5 items
			isFetchingMore.current = true;
			prevScrollHeight.current = rowVirtualizer.getTotalSize();
			fetchMoreMessages({ limit: 30, offset: messages.length });
		}
	}, [rowVirtualizer, hasMore, loading, messages.length, fetchMoreMessages]);

	// Efecto para ajustar la posición del scroll después de que se carguen nuevos mensajes
	useLayoutEffect(() => {
		if (messages.length === 0) return;

		const parentElement = parentRef.current;
		if (!parentElement) return;

		// Caso 1: Carga inicial. Ir al final de la lista.
		if (!initialLoadComplete.current) {
			rowVirtualizer.scrollToIndex(messages.length - 1, { align: 'end' });
			initialLoadComplete.current = true;
			return;
		}

		// Caso 2: Se cargaron más mensajes. Mantener la posición del scroll.
		if (isFetchingMore.current) {
			const newScrollHeight = rowVirtualizer.getTotalSize();
			parentElement.scrollTop += newScrollHeight - prevScrollHeight.current;
			isFetchingMore.current = false;
		}
	}, [messages.length, rowVirtualizer]);

	return (
		<div className='bg-chat-background text-gray-200 view-chat-container'>
			<HeaderChat messagesTotal={messages.length} />

			<div
				ref={parentRef}
				className='overflow-y-auto h-[calc(100vh-68px)] px-4 py-2 max-w-2xl mx-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800'
			>
				{loading && messages.length === 0 ? (
					<div className='text-center text-sm text-gray-400 py-2'>Cargando mensajes...</div>
				) : (
					<div
						style={{
							height: `${rowVirtualizer.getTotalSize()}px`,
							width: '100%',
							position: 'relative',
						}}
					>
						{isFetchingMore.current && (
							<div className='text-center text-sm text-gray-400 py-2'>Cargando más...</div>
						)}
						{rowVirtualizer.getVirtualItems().map((virtualItem) => {
							const msg = messages[virtualItem.index];
							const prevMessage = messages[virtualItem.index - 1];

							// Mostrar la cola si es el primer mensaje del grupo o el último del chat
							const showTail = !prevMessage || prevMessage.sender !== msg.sender;

							return (
								<div
									key={msg._id}
									ref={rowVirtualizer.measureElement}
									data-index={virtualItem.index}
									style={{
										position: 'absolute',
										top: 0,
										left: 0,
										width: '100%',
										transform: `translateY(${virtualItem.start}px)`,
									}}
								>
									<ChatBubble
										message={msg}
										showTail={showTail}
										onUpdateMessage={updateMessage}
									/>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
