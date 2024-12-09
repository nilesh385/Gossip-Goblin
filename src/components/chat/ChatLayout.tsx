import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';

export const ChatLayout = () => {
  return (
    <div className="h-full grid grid-cols-[320px_1fr]">
      <div className="border-r">
        <ConversationList />
      </div>
      <ChatWindow />
    </div>
  );
};