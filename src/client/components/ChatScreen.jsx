import { filter, BehaviorSubject, Subject, map, withLatestFrom } from "rxjs";
import { useObservable, useSocketEmiter, useSocketListener } from "../utils";

const chatMessage$ = new BehaviorSubject("");
const clickSending$ = new Subject();
const messageOnClick$ = clickSending$.pipe(
  withLatestFrom(chatMessage$),
  map((x) => x[1]),
  filter((x) => !!x)
);

const ChatScreen = ({ room }) => {
  const chatValue = useObservable(chatMessage$, "");

  useSocketEmiter(messageOnClick$, ({ socket, data }) => {
    socket.emit("chat message", data);
    chatMessage$.next("");
  });

  const allMessages = useSocketListener("foo", []);

  return (
    <div>
      <h2 className="header">You have entered room {room}</h2>
      <div className="row">
        <div className="column column-25">
          <div className="sidebar">
            <div className="chat">
              <div className="messages">
                {allMessages.map(({ author, msg }, index) => (
                  <div key={index}>
                    <span>{author}:</span>
                    <b>{msg}</b>
                  </div>
                ))}
              </div>
              <div className="textfield">
                <input
                  type="text"
                  value={chatValue}
                  onChange={(e) => chatMessage$.next(e.target.value)}
                />
                <button onClick={(e) => clickSending$.next(e)}>Send</button>
              </div>
            </div>
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
