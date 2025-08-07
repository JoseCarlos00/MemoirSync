import { type MediaMessage } from '../../../interfaces/message';

export default function MessageVideo({ message }: { message: MediaMessage }) {
	return (
		<video
			controls
			src={message.mediaUrl}
		/>
	);
}
