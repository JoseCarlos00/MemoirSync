import { useState } from 'react'
import api from "../../../services/api"
import { type Message } from '../../../interfaces/message'

interface EmojiPickerProps {
  message: Message;
}


export default function EmojiPicker({ message }: EmojiPickerProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(message.reactionEmoji || null);
	const handleSelectEmoji = async (emoji: string) => {
		// Llama al endpoint de tu API para actualizar
			try {
				await api.put(`/messages/${message._id}/react`, { reactionEmoji: emoji });
				setSelectedEmoji(emoji);
				setShowEmojiPicker(false);
			} catch (error) {
				console.error('Failed to update reaction', error);
			}
	};

	return (
		<>
			<div>
				{/* Muestra el emoji si existe */}
				{selectedEmoji && (
					<span className='absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1'>
						{selectedEmoji}
					</span>
				)}

				{/* Botón para mostrar el selector de emojis */}
				<button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</button>
				{showEmojiPicker && (
					<div className='absolute z-10 bg-white p-2 rounded shadow-lg'>
						{/* Emojis de ejemplo */}
						<span onClick={() => handleSelectEmoji('👍')}>👍</span>
						<span onClick={() => handleSelectEmoji('❤️')}>❤️</span>
						<span onClick={() => handleSelectEmoji('😂')}>😂</span>
					</div>
				)}
			</div>
		</>
	);
}
