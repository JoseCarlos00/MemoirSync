import { type RefObject } from 'react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import { type Message } from '../../interfaces/message';
import { type ListItem } from '../../views/ChatView';
import { type User } from '../../interfaces/user';
import ChatBubble from './ChatBubble';
import DateSeparator from './DateSeparator';

interface MessageListProps {
	items: ListItem[];
	loading: boolean;
	hasMore: boolean;
	error: string | null;
	firstItemIndex: number;
	virtuosoRef: RefObject<VirtuosoHandle | null>;
	loadMore: () => void;
	user: User | null;
	updateMessage: (messageId: string, updates: Partial<Message>) => void;
	handleNavigateToReply: (messageId: string) => void;
	highlightedMessageId: string | null;
	handleSelectMessage: (messageId: string) => void;
	selectedMessageIds: string[];
	isLinkingMode: boolean;
}

export const MessageList = ({
	items,
	loading,
	hasMore,
	error,
	firstItemIndex,
	virtuosoRef,
	loadMore,
	user,
	updateMessage,
	handleNavigateToReply,
	highlightedMessageId,
	handleSelectMessage,
	selectedMessageIds,
	isLinkingMode,
}: MessageListProps) => {
	return (
		<Virtuoso
			ref={virtuosoRef}
			style={{ height: 'calc(100vh - 88px)' }}
			firstItemIndex={firstItemIndex}
			followOutput='auto'
			data={items}
			initialTopMostItemIndex={items.length - 1}
			startReached={loadMore}
			computeItemKey={(_index, item) => ('_id' in item ? item._id : item.id)}
			increaseViewportBy={{ top: 800, bottom: 200 }}
			itemContent={(_index, item) => {
				if ('type' in item && item.type === 'date-separator') {
					return <DateSeparator date={item.date} />;
				}

				return (
					<ChatBubble
						message={item}
						showTail={item.showTail}
						onUpdateMessage={updateMessage}
						myUserName={user?.username}
						onNavigateToReply={handleNavigateToReply}
						isHighlighted={item._id === highlightedMessageId}
						onSelectMessage={handleSelectMessage}
						isSelected={isLinkingMode && selectedMessageIds.includes(item._id)}
						isLinkingMode={isLinkingMode}
					/>
				);
			}}
			components={{
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				Item: ({ children, item: _item, ...props }) => (
					<div {...props} className='px-4 max-w-2xl mx-auto mb-2'>
						{children}
					</div>
				),
				Header: () => (
					<div className='h-12 flex justify-center items-center text-center text-sm text-gray-400'>
						{loading && hasMore && 'Cargando más mensajes...'}
						{!loading && !hasMore && items.length > 0 && 'Fin de la conversación.'}
					</div>
				),
				Footer: () => (
					<div className='pb-2'>{error && <div className='text-center text-sm text-red-400 py-2'>{error}</div>}</div>
				),
			}}
			className='scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800'
		/>
	);
};
