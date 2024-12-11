import { Card } from "../ui/card";
import { FriendsList } from "./FriendsList";
import SentFriendRequests from "./SentFriendRequests";

type Props = {};

export default function FriendsTab({}: Props) {
  return (
    <Card className="h-full w-full overflow-hidden flex">
      <FriendsList />
      <SentFriendRequests />
    </Card>
  );
}
