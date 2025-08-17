import { memo, useState, useCallback } from 'react';
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
	const [isPickerOpen, setIsPickerOpen] = useState(false);

	const isMe = message.sender === myUserName;

	const bubbleClasses = [
		'max-w-[70%] rounded-lg shadow relative p-1', // Clases base
		isMe ? 'bg-chat-sent' : 'bg-chat-received',
		showTail && message.type !== 'sticker' ? (isMe ? 'rounded-tr-none' : 'rounded-tl-none') : '',
		message.type === 'sticker' ? 'bg-transparent shadow-none' : 'text-white',
		isHighlighted ? 'message-highlight' : '',
		isLinkingMode ? 'cursor-pointer border-2' : '',
		isSelected ? 'border-blue-700' : 'border-transparent',
	]
		.filter(Boolean)
		.join(' ');

	const handleSelectMessage = useCallback(() => {
		if (isLinkingMode) {
			onSelectMessage(message._id);
		}
	}, [isLinkingMode, message._id, onSelectMessage]);

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

	const handleTogglePicker = useCallback(() => {
		setIsPickerOpen((prev) => !prev);
	}, []);

	const handleSendReaction = useCallback(
		async (emoji: string) => {
			setIsPickerOpen(false);

			const originalReaction = message.reactionEmoji;
			const messageId = message._id;

			// 1. Actualización optimista de la UI
			onUpdateMessage(messageId, { reactionEmoji: emoji });

			try {
				// 2. Persistir el cambio en el backend
				await api.patch(`/messages/${messageId}/react`, { reactionEmoji: emoji });
			} catch (error) {
				console.error('Error al actualizar la reacción:', error);
				// 3. Rollback: Si falla la petición, revertimos la UI a su estado original.
				onUpdateMessage(messageId, { reactionEmoji: originalReaction });
			}
		},
		[message._id, message.reactionEmoji, onUpdateMessage]
	);

	return (
		<div
			className={`flex flex-col relative mb-1 group ${isMe ? 'justify-end' : 'justify-start'}`}
			onClick={handleSelectMessage}
		>
			{showTail && message.type !== 'sticker' && <BubbleTail isMe={isMe} />}

			<div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
				<div className={bubbleClasses}>
					{/* Emoji Picker */}
					{isAdmin && (
						<EmojiPickerComponent
							isOpen={isPickerOpen}
							onToggle={handleTogglePicker}
							onSendReaction={handleSendReaction}
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
