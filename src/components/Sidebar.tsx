import { Home, Users, User, LogOutIcon } from "lucide-react";
import { Button } from "./ui/button";
import useAuthStore from "@/store/authStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ThemeToggle } from "./theme/ThemeToggle";
import ToolTip_ from "./ToolTip_";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: "home" | "friends" | "profile") => void;
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="w-20 border-r bg-card flex flex-col items-center py-4 gap-4">
      <div className="w-12 h-12 rounded-full overflow-hidden mb-4">
        <ToolTip_ content={[user?.fullName!, "-", user?.username!]}>
          <Avatar>
            <AvatarImage src={user?.profilePic} />
            <AvatarFallback>{user?.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </ToolTip_>
      </div>

      <Button
        variant={activeTab === "home" ? "default" : "ghost"}
        size="icon"
        onClick={() => onTabChange("home")}
      >
        <Home className="h-5 w-5" />
      </Button>

      <Button
        variant={activeTab === "friends" ? "default" : "ghost"}
        size="icon"
        onClick={() => onTabChange("friends")}
      >
        <Users className="h-5 w-5" />
      </Button>

      <Button
        variant={activeTab === "profile" ? "default" : "ghost"}
        size="icon"
        onClick={() => onTabChange("profile")}
      >
        <User className="h-5 w-5" />
      </Button>

      <div className="mt-auto flex flex-col gap-4">
        <ThemeToggle />
        <AlertDialog>
          <AlertDialogTrigger>
            <ToolTip_ content="Logout">
              <Button variant="destructive" size="icon">
                <LogOutIcon className="h-5 w-5" />
              </Button>
            </ToolTip_>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You will be logged-out from GossipGoblin. You can login again
                anytime you want.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={logout} className="bg-destructive">
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
