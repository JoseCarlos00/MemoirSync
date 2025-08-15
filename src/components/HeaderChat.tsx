import { Link } from 'react-router-dom';

export interface HeaderChatProps extends React.PropsWithChildren {
	messagesTotal: number;
}

function HeaderChat({ messagesTotal, children }: HeaderChatProps) {
	console.log('messagesTotal', messagesTotal);

	return (
		<header className='bg-chat-panel text-white p-4 flex justify-between items-center shadow-md z-10'>
			<div className='max-w-2xl mx-auto'>
				<div className='flex items-center'>
					<Link to='/'>
						<button className='text-white mr-4'>←</button>
					</Link>
					<div>
						<h1 className='text-xl font-bold text-chat-panel-text'>Chat con Amor</h1>
						<p className='text-sm text-chat-panel-text mb-2'>
							{messagesTotal} {messagesTotal === 1 ? 'mensaje' : 'mensajes'}
						</p>
					</div>
				</div>
				<div className='flex items-center gap-4'>{children}</div>
			</div>
		</header>
	);
}

export default HeaderChat;
