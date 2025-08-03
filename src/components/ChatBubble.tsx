interface Message {
	_id: string;
	content: string;
	timestamp: string;
	sender: 'me' | string; // 'me' o el ID/nombre de otro usuario
}

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
          ${isMe ? 'bg-green-500 text-white rounded-br-none' : 'bg-gray-200 text-black rounded-bl-none'}
        `}
			>
				<p className='text-sm'>{message.content}</p>
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
