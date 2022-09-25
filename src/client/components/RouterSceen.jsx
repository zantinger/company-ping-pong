import LogIn from "./LogIn.jsx";
import ChatScreen from "./ChatScreen";
import { useSocketListener } from "../utils";

const RouterScreen = () => {
  const {roomName, userName } = useSocketListener("room joined", {});

  return <div>{!roomName ? <LogIn /> : <ChatScreen room={roomName} />}</div>;
};

export default RouterScreen;
