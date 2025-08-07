import { type Message } from '../interfaces/message';

interface ChatBubbleProps {
	message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
	const isMe = message.sender === 'me';

	const containerClass = isMe ? 'justify-end' : 'justify-start';
	const tailPositionClass = isMe ? '-right-2' : '-left-2';
	const bubbleClass = isMe
		? 'bg-chat-sent text-white rounded-tr-none'
		: 'bg-chat-received text-gray-200 rounded-tl-none';
	const tailColorClass = isMe ? 'text-chat-sent' : 'text-chat-received';

	return (
		<div className={`flex relative mb-2 ${containerClass}`}>
			{/* Burbuja de flecha */}
			<span className={`absolute w-2 h-3 z-5 ${tailPositionClass}`}>
				<svg
					viewBox='0 0 8 13'
					height='13'
					width='8'
					className={`z-10 ${tailColorClass}`}
				>
					{isMe ? (
						<>
							<path
								fill='currentColor'
								d='M5.188,1H0v11.193l6.467-8.625 C7.526,2.156,6.958,1,5.188,1z'
							></path>
							<path
								fill='currentColor'
								d='M5.188,0H0v11.193l6.467-8.625C7.526,1.156,6.958,0,5.188,0z'
							></path>
						</>
					) : (
						<>
							<path
								fill='currentColor'
								d='M1.533,3.568L8,12.193V1H2.812 C1.042,1,0.474,2.156,1.533,3.568z'
							></path>
							<path
								fill='currentColor'
								d='M1.533,2.568L8,11.193V0L2.812,0C1.042,0,0.474,1.156,1.533,2.568z'
							></path>
						</>
					)}
				</svg>
			</span>

			{/* Contenedor del mensaje */}
			<div className={`max-w-[70%] px-4 py-2 rounded-lg shadow relative ${bubbleClass}`}>
				<p className='text-sm text-white'>{renderMessageContent(message)}</p>
				<p className='text-[10px] text-right mt-1 opacity-70'>
					{new Date(message.timestamp).toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit',
						timeZone: 'America/Mexico_City',
						hour12: true,
					})}
				</p>
			</div>
		</div>
	);
}

function renderMessageContent(message: Message) {
	switch (message.type) {
		case 'text':
			return message.content;
		case 'image':
			return (
				<img
					src={message.mediaUrl}
					alt={message.caption || 'Imagen'}
					className='max-w-full rounded'
				/>
			);
		case 'audio':
			return (
				<audio
					controls
					src={message.mediaUrl}
				/>
			);
		case 'video':
			return (
				<video
					controls
					src={message.mediaUrl}
				/>
			);
		case 'sticker':
			return (
				<figure>
					<img
						src={message.mediaUrl}
						alt='Sticker'
						className='max-w-full rounded'
					/>
					{message.caption && <figcaption>{message.caption}</figcaption>}
				</figure>
			);
		default:
			return 'Tipo de mensaje no soportado';
	}
}
