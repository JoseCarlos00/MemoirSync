import { type Message } from '../../interfaces/message';
import BubbleTail from './ChatBubble/BubbleTail';
import MessageText from './ChatBubble/MessageText';
import MessageImage from './ChatBubble/MessageImage';
import MessageAudio from './ChatBubble/MessageAudio';
import MessageVideo from './ChatBubble/MessageVideo';
import MessageSticker from './ChatBubble/MessageSticker';
import UnsupportedMessage from './ChatBubble/UnsupportedMessage';
import { useUser } from '../../hooks/use.user';
import EmojiPickerComponent from './ChatBubble/EmojiPicker'

interface ChatBubbleProps {
	message: Message;
	showTail: boolean;
}

export default function ChatBubble({ message, showTail = false }: ChatBubbleProps) {
	const { isAdmin } = useUser();

	const isMe = message.sender === 'me';
	const containerClass = isMe ? 'justify-end' : 'justify-start';

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

	return (
		<div className={`flex relative mb-2 ${containerClass}`}>
			{showTail && message.type !== 'sticker' && <BubbleTail isMe={isMe} />}
			<div className={`${bubbleBaseClass} ${senderClass} ${tailClass} ${stickerClass}`}>
				<div className='text-sm text-white'>{renderMessageContent()}</div>
			</div>

      {isAdmin && (
        <EmojiPickerComponent message={message} />
      )}
		</div>
	);
}
