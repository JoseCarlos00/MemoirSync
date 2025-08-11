import { memo, useState } from 'react';
import { type Message } from '../../interfaces/message';
import BubbleTail from './ChatBubble/BubbleTail';
import MessageText from './ChatBubble/MessageText';
import MessageImage from './ChatBubble/MessageImage';
import MessageAudio from './ChatBubble/MessageAudio';
import MessageVideo from './ChatBubble/MessageVideo';
import MessageSticker from './ChatBubble/MessageSticker';
import UnsupportedMessage from './ChatBubble/UnsupportedMessage';
import EmojiPickerComponent from './ChatBubble/EmojiPicker';
import { useUser } from '../../hooks/use.user';
import api from '../../services/api'

interface ChatBubbleProps {
	message: Message;
	showTail: boolean;
	onUpdateMessage: (messageId: string, updates: Partial<Message>) => void;
}

function ChatBubble({ message, showTail = false, onUpdateMessage }: ChatBubbleProps) {
	const { isAdmin } = useUser();
	const [openPickerId, setOpenPickerId] = useState<string | null>(null);

	const isMe = message.sender === 'me';
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

	const renderMessageContent = () => {
		switch (message.type) {
			case 'text':
				return <MessageText message={message} />;
			case 'image':
				return (
					<MessageImage
						message={message}
						isMe={isMe}
					/>
				);
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
			await api.patch(`/messages/${messageId}`, { reactionEmoji: emoji });
			// Si la petición es exitosa, no hacemos nada más. La UI ya está actualizada.
		} catch (error) {
			console.error('Error al actualizar la reacción:', error);
			// 3. Rollback: Si falla la petición, revertimos la UI a su estado original.
			onUpdateMessage(messageId, { reactionEmoji: originalReaction });
			// Opcional: Mostrar una notificación de error al usuario.
		}
	};

	return (
		<div className={`flex flex-col relative mb-1 group ${containerClass}`}>
			{showTail && message.type !== 'sticker' && <BubbleTail isMe={isMe} />}

			<div className={`flex flex-col ${bubbleAlignmentClass}`}>
				<div className={`${bubbleBaseClass} ${senderClass} ${tailClass} ${stickerClass} relative`}>
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

					{/* Contenido del mensaje */}
					<div className='text-sm text-white relative'>{renderMessageContent()}</div>
				</div>

				{/* Emoji Reaction */}
				{message.reactionEmoji && (
					<div className='relative -mt-2 z-10 px-2'>
						<span className='bg-gray-700 rounded-full px-1.5 py-1 text-xs'>{message.reactionEmoji}</span>
					</div>
				)}
			</div>
		</div>
	);
}

export default memo(ChatBubble);
