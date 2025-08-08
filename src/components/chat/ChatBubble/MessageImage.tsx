import { type MediaMessage }  from '../../../interfaces/message';
import TimeFormat from '../TimeFormat';


export default function MessageImage({ message }: { message: MediaMessage }) {
	const isCaption = message.caption !== undefined;

	const timeClass = isCaption ? '' : 'absolute bottom-0 right-[24] z-2';

	return (
		<div className='p-1.5'>
			<figure className='relative w-[330px]'>
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
