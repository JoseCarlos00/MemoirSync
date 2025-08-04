export default function HeaderChat({messagesTotal = 0}: { messagesTotal?: number }) {
  console.log('messagesTotal', messagesTotal);
  
  return (
		<>
			<header className='bg-chat-panel text-white p-4 shadow-md'>
				<div className='max-w-2xl mx-auto'>
					<h1 className='text-xl font-bold text-chat-panel-text'>Chat</h1>
					<p className='text-sm text-chat-panel-text mb-2'>
						{messagesTotal} {messagesTotal === 1 ? 'mensaje' : 'mensajes'}
					</p>
				</div>
			</header>
		</>
	);
}
