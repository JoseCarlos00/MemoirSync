import { memo } from 'react';
import type { Message, TextMessage, MediaMessage } from '../../interfaces/message';
import { useAuthStore } from '../../store/authStore';
import { useAudioDuration } from '../../hooks/useAudioDuration';
import PhoneIcon from '../icons/PhoneIcon';

interface ReplyPreviewProps {
	repliedMessage: Message;
	isMe: boolean;
	onNavigate?: () => void;
}

function formatTime(seconds: number) {
	const m = Math.floor(seconds / 60);
	const s = Math.floor(seconds % 60);
	return `${m}:${s < 10 ? '0' : ''}${s}`;
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

const ReplyText = ({
	repliedMessage,
	borderColor,
	onNavigate,
}: {
	repliedMessage: TextMessage;
	borderColor: string;
	onNavigate?: () => void;
}) => {
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

const ReplyImage = ({
	repliedMessage,
	borderColor,
	onNavigate,
}: {
	repliedMessage: MediaMessage;
	borderColor: string;
	onNavigate?: () => void;
}) => {
	return (
		<ReplyContainer
			borderColor={borderColor}
			onNavigate={onNavigate}
		>
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

const ReplyAudio = ({
	repliedMessage,
	borderColor,
	onNavigate,
}: {
	repliedMessage: MediaMessage;
	borderColor: string;
	onNavigate?: () => void;
}) => {
	// Usamos el hook si la duración no está en los datos del mensaje.
	const { duration: calculatedDuration, isLoading } = useAudioDuration(
		!repliedMessage.duration ? repliedMessage.mediaUrl : undefined
	);

	const displayDuration = repliedMessage.duration ?? calculatedDuration;

	return (
		<ReplyContainer
			borderColor={borderColor}
			className='items-center'
			onNavigate={onNavigate}
		>
			<div className='flex-grow min-w-0'>
				<RepliedSender sender={repliedMessage.sender} />
				<p className='text-gray-300 text-xs flex items-center truncate'>
					<span className='material-icons mr-1 text-sm flex items-center'>
						{isLoading && '...'}
						<PhoneIcon />
						{displayDuration && <span className='ml-2'>{formatTime(displayDuration)}</span>}
					</span>
				</p>
			</div>
		</ReplyContainer>
	);
};

const ReplySticker = ({
	repliedMessage,
	borderColor,
	onNavigate,
}: {
	repliedMessage: MediaMessage;
	borderColor: string;
	onNavigate?: () => void;
}) => {
	return (
		<ReplyContainer
			borderColor={borderColor}
			onNavigate={onNavigate}
			className='flex-col'
		>
			<RepliedSender sender={repliedMessage.sender} />
			<img
				src={repliedMessage.thumbnailUrl || repliedMessage.mediaUrl}
				alt='Miniatura'
				className='w-12 h-12 object-cover rounded ml-2'
			/>
		</ReplyContainer>
	);
};

const UnsupportedReplyMessage = ({
	repliedMessage,
	borderColor,
	onNavigate,
}: {
	repliedMessage: Message;
	borderColor: string;
	onNavigate?: () => void;
}) => {
	return (
		<ReplyContainer
			borderColor={borderColor}
			onNavigate={onNavigate}
			className='flex-col'
		>
			<RepliedSender sender={repliedMessage.sender} />
			<p className='text-gray-300 text-xs truncate'>
				<strong>{repliedMessage.type.toUpperCase()}</strong>: No soportado
			</p>
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
		case 'sticker':
			return (
				<ReplySticker
					repliedMessage={repliedMessage as MediaMessage}
					borderColor={borderColor}
					onNavigate={onNavigate}
				/>
			);
		default:
			return (
				<UnsupportedReplyMessage
					repliedMessage={repliedMessage as Message}
					borderColor={borderColor}
					onNavigate={onNavigate}
				/>
			);
	}
}

export default memo(ReplyPreview);
