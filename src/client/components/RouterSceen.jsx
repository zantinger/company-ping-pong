import LogIn from "./LogIn.jsx";
import ChatScreen from "./ChatScreen";
import { useSocketListener } from "../utils";

const RouterScreen = () => {
  const { user, room } = useSocketListener("room joined", {});

  //  In LogIn, user can create or join room.
  //  When joined, ChatScreen is rendered.
  return (
    <div>{!room ? <LogIn /> : <ChatScreen room={room} user={user} />}</div>
  );
};

export default RouterScreen;
