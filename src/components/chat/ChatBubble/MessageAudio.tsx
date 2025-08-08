import { type MediaMessage } from '../../../interfaces/message';
import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

type MessageAudioProps = {
	message: MediaMessage;
	avatarUrl?: string;
};

function formatTime(seconds: number) {
	const m = Math.floor(seconds / 60);
	const s = Math.floor(seconds % 60);
	return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function MessageAudio({ message, avatarUrl = '' }: MessageAudioProps) {
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
		<div className='flex items-center gap-2 bg-[#005c4b] p-2 rounded-lg text-white w-full max-w-md'>
			{/* Botón Play */}
			<button
				onClick={togglePlay}
				className='flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/20'
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
						className='w-6 h-6'
						fill='currentColor'
						viewBox='0 0 24 24'
					>
						<path d='M8 5v14l11-7z' />
					</svg>
				)}
			</button>

			{/* Onda */}
			<div
				ref={waveformRef}
				className='flex-1 min-w-[120px] h-[50px]'
			/>

			{/* Duración */}
			<span className='text-xs opacity-80'>{duration}</span>

			{/* Velocidad */}
			<button
				onClick={changeSpeed}
				className='flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/20 text-sm'
			>
				{speed}×
			</button>

			{/* Avatar */}
			<img
				src={avatarUrl}
				alt='avatar'
				className='w-12 h-12 rounded-full object-cover'
			/>
		</div>
	);
}

export default MessageAudio;
