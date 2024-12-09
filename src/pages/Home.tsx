import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { UserProfile } from "@/components/UserProfile";
import { useSocket } from "@/hooks/useSocket";
import { FriendsList } from "@/components/friends/FriendsList";

type Tab = "home" | "friends" | "profile";

const Home = () => {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  useSocket();

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <ChatLayout />;
      case "friends":
        return <FriendsList />;
      case "profile":
        return <UserProfile />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-hidden">{renderContent()}</main>
    </div>
  );
};

export default Home;
