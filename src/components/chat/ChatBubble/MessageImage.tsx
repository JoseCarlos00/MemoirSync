import { type MediaMessage }  from '../../../interfaces/message';

export default function MessageImage({ message }: { message: MediaMessage }) {
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
}
