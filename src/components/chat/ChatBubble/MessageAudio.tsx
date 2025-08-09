import WaveSurfer from 'wavesurfer.js';

import { memo, useEffect, useRef, useState } from 'react';
import { type MediaMessage } from '../../../interfaces/message';

import TimeFormat from '../TimeFormat';

type MessageAudioProps = {
	message: MediaMessage;
	avatarUrl?: string;
	isMe: boolean;
};

function PhoneIcon(props: React.SVGProps<SVGSVGElement> = {}) {
	return (
		<svg
			viewBox='0 0 19 26'
			height={24}
			width={17}
			{...props}
		>
			<path
				fill='#144D37'
				d='M9.217,24.401c-1.158,0-2.1-0.941-2.1-2.1v-2.366c-2.646-0.848-4.652-3.146-5.061-5.958L2.004,13.62 l-0.003-0.081c-0.021-0.559,0.182-1.088,0.571-1.492c0.39-0.404,0.939-0.637,1.507-0.637h0.3c0.254,0,0.498,0.044,0.724,0.125v-6.27 C5.103,2.913,7.016,1,9.367,1c2.352,0,4.265,1.913,4.265,4.265v6.271c0.226-0.081,0.469-0.125,0.723-0.125h0.3 c0.564,0,1.112,0.233,1.501,0.64s0.597,0.963,0.571,1.526c0,0.005,0.001,0.124-0.08,0.6c-0.47,2.703-2.459,4.917-5.029,5.748v2.378 c0,1.158-0.942,2.1-2.1,2.1H9.217V24.401z'
			></path>
			<path
				fill='#43abcd'
				d='M9.367,15.668c1.527,0,2.765-1.238,2.765-2.765V5.265c0-1.527-1.238-2.765-2.765-2.765 S6.603,3.738,6.603,5.265v7.638C6.603,14.43,7.84,15.668,9.367,15.668z M14.655,12.91h-0.3c-0.33,0-0.614,0.269-0.631,0.598 c0,0,0,0-0.059,0.285c-0.41,1.997-2.182,3.505-4.298,3.505c-2.126,0-3.904-1.521-4.304-3.531C5.008,13.49,5.008,13.49,5.008,13.49 c-0.016-0.319-0.299-0.579-0.629-0.579h-0.3c-0.33,0-0.591,0.258-0.579,0.573c0,0,0,0,0.04,0.278 c0.378,2.599,2.464,4.643,5.076,4.978v3.562c0,0.33,0.27,0.6,0.6,0.6h0.3c0.33,0,0.6-0.27,0.6-0.6V18.73 c2.557-0.33,4.613-2.286,5.051-4.809c0.057-0.328,0.061-0.411,0.061-0.411C15.243,13.18,14.985,12.91,14.655,12.91z'
			></path>
		</svg>
	);
}

function formatTime(seconds: number) {
	const m = Math.floor(seconds / 60);
	const s = Math.floor(seconds % 60);
	return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function MessageAudio({ message, isMe, avatarUrl = 'https://localhost:3000/uploads/imagen-rota.webp' }: MessageAudioProps) {
	const { mediaUrl: audioUrl } = message;

	const [playing, setPlaying] = useState(false);
	const [speed, setSpeed] = useState(1);
	const [duration, setDuration] = useState('0:00');

	const waveformRef = useRef<HTMLDivElement | null>(null);
	const wavesurferRef = useRef<WaveSurfer | null>(null);

	useEffect(() => {
		if (waveformRef.current) {
			const ws = WaveSurfer.create({
				container: waveformRef.current,
				waveColor: 'rgba(255, 255, 255, 0.3)',
				progressColor: '#fff',
				cursorWidth: 0,
				height: 50,
				barWidth: 2,
				barGap: 2,
				barRadius: 2,
			});

			ws.load(audioUrl);

			ws.on('ready', () => {
				setDuration(formatTime(ws.getDuration()));
			});

			ws.on('play', () => setPlaying(true));
			ws.on('pause', () => setPlaying(false));
			ws.on('finish', () => setPlaying(false));

			wavesurferRef.current = ws;

			return () => ws.destroy();
		}
	}, [audioUrl]);

	const togglePlay = () => {
		wavesurferRef.current?.playPause();
	};

	const changeSpeed = () => {
		if (!wavesurferRef.current) return;
		const newSpeed = speed === 2 ? 1 : speed + 0.5;
		wavesurferRef.current.setPlaybackRate(newSpeed);
		setSpeed(newSpeed);
	};

	return (
		<div className='flex items-center gap-2  p-2 rounded-lg text-white w-full max-w-md select-none'>
			{/* Botón Play */}
			<button
				onClick={togglePlay}
				className='flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/20 cursor-pointer order-2'
			>
				{playing ? (
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='w-6 h-6'
						fill='currentColor'
						viewBox='0 0 24 24'
					>
						<path d='M6 19h4V5H6v14zm8-14v14h4V5h-4z' />
					</svg>
				) : (
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='w-8 h-8'
						fill='currentColor'
						viewBox='0 0 24 24'
					>
						<path d='M8 5v14l11-7z' />
					</svg>
				)}
			</button>

			<div className='relative order-3'>
				{/* Onda */}
				<div
					ref={waveformRef}
					className='flex-1 min-w-[120px] h-[50px]'
				/>

				{/* Duración */}
				<span className='text-[10px] opacity-80 absolute bottom-0 left-0 z-2'>{duration}</span>

				<div className='absolute bottom-0 right-0 z-2'>
					<TimeFormat timestamp={message.timestamp} />
				</div>
			</div>

			<div className={isMe ? 'order-1' : 'order-4'}>
				{/* Velocidad */}
				<button
					onClick={changeSpeed}
					className='hidden items-center justify-center w-8 h-8 rounded-full hover:bg-white/20 text-sm'
				>
					{speed}×
				</button>

				{/* Avatar */}
				<div className='relative w-12 h-12'>
					<img
						src={avatarUrl}
						alt='avatar user'
						className='w-12 h-12 rounded-full object-cover'
					/>
					<PhoneIcon className={`absolute -bottom-1.5 z-2 ${isMe ? '-right-0' : '-left-0'}`} />
				</div>
			</div>
		</div>
	);
}

export default memo(MessageAudio);
