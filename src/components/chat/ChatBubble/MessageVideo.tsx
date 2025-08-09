import { memo } from 'react'
import { type MediaMessage } from '../../../interfaces/message';

 function MessageVideo({ message }: { message: MediaMessage }) {
	return (
		<video
			controls
			src={message.mediaUrl}
		/>
	);
}

export default memo(MessageVideo);
