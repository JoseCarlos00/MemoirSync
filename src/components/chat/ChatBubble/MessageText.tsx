import { type TextMessage } from '../../../interfaces/message';

export default function MessageText({ message }: { message: TextMessage }) {
	return <>{message.content}</>;
}
