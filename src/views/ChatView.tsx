import { useEffect, useRef, useCallback } from 'react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import { useChat } from '../hooks/useChat';
import ChatBubble from '../components/chat/ChatBubble';
import HeaderChat from '../components/HeaderChat';
import '../views/ChatView.css';

const MESSAGE_FETCH_LIMIT = 30;

export default function ChatView() {
  const {
    messages,
    fetchMessages,
    fetchMoreMessages,
    loading,
    error,
    hasMore,
    updateMessage,
  } = useChat();

  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const isInitialLoad = useRef(true);

  // Carga inicial
  useEffect(() => {
    if (messages.length === 0) {
      fetchMessages({ limit: MESSAGE_FETCH_LIMIT });
    }
  }, [fetchMessages, messages.length]);

  // Cargar más mensajes (scroll arriba)
  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    fetchMoreMessages({ limit: MESSAGE_FETCH_LIMIT });
  }, [hasMore, loading, fetchMoreMessages]);

  // Ajustar scroll inicial
  useEffect(() => {
    if (isInitialLoad.current && messages.length > 0) {
      virtuosoRef.current?.scrollToIndex({
        index: messages.length - 1,
        align: 'end',
        behavior: 'auto',
      });
      isInitialLoad.current = false;
    }
  }, [messages.length]);

  // Vista de carga inicial
  if (loading && messages.length === 0) {
    return (
      <div className="bg-chat-background text-gray-200 view-chat-container h-screen flex flex-col">
        <HeaderChat messagesTotal={0} />
        <div className="flex-grow flex items-center justify-center text-center text-sm text-gray-400">
          Cargando mensajes...
        </div>
      </div>
    );
  }

  // Vista de error inicial
  if (error && messages.length === 0) {
    return (
      <div className="bg-chat-background text-gray-200 view-chat-container h-screen flex flex-col">
        <HeaderChat messagesTotal={0} />
        <div className="flex-grow flex items-center justify-center text-center text-sm text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-chat-background text-gray-200 view-chat-container">
      <HeaderChat messagesTotal={messages.length} />

      <Virtuoso
        ref={virtuosoRef}
        style={{ height: 'calc(100vh - 68px)' }}
        data={messages}
        initialTopMostItemIndex={messages.length - 1}
        startReached={loadMore}
        followOutput="smooth"
        increaseViewportBy={{ top: 400, bottom: 200 }}
        itemContent={(index, msg) => {
          const prevMessage = messages[index - 1];
          const showTail = !prevMessage || prevMessage.sender !== msg.sender;
          return (
            <div key={msg._id} className="px-4 max-w-2xl mx-auto mb-2">
              <ChatBubble
                message={msg}
                showTail={showTail}
                onUpdateMessage={updateMessage}
              />
            </div>
          );
        }}
        components={{
          Header: () =>
            hasMore ? (
              <div className="text-center text-sm text-gray-400 py-4">
                {loading ? 'Cargando más mensajes...' : 'Desliza para cargar más'}
              </div>
            ) : (
              <div className="pt-2" />
            ),
          Footer: () => (
            <div className="pb-2">
              {error && !loading && <div className="text-center text-sm text-red-400 py-2">{error}</div>}
            </div>
          ),
        }}
        className="scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
      />
    </div>
  );
}
