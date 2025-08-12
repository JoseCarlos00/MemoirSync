import { memo, useState } from 'react';
import { type MediaMessage } from '../../../interfaces/message';
import TimeFormat from '../TimeFormat';

interface MessageImageProps {
	message: MediaMessage;
	isMe: boolean;
}

function MessageImage({ message, isMe }: MessageImageProps) {
	const [isLoading, setIsLoading] = useState(true);
	const { mediaUrl, caption, timestamp } = message;
	const isCaption = message.caption !== undefined;

	const isMeClass = isMe ? 'absolute bottom-3 right-[24px] z-10' : 'absolute bottom-3 right-[18px] z-10';
	const timeClass = isCaption ? '' : isMeClass;

	return (
		<div className='p-1.5'>
			<figure className='relative max-w-xs aspect-square rounded-lg'>
				{isLoading && <div className='absolute inset-0 bg-gray-600 animate-pulse'></div>}
				
				<img
					src={mediaUrl}
					alt='Imagen'
					className={`w-full h-full min-w-80 min-h-80  object-cover transition-opacity duration-300 ${
						isLoading ? 'opacity-0' : 'opacity-100'
					}`}
					onLoad={() => setIsLoading(false)}
					loading='lazy'
				/>
				{caption && !isLoading && <figcaption>{caption}</figcaption>}
			</figure>
			<div className={timeClass}>
				<TimeFormat timestamp={timestamp} />
			</div>
		</div>
	);
}

export default memo(MessageImage);
