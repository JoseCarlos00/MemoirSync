export function formatDateSeparator(dateString: string): string {
	const date = new Date(dateString);
	const today = new Date();
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);

	const options: Intl.DateTimeFormatOptions = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	};

	if (date.toDateString() === today.toDateString()) {
		return 'Hoy';
	}
	if (date.toDateString() === yesterday.toDateString()) {
		return 'Ayer';
	}
	return date.toLocaleDateString('es-ES', options);
}
