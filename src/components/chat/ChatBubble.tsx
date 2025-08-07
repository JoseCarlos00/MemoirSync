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

const messageRenderers = {
  text: MessageText,
  image: MessageImage,
  audio: MessageAudio,
  video: MessageVideo,
  sticker: MessageSticker,
} as const;

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isMe = message.sender === "me";

  const containerClass = isMe ? "justify-end" : "justify-start";
  const bubbleClass = isMe
    ? "bg-chat-sent text-white rounded-tr-none"
    : "bg-chat-received text-gray-200 rounded-tl-none";

  const Renderer = messageRenderers[message.type] || UnsupportedMessage;

  return (
    <div className={`flex relative mb-2 ${containerClass}`}>
      <BubbleTail isMe={isMe} />
      <div
        className={`max-w-[70%] px-4 py-2 rounded-lg shadow relative ${bubbleClass}`}
      >
        <p className="text-sm text-white">
          <Renderer message={message} />
        </p>
        <p className="text-[10px] text-right mt-1 opacity-70">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "America/Mexico_City",
            hour12: true,
          })}
        </p>
      </div>
    </div>
  );
}
