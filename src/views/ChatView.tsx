import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type VirtuosoHandle } from 'react-virtuoso';
import { MessageList } from '../components/chat/MessageList';
import HeaderChat, { type HeaderChatProps } from '../components/HeaderChat';
import { MESSAGE_FETCH_LIMIT } from '../config/constants';
import { type Message } from '../interfaces/message';
import { useUser } from '../hooks/useUser';
import { useChat } from '../hooks/useChat';
import { useLinkingMode } from '../hooks/useLinkingMode';
import { useMessageNavigation } from '../hooks/useMessageNavigation';
import '../views/ChatView.css';

// Componente auxiliar para mostrar estados de carga/error a pantalla completa.
const ChatStateView = ({
	children,
	messagesTotal,
}: { children: React.ReactNode; messagesTotal?: number } & HeaderChatProps) => (
	<div className='bg-chat-background text-gray-200 view-chat-container h-screen flex flex-col'>
		<HeaderChat messagesTotal={messagesTotal} />
		<div className='flex-grow flex items-center justify-center text-center text-sm'>
			{children}
		</div>
	</div>
);

export type ListItem = (Message & { showTail: boolean }) | { type: 'date-separator'; date: string; id: string };

export default function ChatView() {
	const { messages, totalMessages, fetchMessages, fetchMoreMessages, loading, error, hasMore, updateMessage } =
		useChat();
	const { user, isAdmin } = useUser();
	const [localTemporaryStatus, setLocalTemporaryStatus] = useState<string | null>(null);
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

	const {
		isLinkingMode,
		selectedMessageIds,
		isSelectingSource,
		setSelectedMessageIds,
		setIsSelectingSource,
		assignReplyTo,
		toggleLinkingMode,
	} = useLinkingMode({ messages, updateMessage, showTemporaryStatus: (msg) => showTemporaryStatus(msg) });

	const loadMore = useCallback(async () => {
		if (!hasMore || loading) return;
		// Al usar firstItemIndex, Virtuoso maneja el ajuste del scroll automáticamente.
		await fetchMoreMessages({ limit: MESSAGE_FETCH_LIMIT });
	}, [hasMore, loading, fetchMoreMessages]);

	const firstItemIndex = hasMore ? totalMessages - messages.length : 0;

	const showTemporaryStatus = useCallback((message: string) => {
		setLocalTemporaryStatus(message);
		setTimeout(() => {
			setLocalTemporaryStatus(null);
		}, 3000); // Ocultar después de 3 segundos
	}, []);

	const { highlightedMessageId, searchStatusMessage, handleNavigateToReply } = useMessageNavigation({
		messages,
		hasMore,
		loading,
		fetchMoreMessages,
		virtuosoRef,
		firstItemIndex,
		showTemporaryStatus,
	});

	const handleSelectMessage = useCallback(
		(messageId: string) => {
			if (!isLinkingMode) return;

			if (isSelectingSource) {
				// Fase 2: El clic actual selecciona el mensaje de ORIGEN.
				assignReplyTo(messageId);
			} else {
				// Fase 1: El clic actual añade o quita un mensaje de la lista de RESPUESTAS.
				setSelectedMessageIds((prevIds) => {
					if (prevIds.includes(messageId)) {
						return prevIds.filter((id) => id !== messageId); // Deseleccionar
					} else {
						return [...prevIds, messageId];
					}
				});
			}
		},
		[isLinkingMode, isSelectingSource, assignReplyTo, setSelectedMessageIds]
	);

	const renderLinkModeUI = () => {
		if (!isLinkingMode) return null;

		if (isSelectingSource) {
			return (
				<div className='fixed bottom-0 left-0 right-0 p-4 bg-green-800 text-white z-20 text-center'>
					<p className='font-semibold'>Ahora, selecciona el mensaje de ORIGEN.</p>
				</div>
			);
		}

		return (
			<div className='fixed bottom-0 left-0 right-0 p-4 bg-gray-900 text-white z-20'>
				<div className='flex justify-between items-center'>
					<span>{selectedMessageIds.length} mensajes seleccionados</span>
					<div>
						<button
							onClick={() => setIsSelectingSource(true)}
							className='px-4 py-2 bg-blue-500 rounded-lg disabled:opacity-50 mr-2'
							disabled={selectedMessageIds.length === 0}
						>
							Asignar Origen
						</button>
						<button
							onClick={toggleLinkingMode}
							className='px-4 py-2 bg-red-500 rounded-lg'
						>
							Cancelar
						</button>
					</div>
				</div>
			</div>
		);
	};

	const listItems = useMemo(() => {
		if (messages.length === 0) return [];

		const items: ListItem[] = [];
		let lastDate: string | null = null;

		for (let i = 0; i < messages.length; i++) {
			const currentMessage = messages[i];
			const messageDate = new Date(currentMessage.timestamp).toDateString();

			if (messageDate !== lastDate) {
				items.push({
					type: 'date-separator',
					date: currentMessage.timestamp,
					id: `date-${messageDate}`,
				});
				lastDate = messageDate;
			}

			const prevMessage = i > 0 ? messages[i - 1] : null;
			const prevMessageDate = prevMessage ? new Date(prevMessage.timestamp).toDateString() : null;

			const showTail = !prevMessage || prevMessage.sender !== currentMessage.sender || messageDate !== prevMessageDate;

			items.push({ ...currentMessage, showTail });
		}
		return items;
	}, [messages]);

	// Manejo de estados iniciales (carga y error)
	const isInitialState = messages.length === 0;
	if (isInitialState && (loading || error)) {
		return (
			<ChatStateView messagesTotal={totalMessages}>
				{loading && <p className='text-gray-400'>Cargando mensajes...</p>}
				{error && <p className='text-red-400'>{error}</p>}
			</ChatStateView>
		);
	}

	return (
		<div className='bg-chat-background text-gray-200 view-chat-container'>
			<HeaderChat messagesTotal={totalMessages}>
				{isAdmin && (
					<button
						onClick={toggleLinkingMode}
						className={`px-3 py-1 text-xs rounded ${isLinkingMode ? 'bg-red-500' : 'bg-blue-500'} hover:bg-opacity-80`}
					>
						{isLinkingMode ? 'Cancelar Vínculo' : 'Activar Modo Vínculo'}
					</button>
				)}
			</HeaderChat>

			{searchStatusMessage && (
				<div className='absolute top-20 left-1/2 -translate-x-1/2 bg-gray-700 text-white px-4 py-2 rounded-md shadow-lg z-20 animate-pulse'>
					{searchStatusMessage}
				</div>
			)}

			{localTemporaryStatus && (
				<div className='absolute top-20 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg z-20'>
					{localTemporaryStatus}
				</div>
			)}

			<MessageList
				items={listItems}
				loading={loading}
				hasMore={hasMore}
				error={error}
				firstItemIndex={firstItemIndex}
				virtuosoRef={virtuosoRef}
				loadMore={loadMore}
				user={user}
				updateMessage={updateMessage}
				handleNavigateToReply={handleNavigateToReply}
				highlightedMessageId={highlightedMessageId}
				handleSelectMessage={handleSelectMessage}
				selectedMessageIds={selectedMessageIds}
				isLinkingMode={isLinkingMode}
			/>

			{renderLinkModeUI()}
		</div>
	);
}
