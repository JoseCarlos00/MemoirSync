import { memo } from 'react';
import { type MediaMessage } from '../../../interfaces/message';
import TimeFormat from '../TimeFormat';

function MessageVideo({ message }: { message: MediaMessage }) {
	return (
		<div className='p-1'>
			<figure className='relative max-w-xs aspect-video rounded-lg overflow-hidden bg-black'>
				<video
					controls
					src={message.mediaUrl}
					className='w-full h-full object-cover'
				/>
				{/* La hora se superpone para no afectar el tamaño del contenedor */}
				<div className='absolute bottom-1.5 right-1.5'><TimeFormat timestamp={message.timestamp} /></div>
			</figure>
		</div>
	);
}

export default memo(MessageVideo);
