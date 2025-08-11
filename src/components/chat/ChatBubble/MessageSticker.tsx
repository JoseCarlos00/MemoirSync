import { memo } from 'react';
import { type MediaMessage } from '../../../interfaces/message';
import TimeFormat from '../TimeFormat';

 function MessageSticker({ message }: { message: MediaMessage }) {
	return (
		<div className='relative w[190px] h-auto flex flex-col'>
			<img
				src={message.mediaUrl}
				alt={'Sticker'}
				className='rounded-lg size-[190px] object-contain mb-1'
			/>
			<div className='bg-black/50 rounded-sm px-1 py-0.5 self-end'>
				<TimeFormat timestamp={message.timestamp} />
			</div>
		</div>
	);
}

export default memo(MessageSticker);
