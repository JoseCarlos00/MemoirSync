import { useState, lazy, Suspense, useEffect, useRef } from 'react';
import { type EmojiClickData } from 'emoji-picker-react';

const EmojiPicker = lazy(() => import('emoji-picker-react')); // carga diferida

const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

type EmojiPickerProps = {
	isOpen: boolean;
	isMe: boolean;
	onToggle: () => void;
	onSendReaction: (emoji: string) => void;
};



function EmojiIcon(props: React.SVGProps<SVGSVGElement> = {}) {
	return (
		<svg
			viewBox='0 0 24 24'
			height={20}
			width={20}
			fill='none'
			{...props}
		>
			<path
				d='M15.5 11C15.9167 11 16.2708 10.8542 16.5625 10.5625C16.8542 10.2708 17 9.91667 17 9.5C17 9.08333 16.8542 8.72917 16.5625 8.4375C16.2708 8.14583 15.9167 8 15.5 8C15.0833 8 14.7292 8.14583 14.4375 8.4375C14.1458 8.72917 14 9.08333 14 9.5C14 9.91667 14.1458 10.2708 14.4375 10.5625C14.7292 10.8542 15.0833 11 15.5 11ZM8.5 11C8.91667 11 9.27083 10.8542 9.5625 10.5625C9.85417 10.2708 10 9.91667 10 9.5C10 9.08333 9.85417 8.72917 9.5625 8.4375C9.27083 8.14583 8.91667 8 8.5 8C8.08333 8 7.72917 8.14583 7.4375 8.4375C7.14583 8.72917 7 9.08333 7 9.5C7 9.91667 7.14583 10.2708 7.4375 10.5625C7.72917 10.8542 8.08333 11 8.5 11ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20ZM12 17.5C12.9667 17.5 13.8583 17.2667 14.675 16.8C15.4917 16.3333 16.15 15.7 16.65 14.9C16.75 14.7 16.7417 14.5 16.625 14.3C16.5083 14.1 16.3333 14 16.1 14H7.9C7.66667 14 7.49167 14.1 7.375 14.3C7.25833 14.5 7.25 14.7 7.35 14.9C7.85 15.7 8.5125 16.3333 9.3375 16.8C10.1625 17.2667 11.05 17.5 12 17.5Z'
				fill='#423e3e'
			></path>
		</svg>
	);
}

export default function EmojiPickerComponent({ isOpen, onToggle, onSendReaction, isMe }: EmojiPickerProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isFullPickerOpen, setIsFullPickerOpen] = useState(false);

	const classPosition = isMe ? '-left-8' : '-right-8';

	useEffect(() => {
		// Resetear el estado interno si el picker se cierra desde el padre
		if (!isOpen) {
			setIsFullPickerOpen(false);
		}
	}, [isOpen]);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			// Si el picker está abierto y se hace clic fuera de su contenedor, se cierra.
			if (isOpen && containerRef.current && !containerRef.current.contains(event.target as Node)) {
				onToggle();
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen, onToggle]);

	const handleEmojiSelect = (emoji: string) => {
		onSendReaction(emoji);
		onToggle(); // Cierra el picker después de seleccionar
	};

	const handleFullPickerSelect = (emojiData: EmojiClickData) => {
		handleEmojiSelect(emojiData.emoji);
	};

	return (
		<div className={`absolute top-0 z-10 ${classPosition}`}>
			<button
				onClick={onToggle}
				className='p-1 transition-opacity duration-200 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100'
			>
				<EmojiIcon />
			</button>

			{isOpen && (
				<div
					ref={containerRef}
					className={`absolute z-20 ${isMe ? 'right-0' : 'left-0'}`}
					style={{ bottom: 'calc(100% + 5px)' }}
				>
					{!isFullPickerOpen ? (
						<div className='flex gap-1 p-1 bg-[#1D1F1F] rounded-full shadow-lg'>
							{quickReactions.map((emoji) => (
								<button
									key={emoji}
									onClick={() => handleEmojiSelect(emoji)}
									className='p-1 text-xl transition-transform duration-150 rounded-full cursor-pointer hover:scale-125'
								>
									{emoji}
								</button>
							))}

							<div className='flex items-center justify-center p-1'>
								<button
									onClick={() => setIsFullPickerOpen(true)}
									className='flex items-center justify-center bg-white/10 rounded-full cursor-pointer size-[24px] hover:bg-white/20'
								>
									<span className='text-white/60 flex items-center justify-center'>
										<svg
											viewBox='0 0 24 24'
											width='22'
											className=''
										>
											<path
												fill='currentColor'
												d='M19,13h-6v6h-2v-6H5v-2h6V5h2v6h6V13z'
											></path>
										</svg>
									</span>
								</button>
							</div>
						</div>
					) : (
						<Suspense
							fallback={<div className='p-4 bg-[#1D1F1F] rounded-lg shadow-lg text-white'>Cargando...</div>}
						>
							<EmojiPicker onEmojiClick={handleFullPickerSelect} />
						</Suspense>
					)}
				</div>
			)}
		</div>
	);
}
