import { Link } from 'react-router-dom';
import ArrowIcon from './icons/Arrow'

export interface HeaderChatProps extends React.PropsWithChildren {
	messagesTotal: number;
}

function HeaderChat({ messagesTotal, children }: HeaderChatProps) {
	console.log('messagesTotal', messagesTotal);

	return (
		<header className='bg-chat-panel text-white p-4 shadow-md z-10  flex justify-center items-center'>
			<div className='max-w-2xl w-full'>
				<div className='flex items-center'>
					<Link to='/'>
						<button className='text-white mr-4 cursor-pointer hover:opacity-75'>
							<ArrowIcon
								width={24}
								height={24}
							/>
						</button>
					</Link>

					<div className='flex-grow flex items-center justify-between'>
						{/* Avatar */}
						<div className='flex items-center gap-2'>
							<span className='outline outline-[#ffffff1a] -outline-offset-[1px] bg-[#1e2939] inline-block overflow-hidden size-14 rounded-full'>
								<svg
									viewBox='0 0 24 24'
									fill='currentColor'
									className='text-[#4a5565] size-full'
								>
									<path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z'></path>
								</svg>
							</span>
							<div className='flex flex-col justify-center'>
								<label>Eli</label>
								<label className='text-sm text-chat-panel-text mb-2'>
									{messagesTotal} {messagesTotal === 1 ? 'mensaje' : 'mensajes'}
								</label>
							</div>
						</div>

						{/* Search */}
						<div>
							<button
								className='cursor-pointer hover:opacity-75'
							>
								<svg
									viewBox='0 0 24 24'
									height={24}
									width={24}
									fill='none'
								>
									<path
										d='M9.5 16C7.68333 16 6.14583 15.3708 4.8875 14.1125C3.62917 12.8542 3 11.3167 3 9.5C3 7.68333 3.62917 6.14583 4.8875 4.8875C6.14583 3.62917 7.68333 3 9.5 3C11.3167 3 12.8542 3.62917 14.1125 4.8875C15.3708 6.14583 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L20.3 18.9C20.4833 19.0833 20.575 19.3167 20.575 19.6C20.575 19.8833 20.4833 20.1167 20.3 20.3C20.1167 20.4833 19.8833 20.575 19.6 20.575C19.3167 20.575 19.0833 20.4833 18.9 20.3L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16ZM9.5 14C10.75 14 11.8125 13.5625 12.6875 12.6875C13.5625 11.8125 14 10.75 14 9.5C14 8.25 13.5625 7.1875 12.6875 6.3125C11.8125 5.4375 10.75 5 9.5 5C8.25 5 7.1875 5.4375 6.3125 6.3125C5.4375 7.1875 5 8.25 5 9.5C5 10.75 5.4375 11.8125 6.3125 12.6875C7.1875 13.5625 8.25 14 9.5 14Z'
										fill='currentColor'
									></path>
								</svg>
							</button>
						</div>
					</div>
				</div>

				<div className='flex items-center gap-4 mt-1'>{children}</div>
			</div>
		</header>
	);
}

export default HeaderChat;
