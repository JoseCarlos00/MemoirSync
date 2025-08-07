import { type MediaMessage } from '../../../interfaces/message';

export default function MessageSticker({ message }: { message: MediaMessage }) {
	return (
		<img
			src={message.mediaUrl}
			alt={message.caption || 'Imagen'}
			className='max-w-full rounded'
		/>
	);
}
