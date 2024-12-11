import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { toast } from "sonner";
import { users } from "@/lib/api";
import { Loader2 } from "lucide-react";

type Props = {
  children: React.ReactNode;
  friendId: string;
};

export default function ViewFriendProfile({ children, friendId }: Props) {
  const [friendProfile, setFriendProfile] = useState<User>({} as User);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fretchFriendProfile = async () => {
      try {
        setLoading(true);
        const response = await users.getFriendProfile(friendId);
        console.log(response);
        setFriendProfile(response);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fretchFriendProfile();
  }, [friendId]);
  if (loading) {
    return;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side={"right"}>
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="animate-spin size-12" />
          </div>
        ) : !friendProfile ? (
          <div className="h-full flex items-center justify-center">
            Friend profile not found
          </div>
        ) : (
          <>
            <SheetHeader>
              <SheetTitle className="flex gap-3">
                <Avatar>
                  <AvatarImage src={friendProfile?.profilePic} />
                  <AvatarFallback>
                    {friendProfile?.fullName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>{friendProfile?.fullName}</div>
              </SheetTitle>
              <SheetDescription>@{friendProfile?.username}</SheetDescription>
            </SheetHeader>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>{friendProfile.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{friendProfile.bio}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
