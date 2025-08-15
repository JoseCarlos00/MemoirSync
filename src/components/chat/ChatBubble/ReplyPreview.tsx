import { memo } from 'react';
import type { Message, TextMessage, MediaMessage } from '../../../interfaces/message';
import { useAuthStore } from '../../../store/authStore';

interface ReplyPreviewProps {
	repliedMessage: Message;
	isMe: boolean;
	onNavigate?: () => void;
}

const ReplyText = ({ repliedMessage, borderColor }: { repliedMessage: TextMessage; borderColor: string }) => {
    const user = useAuthStore().user;
    const { sender, content } = repliedMessage

	return (
		<div
			// onClick={onNavigate}
			className={`flex flex-col border-l-4 p-2 rounded-md bg-gray-700 cursor-pointer ${borderColor}`}
		>
			<p className='text-blue-400 text-sm font-bold truncate'>{ sender === user?.username ? 'Tú' : sender}</p>
			<p className='text-gray-300 text-xs ml-2 truncate'>{content}</p>
		</div>
	);
};

const ReplyImage = ({ repliedMessage, borderColor }: { repliedMessage: MediaMessage; borderColor: string }) => {
	return (
		<div
			// onClick={onNavigate}
			className='flex border-l-4 border-blue-400 p-2 rounded-md bg-gray-700 cursor-pointer'
		>
			<div className='flex-grow'>
				<p className='text-blue-400 text-sm font-bold'>{repliedMessage.sender}</p>
				<p className='text-gray-300 text-xs truncate'>{repliedMessage.caption || 'Foto'}</p>
			</div>
			<img
				src={repliedMessage.thumbnailUrl || repliedMessage.mediaUrl}
				alt='Miniatura'
				className='w-12 h-12 object-cover rounded ml-2'
			/>
		</div>
	);
};

const ReplyAudio = ({ repliedMessage, borderColor }: { repliedMessage: MediaMessage; borderColor: string }) => {
	return (
		<div
			// onClick={onNavigate}
			className='flex border-l-4 border-blue-400 p-2 rounded-md bg-gray-700 items-center cursor-pointer'
		>
			<div className='flex-grow'>
				<p className='text-blue-400 text-sm font-bold'>{repliedMessage.sender}</p>
				<p className='text-gray-300 text-xs flex items-center'>
					<span className='material-icons mr-1'>audio track</span>
					Audio
					{repliedMessage.duration && <span className='ml-2'>({repliedMessage.duration}s)</span>}
				</p>
			</div>
		</div>
	);
};

function ReplyPreview({ repliedMessage, isMe }: ReplyPreviewProps) {
	if (!repliedMessage) return null;

	const borderColor = isMe ? 'border-chat-received' : 'border-chat-sent';

	switch (repliedMessage.type) {
		case 'text':
			return (
				<ReplyText
					repliedMessage={repliedMessage as TextMessage}
					borderColor={borderColor}
				/>
			);
		case 'image':
			return (
				<ReplyImage
					repliedMessage={repliedMessage as MediaMessage}
					borderColor={borderColor}
				/>
			);
		case 'audio':
      return (
				<ReplyAudio
					repliedMessage={repliedMessage as MediaMessage}
					borderColor={borderColor}
				/>
			);
		default:
			return null;
	}
}

export default memo(ReplyPreview);
