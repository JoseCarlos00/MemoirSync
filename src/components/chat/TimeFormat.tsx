
const TimeFormat = ({timestamp}: {timestamp: string}) => (
	<p className='text-[10px] text-right mt-1 opacity-70'>
		{new Date(timestamp).toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
			timeZone: 'America/Mexico_City',
			hour12: true,
		})}
	</p>
);

export default TimeFormat;
