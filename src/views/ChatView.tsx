import { useEffect, useRef, useCallback } from 'react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import { useChat } from '../hooks/useChat';
import ChatBubble from '../components/chat/ChatBubble';
import HeaderChat from '../components/HeaderChat';
import '../views/ChatView.css';

const MESSAGE_FETCH_LIMIT = 30

// Componente auxiliar para mostrar estados de carga/error a pantalla completa.
const ChatStateView = ({ children, messagesTotal = 0 }: { children: React.ReactNode; messagesTotal?: number }) => (
	<div className='bg-chat-background text-gray-200 view-chat-container h-screen flex flex-col'>
		<HeaderChat messagesTotal={messagesTotal} />
		<div className='flex-grow flex items-center justify-center text-center text-sm'>
			{children}
		</div>
	</div>
);

export default function ChatView() {
	const { messages, totalMessages, fetchMessages, fetchMoreMessages, loading, error, hasMore, updateMessage } =
		useChat();

	const virtuosoRef = useRef<VirtuosoHandle>(null);

	// Carga inicial de mensajes.
	// Se ejecuta solo una vez cuando el componente se monta, si no hay mensajes.
	useEffect(() => {
		if (messages.length === 0) {
			fetchMessages({ limit: MESSAGE_FETCH_LIMIT });
		}
		// La dependencia en fetchMessages es correcta. No necesitamos messages.length
		// aquí porque solo queremos que se ejecute una vez al inicio si está vacío.
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchMessages]);

	const loadMore = useCallback(async () => {
		if (!hasMore || loading) return;
		// Al usar firstItemIndex, Virtuoso maneja el ajuste del scroll automáticamente.
		await fetchMoreMessages({ limit: MESSAGE_FETCH_LIMIT });
	}, [hasMore, loading, fetchMoreMessages]);

	const firstItemIndex = hasMore ? totalMessages - messages.length : 0;

	// Manejo de estados iniciales (carga y error)
	const isInitialState = messages.length === 0;
	if (isInitialState && (loading || error)) {
		return (
			<ChatStateView>
				{loading && <p className='text-gray-400'>Cargando mensajes...</p>}
				{error && <p className='text-red-400'>{error}</p>}
			</ChatStateView>
		);
	}

	return (
		<div className='bg-chat-background text-gray-200 view-chat-container'>
			<HeaderChat messagesTotal={totalMessages} />

			<Virtuoso
				ref={virtuosoRef}
				style={{ height: 'calc(100vh - 88px)' }}
				firstItemIndex={firstItemIndex}
				followOutput='auto'
				data={messages}
				initialTopMostItemIndex={messages.length - 1}
				startReached={loadMore}
				computeItemKey={(_index, msg) => msg._id}
				increaseViewportBy={{ top: 800, bottom: 200 }}
				itemContent={(index, msg) => {
					// `index` es el índice absoluto en la lista virtual.
					// Necesitamos calcular el índice relativo al array `messages`.
					const localIndex = index - firstItemIndex;
					const prevMessage = messages[localIndex - 1];

					// La cola se muestra si es el primer mensaje del array (no hay anterior)
					// o si el emisor del mensaje anterior es diferente.
					const showTail = !prevMessage || prevMessage.sender !== msg.sender;

					return (
						<ChatBubble
							message={msg}
							showTail={showTail}
							onUpdateMessage={updateMessage}
						/>
					);
				}}
				components={{
					Item: ({ children, ...props }) => (
						<div
							{...props}
							className='px-4 max-w-2xl mx-auto mb-2'
						>
							{children}
						</div>
					),
					Header: () => {
						// Solo muestra el indicador de carga si realmente está cargando y hay más mensajes.
						// Muestra "Fin de la conversación" solo si no está cargando y ya no hay más mensajes.
						return (
							<div className='h-12 flex justify-center items-center text-center text-sm text-gray-400'>
								{loading && hasMore && 'Cargando más mensajes...'}
								{!loading && !hasMore && messages.length > 0 && 'Fin de la conversación.'}
							</div>
						);
					},
					Footer: () => (
						<div className='pb-2'>{error && <div className='text-center text-sm text-red-400 py-2'>{error}</div>}</div>
					),
				}}
				className='scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800'
			/>
		</div>
	);
}
