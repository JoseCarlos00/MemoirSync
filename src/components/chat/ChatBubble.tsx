import { type Message } from "../../interfaces/message";
import BubbleTail from "./ChatBubble/BubbleTail";
import MessageText from "./ChatBubble/MessageText";
import MessageImage from "./ChatBubble/MessageImage";
import MessageAudio from "./ChatBubble/MessageAudio";
import MessageVideo from "./ChatBubble/MessageVideo";
import MessageSticker from "./ChatBubble/MessageSticker";
import UnsupportedMessage from "./ChatBubble/UnsupportedMessage";

interface ChatBubbleProps {
  message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isMe = message.sender === "me";

  const containerClass = isMe ? "justify-end" : "justify-start";

  const bgTypeSticker = ['sticker'].includes(message.type) ? 'bg-transparent shadow-none' : '';

  const bubbleClass = isMe ? `bg-chat-sent text-white rounded-tr-none ${bgTypeSticker}` : `bg-chat-received text-white rounded-tl-none ${bgTypeSticker}`;

  const renderMessageContent = () => {
    switch (message.type) {
      case "text":
        return <MessageText message={message} />;
      case "image":
        return <MessageImage message={message} />;
      case "audio":
        return <MessageAudio message={message} />;
      case "video":
        return <MessageVideo message={message} />;
      case "sticker":
        return <MessageSticker message={message} />;
      default:
        return <UnsupportedMessage />;
    }
  };

  return (
    <div className={`flex relative mb-2 ${containerClass}`}>
      <BubbleTail isMe={isMe} />
      <div
        className={`max-w-[70%] rounded-lg shadow relative ${bubbleClass}`}
      >
        <div className="text-sm text-white">{renderMessageContent()}</div>
        
      </div>
    </div>
  );
}
