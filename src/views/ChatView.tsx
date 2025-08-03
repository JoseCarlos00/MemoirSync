// src/components/ChatView.jsx
import { useEffect, useRef, useCallback, useState } from 'react';
import { useChat } from '../hooks/useChat';
import ChatBubble from '../components/ChatBubble';

export default function ChatView() {
	const { messages, fetchMessages, fetchMoreMessages, loading } = useChat();
	const containerRef = useRef(null);
	const [page, setPage] = useState(1);

	// Cargar mensajes iniciales
	useEffect(() => {
		fetchMessages({
			limit: 20,
			page: 1,
		});
	}, []);

	// Manejar scroll hacia arriba para cargar más
	const handleScroll = useCallback(() => {
		const el = containerRef.current;
		if (!el || loading) return;

		// Si estamos cerca del tope (scroll alto)
		if (el.scrollTop < 50) {
			const nextPage = page + 1;
			fetchMoreMessages({ limit: 20, page: nextPage });
			setPage(nextPage);
		}
	}, [page, loading]);

	return (
		<div
			ref={containerRef}
			onScroll={handleScroll}
			className='flex flex-col-reverse overflow-y-auto h-[calc(100vh-120px)] px-4 py-2'
		>
			{messages
				.slice() // Copiar array para no mutar
				.reverse() // Invertir para que se vea de abajo hacia arriba
				.map((msg) => (
					<ChatBubble
						key={msg._id}
						message={msg}
					/>
				))}

			{loading && <div className='text-center text-sm text-gray-500 py-2'>Cargando mensajes...</div>}
		</div>
	);
}
