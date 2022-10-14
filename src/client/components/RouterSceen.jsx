import LogIn from "./LogIn.jsx";
import ChatScreen from "./ChatScreen";
import { useSocketListener } from "../utils";

const RouterScreen = () => {
  const { roomName, userName } = useSocketListener("room joined", {});

  //  In LogIn, user can create or join room.
  //  When joined, ChatScreen is rendered.
  return <div>{!roomName ? <LogIn /> : <ChatScreen room={roomName} />}</div>;
};

export default RouterScreen;
