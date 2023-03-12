import Chat from "./Chat.jsx";
import Canvas from "./Canvas.jsx";

const Room = ({ room, user }) => {
  return (
    <div>
      <h2 className="header">Hello {user}, you have entered room {room}</h2>
      <div className="row">
        <div className="column column-25">
          <div className="sidebar">
            <Chat />
          </div>
        </div>
        <div className="column">
          <div className="content-area">
            <Canvas />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
