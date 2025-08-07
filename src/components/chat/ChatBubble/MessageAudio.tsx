import { type MediaMessage } from '../../../interfaces/message';

export default function MessageAudio({ message }: { message: MediaMessage }) {
	return (
		<audio
			controls
			src={message.mediaUrl}
		/>
	);
}
