import { type TextMessage } from '../../../interfaces/message';
import TimeFormat from '../TimeFormat'

export default function MessageText({ message }: { message: TextMessage }) {
	return (
		<div className='pb-2.5 pt-2 pr-1.5 pl-2 '>
			<div>{message.content}</div>

			<div className='-mt-0.5 -mb-1'>
				<TimeFormat timestamp={message.timestamp} />
			</div>
		</div>
	);
}
