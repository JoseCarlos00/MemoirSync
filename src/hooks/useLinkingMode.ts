import { useState, useCallback } from 'react';
import { type Message } from '../interfaces/message';
import api from '../services/api';

interface UseLinkingModeProps {
	messages: Message[];
	updateMessage: (messageId: string, updates: Partial<Message>) => void;
	showTemporaryStatus: (message: string) => void;
}

export const useLinkingMode = ({ messages, updateMessage, showTemporaryStatus }: UseLinkingModeProps) => {
	const [isLinkingMode, setIsLinkingMode] = useState(false);
	const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
	const [isSelectingSource, setIsSelectingSource] = useState(false);

	const assignReplyTo = useCallback(
		async (sourceId: string) => {
			if (selectedMessageIds.length === 0) return;

			if (selectedMessageIds.includes(sourceId)) {
				showTemporaryStatus('No se puede asignar un mensaje como respuesta a sí mismo.');
				setIsSelectingSource(false);
				return;
			}

			const idsToUpdate = [...selectedMessageIds];
			const sourceMessage = messages.find((m) => m._id === sourceId);

			idsToUpdate.forEach((messageId) => {
				updateMessage(messageId, { replyTo: sourceMessage ?? ({ _id: sourceId } as any) });
			});

			setSelectedMessageIds([]);
			setIsSelectingSource(false);
			setIsLinkingMode(false);
			showTemporaryStatus(`Vinculando ${idsToUpdate.length} mensaje(s)...`);

			await Promise.all(
				idsToUpdate.map((messageId) =>
					api.put(`/messages/${messageId}/reply`, { replyTo: sourceId }).catch((error) => {
						console.error(`Fallo al vincular el mensaje ${messageId}:`, error);
						// Aquí se podría implementar un rollback para el mensaje específico que falló
					})
				)
			);
			console.log('Todos los vínculos se procesaron.');
		},
		[selectedMessageIds, updateMessage, messages, showTemporaryStatus]
	);

	const toggleLinkingMode = useCallback(() => {
		setIsLinkingMode((prev) => !prev);
		if (isLinkingMode) {
			setSelectedMessageIds([]);
			setIsSelectingSource(false);
		}
	}, [isLinkingMode]);

	return {
		isLinkingMode,
		selectedMessageIds,
		isSelectingSource,
		setSelectedMessageIds,
		setIsSelectingSource,
		assignReplyTo,
		toggleLinkingMode,
	};
};
