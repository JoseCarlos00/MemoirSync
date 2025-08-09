import { memo } from 'react';
import { type MediaMessage } from '../../../interfaces/message';
import TimeFormat from '../TimeFormat';

interface MessageImageProps {
	message: MediaMessage;
	isMe: boolean;
}

 function MessageImage({ message, isMe }: MessageImageProps) {
	const isCaption = message.caption !== undefined;

	const isMeClass = isMe ? 'absolute bottom-3 right-[24px] z-10' : 'absolute bottom-3 right-[18px] z-10';
	const timeClass = isCaption ? '' : isMeClass;

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

export default memo(MessageImage);
