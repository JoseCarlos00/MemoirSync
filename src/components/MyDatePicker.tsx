import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';

import {
	useFloating,
	useClick,
	useDismiss,
	useInteractions,
	offset,
	flip,
	shift,
	autoUpdate,
} from '@floating-ui/react';

import CalendarIcon from './icons/CalendarICon'


function MyDatePicker() {
	const [selected, setSelected] = useState<Date>();
	const [isOpen, setIsOpen] = useState(false);

	// Configuración de Floating UI para posicionar el popover
	const { refs, floatingStyles, context } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		middleware: [offset(10), flip(), shift({ padding: 5 })],
		whileElementsMounted: autoUpdate,
	});

	// Hooks de interacción para manejar clics y cierre
	const click = useClick(context);
	const dismiss = useDismiss(context);

	const { getReferenceProps, getFloatingProps } = useInteractions([
		click,
		dismiss,
	]);

	// Cierra el picker cuando se selecciona una fecha
	const handleSelect = (date: Date | undefined) => {
		setSelected(date);

		if (date) {
      console.log('Fecha seleccionada:', date.toLocaleDateString(), date);
      
			setIsOpen(false);
		}
	};

	return (
		<>
			<button
				ref={refs.setReference}
				{...getReferenceProps()}
				className='cursor-pointer hover:opacity-75'
				aria-label='Abrir calendario'
			>
				<CalendarIcon
					width={24}
					height={24}
					className='text-white'
				/>
			</button>
			{isOpen && (
				<div
					ref={refs.setFloating}
					style={floatingStyles}
					{...getFloatingProps()}
					className='z-20' // Asegura que esté por encima de otros elementos
				>
					<DayPicker
						animate
						mode='single'
						selected={selected}
						onSelect={handleSelect}
						footer={
							selected
								? `Seleccionado: ${selected.toLocaleDateString()}`
								: 'Elige un día.'
						}
						className='bg-chat-panel p-2 rounded-md shadow-lg border border-gray-700'
					/>
				</div>
			)}
		</>
	);
}

export default MyDatePicker;
