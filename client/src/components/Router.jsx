import LogIn from "./LogIn.jsx";
import Room from "./Room";
import { useSocketListener } from "../utils";

const Router = () => {
  const { user, room } = useSocketListener("room joined", {});

  return <div>{!room ? <LogIn /> : <Room room={room} user={user} />}</div>;
};

export default Router;
