import { type TextMessage } from '../../../interfaces/message';
import TimeFormat from '../TimeFormat'

export default function MessageText({ message }: { message: TextMessage }) {
	return (
		<div className='pb-2.5 pt-2 pr-1.5 pl-2 -mt-2 -mb-1'>
			<div>{message.content}</div>
			<TimeFormat timestamp={message.timestamp} />
		</div>
	);
}
