import { useEffect, useRef, useLayoutEffect } from 'react';
import { useChat } from '../hooks/useChat';
import ChatBubble from '../components/chat/ChatBubble';
import HeaderChat from '../components/HeaderChat';

import '../views/ChatView.css';

export default function ChatView() {
	const { messages, fetchMessages, fetchMoreMessages, loading, hasMore } = useChat();
	const containerRef = useRef<HTMLDivElement>(null);
	const scrollRef = useRef({ prevScrollHeight: 0 });
	const isInitialLoad = useRef(true);

	// Carga inicial de mensajes al montar el componente
	useEffect(() => {
		fetchMessages({
			limit: 30,
			offset: 0,
		});
	}, [fetchMessages]);

	// Lógica para detectar el scroll hacia arriba y cargar más mensajes
	useEffect(() => {
		const el = containerRef.current;
		if (!el || !hasMore || loading) return;

		const handleScroll = () => {
			// Si el scroll está cerca de la parte superior, carga más mensajes
			if (el.scrollTop < 100) {
				scrollRef.current.prevScrollHeight = el.scrollHeight;

				const currentOffset = messages.length;
				fetchMoreMessages({ limit: 30, offset: currentOffset });
			}
		};

		el.addEventListener('scroll', handleScroll);
		return () => el.removeEventListener('scroll', handleScroll);
	}, [loading, hasMore, messages.length, fetchMoreMessages]);

	// Efecto para ajustar la posición del scroll después de que se carguen nuevos mensajes
	useLayoutEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		if (isInitialLoad.current && messages.length > 0) {
			// En la primera carga, desplaza hasta el final de la conversación
			el.scrollTop = el.scrollHeight;
			isInitialLoad.current = false;
		} else if (scrollRef.current.prevScrollHeight > 0) {
			// Después de cargar mensajes adicionales, restaura la posición del scroll
			const newHeight = el.scrollHeight;
			const adjustment = newHeight - scrollRef.current.prevScrollHeight;
			el.scrollTop = el.scrollTop + adjustment;
			scrollRef.current.prevScrollHeight = 0;
		}
	}, [messages.length]);

	return (
		<div className='bg-chat-background text-gray-200 view-chat-container'>
			<HeaderChat messagesTotal={messages.length} />

			<div
				ref={containerRef}
				className='flex flex-col overflow-y-auto h-[calc(100vh-68px)] px-4 py-2 max-w-2xl mx-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800'
			>
				{loading && isInitialLoad.current && (
					<div className='text-center text-sm text-gray-400 py-2'>Cargando mensajes...</div>
				)}

				{[...messages].reverse().map((msg, index, arr) => {
					const prevMessage = arr[index - 1]; // El mensaje siguiente en el array es el anterior en el tiempo

					// Mostrar la cola si es el primer mensaje del grupo o el último del chat
					const showTail = !prevMessage || prevMessage.sender !== msg.sender;

					return (
						<ChatBubble
							key={msg._id}
							message={msg}
							showTail={showTail}
						/>
					);
				})}

				{loading && !isInitialLoad.current && (
					<div className='text-center text-sm text-gray-400 py-2'>Cargando mensajes...</div>
				)}
			</div>
		</div>
	);
}
