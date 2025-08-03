import { useEffect, useRef, useLayoutEffect, useState } from 'react';
import { useChat } from '../hooks/useChat';
import ChatBubble from '../components/ChatBubble';

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
			limit: 20,
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
			if (el.scrollTop < 100) {
				// Guardar la altura del scroll ANTES de pedir más mensajes.
				scrollRef.current.prevScrollHeight = el.scrollHeight;

				const currentOffset = messages.length;
				fetchMoreMessages({ limit: 20, offset: currentOffset });
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

	return (
		<>
			<h1>Chat</h1>

			<div
				ref={containerRef}				
				className='flex flex-col-reverse overflow-y-auto h-[calc(100vh-120px)] px-4 py-2'
			>
				{/* El backend ya envía los mensajes en orden descendente, y flex-col-reverse se encarga de la vista. No es necesario .reverse() */}
				{messages.map((msg) => (
					<ChatBubble
						key={msg._id} // Usar un ID único y estable
						message={msg}
					/>
				))}

				{loading && <div className='text-center text-sm text-gray-500 py-2'>Cargando mensajes...</div>}
			</div>
		</>
	);
}
