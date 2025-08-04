import { type Message } from '../interfaces/message';


interface ChatBubbleProps {
	message: Message;
}
export default function ChatBubble({ message }: ChatBubbleProps) {
	const isMe = message.sender === 'me';

	return (
		<div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2`}>
			<div
				className={`
          max-w-[70%] px-4 py-2 rounded-lg shadow
          ${isMe ? 'bg-chat-sent text-white rounded-br-none' : 'bg-chat-received text-gray-200 rounded-bl-none'}
        `}
			>
				<p className='text-sm text-chat-text'>{
					message.type === 'text'
						? message.content
						: message.type === 'image'
							? <img src={message.mediaUrl} alt={message.caption || 'Imagen'} className='max-w-full rounded' />
							: message.type === 'audio'
								? <audio controls src={message.mediaUrl} />
								: message.type === 'video'
									? <video controls src={message.mediaUrl} />
									: message.type === 'sticker'
										? <img src={message.mediaUrl} alt='Sticker' className='max-w-full rounded' />
										: 'Tipo de mensaje no soportado'
					}</p>
				<p className='text-[10px] text-right mt-1 opacity-70'>
					{new Date(message.timestamp).toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit',
					})}
				</p>
			</div>
		</div>
	);
}
