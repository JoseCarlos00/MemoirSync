import { memo, useState } from 'react';
import { type MediaMessage } from '../../../interfaces/message';
import TimeFormat from '../TimeFormat';

interface MessageImageProps {
	message: MediaMessage;
}

function MessageImage({ message }: MessageImageProps) {
	const [isLoading, setIsLoading] = useState(true);
	const { mediaUrl, caption, timestamp } = message;

	return (
		<div className='p-1'>
			<figure className='max-w-xs w-64'>
				{/* Contenedor de la imagen que mantiene la relación de aspecto */}
				<div className='relative rounded-lg aspect-square overflow-hidden bg-black/20'>
					<img
						src={mediaUrl}
						alt={caption || 'Imagen adjunta'}
						className={`w-full h-full object-cover transition-opacity duration-300 ${
							isLoading ? 'opacity-0' : 'opacity-100'
						}`}
						onLoad={() => setIsLoading(false)}
						loading='lazy'
					/>
				</div>

				{/* Contenedor para el caption y la hora, debajo de la imagen */}
				{(caption || timestamp) && (
					<div className='pt-1 px-1'>
						{caption && <figcaption className='text-sm text-white/90 break-words pb-1'>{caption}</figcaption>}
						<div className='flex justify-end'>
							<TimeFormat timestamp={timestamp} />
						</div>
					</div>
				)}
			</figure>
		</div>
	);
}

export default memo(MessageImage);
