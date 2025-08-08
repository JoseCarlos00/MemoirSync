import api from "../../../services/api"
import { type Message } from "../../../interfaces/message";

interface ReplyToProps {
  message: Message;
}


export default function ReplyTo({ message }: ReplyToProps) {
  const handleReplyTo = async () => {
      // Esto es un ejemplo, la lógica real de "responder a" es más compleja.
        // Asume que tienes el ID del mensaje al que quieres responder
        const replyToId = 'otro-id-de-mensaje';

        try {
          await api.put(`/messages/${message._id}/reply`, { replyTo: replyToId });
          console.log('ReplyTo updated successfully');
        } catch (error) {
          console.error('Failed to update replyTo', error);
        }
    };

  return (
		<div className='absolute top-0 left-0 hidden'>
			{/* Botón para editar la propiedad replyTo */}
			<button onClick={handleReplyTo}>Reply To</button>
		</div>
	);
}
