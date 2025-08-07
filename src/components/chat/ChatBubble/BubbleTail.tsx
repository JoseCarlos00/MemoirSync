interface BubbleTailProps {
	isMe: boolean;
}

export default function BubbleTail({ isMe }: BubbleTailProps) {
	return (
		<span className={`absolute w-2 h-3 z-5 ${isMe ? '-right-2' : '-left-2'}`}>
			<svg
				viewBox='0 0 8 13'
				height='13'
				width='8'
				preserveAspectRatio='xMidYMid meet'
				className={`z-10 ${isMe ? 'text-chat-sent' : 'text-chat-received'}`}
			>
				{isMe ? (
					<>
						<path
							fill='currentColor'
							d='M5.188,1H0v11.193l6.467-8.625 C7.526,2.156,6.958,1,5.188,1z'
						/>
						<path
							fill='currentColor'
							d='M5.188,0H0v11.193l6.467-8.625C7.526,1.156,6.958,0,5.188,0z'
						/>
					</>
				) : (
					<>
						<path
							fill='currentColor'
							d='M1.533,3.568L8,12.193V1H2.812 C1.042,1,0.474,2.156,1.533,3.568z'
						/>
						<path
							fill='currentColor'
							d='M1.533,2.568L8,11.193V0L2.812,0C1.042,0,0.474,1.156,1.533,2.568z'
						/>
					</>
				)}
			</svg>
		</span>
	);
}
