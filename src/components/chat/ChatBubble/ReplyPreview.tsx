import { memo } from 'react';
import type { Message, TextMessage, MediaMessage } from '../../../interfaces/message';
import { useAuthStore } from '../../../store/authStore';

interface ReplyPreviewProps {
	repliedMessage: Message;
	isMe: boolean;
	onNavigate?: () => void;
}

// Componente para mostrar el nombre del remitente de la respuesta
const RepliedSender = ({ sender }: { sender: string }) => {
	const { user } = useAuthStore();
	const displayName = sender === user?.username ? 'Tú' : sender;
	return <p className='text-blue-400 text-sm font-bold truncate'>{displayName}</p>;
};

// Componente base para el contenedor de la vista previa de la respuesta
const ReplyContainer = ({
	borderColor,
	children,
	className,
	onNavigate,
}: {
	borderColor: string;
	children: React.ReactNode;
	className?: string;
	onNavigate?: () => void;
}) => (
	<div
		onClick={onNavigate}
		className={`flex border-l-4 p-2 rounded-md bg-gray-700 cursor-pointer ${borderColor} ${className || ''}`}
	>
		{children}
	</div>
);

const ReplyText = ({ repliedMessage, borderColor, onNavigate }: { repliedMessage: TextMessage; borderColor: string; onNavigate?: () => void }) => {
	return (
		<ReplyContainer
			borderColor={borderColor}
			className='flex-col'
			onNavigate={onNavigate}
		>
			<RepliedSender sender={repliedMessage.sender} />
			<p className='text-gray-300 text-xs ml-2 truncate'>{repliedMessage.content}</p>
		</ReplyContainer>
	);
};

const ReplyImage = ({ repliedMessage, borderColor, onNavigate }: { repliedMessage: MediaMessage; borderColor: string; onNavigate?: () => void }) => {
	return (
		<ReplyContainer borderColor={borderColor} onNavigate={onNavigate}>
			<div className='flex-grow'>
				<RepliedSender sender={repliedMessage.sender} />
				<p className='text-gray-300 text-xs truncate'>{repliedMessage.caption || 'Foto'}</p>
			</div>
			<img
				src={repliedMessage.thumbnailUrl || repliedMessage.mediaUrl}
				alt='Miniatura'
				className='w-12 h-12 object-cover rounded ml-2'
			/>
		</ReplyContainer>
	);
};

const ReplyAudio = ({ repliedMessage, borderColor, onNavigate }: { repliedMessage: MediaMessage; borderColor: string; onNavigate?: () => void }) => {
	return (
		<ReplyContainer
			borderColor={borderColor}
			className='items-center'
			onNavigate={onNavigate}
		>
			<div className='flex-grow'>
				<RepliedSender sender={repliedMessage.sender} />
				<p className='text-gray-300 text-xs flex items-center'>
					<span className='material-icons mr-1'>audio track</span>
					Audio
					{repliedMessage.duration && <span className='ml-2'>({repliedMessage.duration}s)</span>}
				</p>
			</div>
		</ReplyContainer>
	);
};

function ReplyPreview({ repliedMessage, isMe, onNavigate }: ReplyPreviewProps) {
	if (!repliedMessage) return null;

	const borderColor = isMe ? 'border-chat-received' : 'border-chat-sent';

	switch (repliedMessage.type) {
		case 'text':
			return (
				<ReplyText
					repliedMessage={repliedMessage as TextMessage}
					borderColor={borderColor}
					onNavigate={onNavigate}
				/>
			);
		case 'image':
			return (
				<ReplyImage
					repliedMessage={repliedMessage as MediaMessage}
					borderColor={borderColor}
					onNavigate={onNavigate}
				/>
			);
		case 'audio':
      return (
				<ReplyAudio
					repliedMessage={repliedMessage as MediaMessage}
					borderColor={borderColor}
					onNavigate={onNavigate}
				/>
			);
		default:
			return null;
	}
}

export default memo(ReplyPreview);
