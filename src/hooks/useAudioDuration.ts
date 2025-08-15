import { useState, useEffect } from 'react';

// Cache para almacenar las duraciones ya calculadas.
// Se define fuera del hook para que persista entre re-renders y entre diferentes componentes.
const durationCache = new Map<string, number>();

/**
 * Un hook de React que obtiene la duración de un archivo de audio desde una URL.
 * Utiliza un caché en memoria para evitar volver a solicitar la duración de la misma URL.
 *
 * @param audioUrl La URL del archivo de audio. Si es `undefined`, el hook no hará nada.
 * @returns Un objeto con `duration` (en segundos), `isLoading` y `error`.
 */
export const useAudioDuration = (audioUrl: string | undefined) => {
	const [duration, setDuration] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Si no hay URL, reseteamos el estado y salimos.
		if (!audioUrl) {
			setDuration(null);
			return;
		}

		// 1. Revisar si la duración ya está en caché.
		if (durationCache.has(audioUrl)) {
			setDuration(durationCache.get(audioUrl)!);
			return;
		}

		// 2. Si no está en caché, procedemos a cargarla.
		const audio = new Audio();
		audio.src = audioUrl;
		setIsLoading(true);
		setError(null);

		const handleLoadedMetadata = () => {
			// 3. Guardar la duración en el estado y en la caché.
			setDuration(audio.duration);
			durationCache.set(audioUrl, audio.duration);
			setIsLoading(false);
		};

		const handleError = () => {
			setError('No se pudo cargar la duración del audio.');
			setIsLoading(false);
		};

		audio.addEventListener('loadedmetadata', handleLoadedMetadata);
		audio.addEventListener('error', handleError);

		// 4. Función de limpieza para evitar memory leaks.
		return () => {
			audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
			audio.removeEventListener('error', handleError);
			// Detener la carga del audio si el componente se desmonta.
			audio.src = '';
		};
	}, [audioUrl]); // El efecto se ejecuta cada vez que la URL del audio cambia.

	return { duration, isLoading, error };
};
