import { type MediaMessage }  from '../../../interfaces/message';
import TimeFormat from '../TimeFormat';


export default function MessageImage({ message }: { message: MediaMessage }) {
	const isCaption = message.caption !== undefined;
	const isMe = message.sender === 'me';

	const isMeClass = isMe ? 'absolute bottom-3 right-[24px] z-2' : 'absolute bottom-3 right-[18px] z-2';
	const timeClass = isCaption ? '' : isMeClass

	return (
		<div className='p-1.5'>
			<figure className='relative w-[330px] bot'>
				<img
					src={message.mediaUrl}
					alt='Sticker'
					className='max-w-full rounded'
				/>
				{message.caption && <figcaption>{message.caption}</figcaption>}
			</figure>
			<div className={timeClass}>
				<TimeFormat timestamp={message.timestamp} />
			</div>
		</div>
	);
}
