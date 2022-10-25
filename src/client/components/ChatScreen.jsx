import GameChat from './GameChat.jsx'

const ChatScreen = ({ room, user }) => {
  return (
    <div>
      <h2 className="header">You have entered room {room}</h2>
      <div className="row">
        <div className="column column-25">
          <div className="sidebar">
            <GameChat />
          </div>
        </div>
        <div className="column">
          <div className="content-area">X</div>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
