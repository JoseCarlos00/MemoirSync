import { useEffect, useRef, useLayoutEffect, useState } from 'react';
import { useChat } from '../hooks/useChat';
import ChatBubble from '../components/ChatBubble';
// import Header from '../components/Header'
import HeaderChat from '../components/HeaderChat'

import '../views/ChatView.css'; 

export default function ChatView() {
	const { messages, fetchMessages, fetchMoreMessages, loading, hasMore } = useChat();
	const containerRef = useRef<HTMLDivElement>(null);

	// Almacena la altura del scroll antes de cargar más mensajes para poder restaurar la posición.
	const scrollRef = useRef({
		prevScrollHeight: 0,
	});

	// Sirve para saber si es la primera carga y así hacer scroll hasta abajo.
	const [isInitialLoad, setIsInitialLoad] = useState(true);

	// Carga inicial de mensajes
	useEffect(() => {
		fetchMessages({
			limit: 5,
			offset: 0,
		});
	}, [fetchMessages]); // fetchMessages es estable gracias a useCallback.

	// Efecto para manejar el scroll y la carga de más mensajes
	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		const handleScroll = () => {
			// Evitar peticiones si ya se está cargando o no hay más mensajes.
			if (loading || !hasMore) return;

			// Cargar más cuando el scroll está cerca de la parte superior
			if (el.scrollTop < 20) {
				// Guardar la altura del scroll ANTES de pedir más mensajes.
				scrollRef.current.prevScrollHeight = el.scrollHeight;

				const currentOffset = messages.length ;
				console.log('currentOffset', currentOffset);
				
				fetchMoreMessages({ limit: 5, offset: currentOffset });
			}
		};

		el.addEventListener('scroll', handleScroll);
		return () => el.removeEventListener('scroll', handleScroll);
	}, [loading, hasMore, messages.length, fetchMoreMessages]);

	// Efecto para ajustar la posición del scroll después de que se carguen los mensajes.
	useLayoutEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		if (isInitialLoad && messages.length > 0) {
			// En la carga inicial, mover el scroll hasta el final (el mensaje más nuevo).
			el.scrollTop = el.scrollHeight;
			setIsInitialLoad(false);
		} else if (scrollRef.current.prevScrollHeight > 0) {
			// Después de cargar más, restaurar la posición del scroll.
			const newHeight = el.scrollHeight;
			el.scrollTop += newHeight - scrollRef.current.prevScrollHeight;
			scrollRef.current.prevScrollHeight = 0; // Resetear para la próxima carga.
		}
	}, [messages, isInitialLoad]);

	console.log('messages', messages);
	

	return (
		<div className='bg-chat-background text-gray-200 view-chat-container'>
			{/* <Header /> */}
			<HeaderChat messagesTotal={messages.length} />

			<div
				ref={containerRef}
				className='flex flex-col-reverse overflow-y-auto h-[calc(100vh-68px)] px-4 py-2 max-w-2xl mx-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800'
			>
				{messages.map((msg) => (
					<ChatBubble
						key={msg._id}
						message={msg}
					/>
				))}

				{loading && <div className='text-center text-sm text-gray-400 py-2'>Cargando mensajes...</div>}
			</div>
		</div>
	);
}
