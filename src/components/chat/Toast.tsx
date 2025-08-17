interface ToastProps {
	message: string;
	variant?: 'info' | 'pulse';
}

export const Toast = ({ message, variant = 'info' }: ToastProps) => {
	const baseClasses =
		'absolute top-20 left-1/2 -translate-x-1/2 text-white px-4 py-2 rounded-md shadow-lg z-20';

	const variantClasses = {
		info: 'bg-blue-600',
		pulse: 'bg-gray-700 animate-pulse',
	};

	return <div className={`${baseClasses} ${variantClasses[variant]}`}>{message}</div>;
};
