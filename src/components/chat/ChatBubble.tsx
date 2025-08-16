import { memo, useState } from 'react';
import { type Message } from '../../interfaces/message';
import BubbleTail from './ChatBubble/BubbleTail';
import MessageText from './ChatBubble/MessageText';
import MessageImage from './ChatBubble/MessageImage';
import MessageAudio from './ChatBubble/MessageAudio';
import MessageVideo from './ChatBubble/MessageVideo';
import MessageSticker from './ChatBubble/MessageSticker';
import UnsupportedMessage from './ChatBubble/UnsupportedMessage';
import EmojiPickerComponent from './EmojiPicker';
import ReplyPreview from './ReplyPreview';
import { useUser } from '../../hooks/useUser';
import api from '../../services/api'

interface ChatBubbleProps {
	message: Message;
	showTail: boolean;
	myUserName?: string;
	onUpdateMessage: (messageId: string, updates: Partial<Message>) => void;
	onNavigateToReply: (messageId: string) => void;
	isHighlighted?: boolean;

	// Nuevas props para el modo de vinculación
	isLinkingMode: boolean;
	isSelected: boolean;
	onSelectMessage: (messageId: string) => void;
}

function ChatBubble({
	message,
	showTail = false,
	myUserName,
	onUpdateMessage,
	onNavigateToReply,
	isHighlighted = false,
	isLinkingMode,
	isSelected,
	onSelectMessage,
}: ChatBubbleProps) {
	const { isAdmin } = useUser();
	const [openPickerId, setOpenPickerId] = useState<string | null>(null);

	const isMe = message.sender === myUserName;
	const containerClass = isMe ? 'justify-end' : 'justify-start';
	const bubbleAlignmentClass = isMe ? 'items-end' : 'items-start';

	// Clases base para la burbuja
	const bubbleBaseClass = 'max-w-[70%] rounded-lg shadow relative';
	// Clases específicas del emisor
	const senderClass = isMe ? 'bg-chat-sent' : 'bg-chat-received';

	// Clases para el "Tail" (solo si showTail es true)
	const tailClass = showTail ? (isMe ? 'rounded-tr-none' : 'rounded-tl-none') : '';
	// Clases especiales para stickers
	const stickerClass = message.type === 'sticker' ? 'bg-transparent shadow-none' : 'text-white';

	// Clase para el resaltado temporal
	const highlightClass = isHighlighted ? 'message-highlight' : '';

	// Nuevas clases para el modo de vinculación
	const linkingClass = isLinkingMode ? 'cursor-pointer border-2' : '';
	const selectedClass = isSelected ? 'border-blue-500' : 'border-transparent';

	const renderMessageContent = () => {
		switch (message.type) {
			case 'text':
				return <MessageText message={message} />;
			case 'image':
				return <MessageImage message={message} />;
			case 'audio':
				return (
					<MessageAudio
						message={message}
						isMe={isMe}
					/>
				);
			case 'video':
				return <MessageVideo message={message} />;
			case 'sticker':
				return <MessageSticker message={message} />;
			default:
				return <UnsupportedMessage />;
		}
	};

	const togglePicker = (id: string) => {
		setOpenPickerId((current) => (current === id ? null : id));
	};

	const sendReaction = async (emoji: string) => {
		setOpenPickerId(null);

		const originalReaction = message.reactionEmoji;
		const messageId = message._id;

		// 1. Actualización optimista de la UI
		onUpdateMessage(messageId, { reactionEmoji: emoji });

		try {
			// 2. Persistir el cambio en el backend
			// Usamos PATCH para una actualización parcial del recurso del mensaje
			await api.patch(`/messages/${messageId}/react`, { reactionEmoji: emoji });
			// Si la petición es exitosa, no hacemos nada más. La UI ya está actualizada.
		} catch (error) {
			console.error('Error al actualizar la reacción:', error);
			// 3. Rollback: Si falla la petición, revertimos la UI a su estado original.
			onUpdateMessage(messageId, { reactionEmoji: originalReaction });
			// Opcional: Mostrar una notificación de error al usuario.
		}
	};

	return (
		<div
			className={`flex flex-col relative mb-1 group ${containerClass}`}
			onClick={() => onSelectMessage(message._id)}
		>
			{showTail && message.type !== 'sticker' && <BubbleTail isMe={isMe} />}

			<div className={`flex flex-col ${bubbleAlignmentClass}`}>
				<div
					className={`${bubbleBaseClass} ${senderClass} ${tailClass} ${stickerClass} ${highlightClass} p-1 relative ${linkingClass} ${selectedClass}`}
				>
					{/* Emoji Picker */}
					{isAdmin && (
						<EmojiPickerComponent
							key={message._id}
							isOpen={openPickerId === message._id}
							onToggle={() => togglePicker(message._id)}
							onSendReaction={sendReaction}
							isMe={isMe}
						/>
					)}
					{/* Contenedor del mensaje */}
					<div className='text-sm text-white relative'>
						{message.replyTo && (
							<ReplyPreview
								repliedMessage={message.replyTo}
								isMe={isMe}
								onNavigate={() => message.replyTo?._id && onNavigateToReply(message.replyTo._id)}
							/>
						)}
						{/* Contenido del mensaje */}
						{renderMessageContent()}
					</div>
				</div>

				{/* Emoji Reaction */}
				{message.reactionEmoji && (
					<div className='relative -mt-1.5 z-10 px-2'>
						<span className='bg-gray-800 rounded-full px-1 py-0.5 text-xs border border-[#161717]'>
							{message.reactionEmoji}
						</span>
					</div>
				)}
			</div>
		</div>
	);
}

export default memo(ChatBubble);
