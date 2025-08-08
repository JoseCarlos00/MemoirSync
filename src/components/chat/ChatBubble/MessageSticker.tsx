import { type MediaMessage } from '../../../interfaces/message';
import TimeFormat from '../TimeFormat';

export default function MessageSticker({ message }: { message: MediaMessage }) {
	return (
		<>
			<div className='pb-2.5 mb-0.5'>
				<img
					src={message.mediaUrl}
					alt={message.caption || 'Sticker'}
					className='max-w-full rounded w-[190px] h-[190px]'
				/>
			</div>
			<TimeFormat timestamp={message.timestamp} />
		</>
	);
}
