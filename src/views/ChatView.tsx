import { useEffect, useRef, useCallback, useState } from 'react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import { useChat } from '../hooks/useChat';
import ChatBubble from '../components/chat/ChatBubble';
import HeaderChat, { type HeaderChatProps } from '../components/HeaderChat';
import '../views/ChatView.css';
import { useAuthStore } from '../store/authStore'
import api from '../services/api'
import { useUser } from '../hooks/use.user'

const MESSAGE_FETCH_LIMIT = 30

// Componente auxiliar para mostrar estados de carga/error a pantalla completa.
const ChatStateView = ({
	children,
	messagesTotal = 0,
}: { children: React.ReactNode; messagesTotal?: number } & HeaderChatProps) => (
	<div className='bg-chat-background text-gray-200 view-chat-container h-screen flex flex-col'>
		<HeaderChat messagesTotal={messagesTotal} />
		<div className='flex-grow flex items-center justify-center text-center text-sm'>
			{children}
		</div>
	</div>
);

export default function ChatView() {
	const user = useAuthStore().user;
	const { messages, totalMessages, fetchMessages, fetchMoreMessages, loading, error, hasMore, updateMessage } =
		useChat();
	const isAdmin = useUser().isAdmin

	const [searchingFor, setSearchingFor] = useState<string | null>(null);
	const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
	const [searchStatusMessage, setSearchStatusMessage] = useState<string | null>(null);

	// Estados para el modo de vinculación
	const [isLinkingMode, setIsLinkingMode] = useState(false);
	const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
	const [isSelectingSource, setIsSelectingSource] = useState(false);

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

	const highlightMessage = useCallback((messageId: string) => {
		setHighlightedMessageId(messageId);
		// Quitar el resaltado después de un tiempo para que sea temporal
		setTimeout(() => {
			setHighlightedMessageId(null);
		}, 2500); // 2.5 segundos
	}, []);

	const loadMore = useCallback(async () => {
		if (!hasMore || loading) return;
		// Al usar firstItemIndex, Virtuoso maneja el ajuste del scroll automáticamente.
		await fetchMoreMessages({ limit: MESSAGE_FETCH_LIMIT });
	}, [hasMore, loading, fetchMoreMessages]);

	const firstItemIndex = hasMore ? totalMessages - messages.length : 0;

	const showTemporaryStatus = useCallback((message: string) => {
		setSearchStatusMessage(message);
		setTimeout(() => {
			setSearchStatusMessage(null);
		}, 3000); // Ocultar después de 3 segundos
	}, []);

	const handleNavigateToReply = useCallback(
		(messageId: string) => {
			const index = messages.findIndex((m) => m._id === messageId);

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
		[messages, firstItemIndex, hasMore, highlightMessage, showTemporaryStatus]
	);

	// Efecto para buscar y cargar mensajes hasta encontrar el respondido.
	useEffect(() => {
		const findAndLoad = async () => {
			if (!searchingFor || loading) return;

			const index = messages.findIndex((m) => m._id === searchingFor);
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
				setSearchingFor(null);
			}
		};

		findAndLoad();
	}, [
		searchingFor,
		messages,
		hasMore,
		loading,
		fetchMoreMessages,
		firstItemIndex,
		highlightMessage,
		showTemporaryStatus,
	]);

	// --- Lógica del Modo de Vínculo (Flujo: Seleccionar respuestas -> Asignar Origen -> Seleccionar Origen) ---

	const assignReplyTo = useCallback(
		async (sourceId: string) => {
			if (selectedMessageIds.length === 0) return;

			// Prevenir que un mensaje se responda a sí mismo.
			if (selectedMessageIds.includes(sourceId)) {
				showTemporaryStatus('No se puede asignar un mensaje como respuesta a sí mismo.');
				setIsSelectingSource(false); // Volver al modo de selección de respuestas
				return;
			}

			try {
				// Guardamos una copia de los IDs a procesar
				const idsToUpdate = [...selectedMessageIds];

				// 1. Actualización optimista en la UI
				const sourceMessage = messages.find((m) => m._id === sourceId);
				idsToUpdate.forEach((messageId) => {
					updateMessage(messageId, { replyTo: sourceMessage ?? ({ _id: sourceId } as any) });
				});

				// 2. Limpiamos el estado inmediatamente para que la UI vuelva a la normalidad
				setSelectedMessageIds([]);
				setIsSelectingSource(false);
				setIsLinkingMode(false);
				showTemporaryStatus(`Vinculando ${idsToUpdate.length} mensaje(s)...`);

				// 3. Peticiones al backend en segundo plano
				await Promise.all(
					idsToUpdate.map(async (messageId) => {
						try {
							await api.put(`/messages/${messageId}/reply`, { replyTo: sourceId });
						} catch (error) {
							console.error(`Fallo al vincular el mensaje ${messageId}:`, error);
							// Aquí se podría implementar un rollback para el mensaje específico que falló
						}
					})
				);

				console.log('Todos los vínculos se procesaron.');
			} catch (error) {
				console.error('Error al asignar el vínculo:', error);
				showTemporaryStatus('Ocurrió un error al vincular los mensajes.');
				// Rollback general si es necesario
			}
		},
		[selectedMessageIds, updateMessage, messages, showTemporaryStatus]
	);

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
		[isLinkingMode, isSelectingSource, assignReplyTo]
	);

	const toggleLinkingMode = useCallback(() => {
		const nextState = !isLinkingMode;
		setIsLinkingMode(nextState);
		// Resetear todo al salir del modo
		if (!nextState) {
			setSelectedMessageIds([]);
			setIsSelectingSource(false);
		}
	}, []);

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
							myUserName={user?.username}
							onNavigateToReply={handleNavigateToReply}
							isHighlighted={msg._id === highlightedMessageId}
							
							// --- Lógica del Modo de Vínculo ---
							onSelectMessage={handleSelectMessage}
							isSelected={isLinkingMode && selectedMessageIds.includes(msg._id)}
							isLinkingMode={isLinkingMode}
						/>
					);
				}}
				components={{
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					Item: ({ children, item, ...props }) => (
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
			{renderLinkModeUI()}
		</div>
	);
}
