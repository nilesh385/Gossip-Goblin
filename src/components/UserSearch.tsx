import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";

const searchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
});

interface SearchedUser {
  _id: string;
  username: string;
  fullName: string;
  profilePic: string;
}

export const UserSearch = () => {
  const [searchResults, setSearchResults] = useState<SearchedUser[]>([]);
  const token = useAuthStore((state) => state.token);
  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof searchSchema>) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/search?query=${data.query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSearchResults(response.data);
    } catch (error) {
      toast.error("Failed to search users");
    }
  };

  const sendFriendRequest = async (userId: string) => {
    try {
      await axios.post(
        `http://localhost:3000/api/users/friend-request/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Friend request sent");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to send friend request"
      );
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Search users by email or username..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Search</Button>
        </form>
      </Form>

      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {searchResults.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
            >
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={user.profilePic} alt={user.username} />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    @{user.username}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => sendFriendRequest(user._id)}
              >
                <UserPlus className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
