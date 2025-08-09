import { useEffect, useRef, useLayoutEffect } from 'react';
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

	const rowVirtualizer = useVirtualizer({
		count: messages.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 100, // Un tamaño estimado por mensaje, ajústalo a tu promedio
		overscan: 10, // Renderiza 10 items extra fuera de la vista para un scroll más suave
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
	}, [rowVirtualizer.getVirtualItems(), hasMore, loading, messages.length, fetchMoreMessages]);

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
									style={{
										position: 'absolute',
										left: 0,
										width: '100%',
										height: `${virtualItem.size}px`,
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
