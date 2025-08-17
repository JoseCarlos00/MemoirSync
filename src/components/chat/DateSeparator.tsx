import { memo } from 'react';
import { formatDateSeparator } from '../../utils/formatDateSeparator';

interface DateSeparatorProps {
	date: string;
}

function DateSeparator({ date }: DateSeparatorProps) {
	return (
		<div className='flex justify-center my-4'>
			<span className='bg-gray-700 text-white text-xs font-semibold px-3 py-1 rounded-full'>
				{formatDateSeparator(date)}
			</span>
		</div>
	);
}

export default memo(DateSeparator);
