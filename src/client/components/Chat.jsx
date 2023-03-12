import { filter, BehaviorSubject, Subject, map, withLatestFrom } from "rxjs";
import { useObservable, useSocketEmiter, useSocketListener } from "../utils";

// Subject for user input
const writtenMsg$ = new BehaviorSubject("");

// Subject for click
const clickSend$ = new Subject();

const emitMsg$ = clickSend$.pipe(
  withLatestFrom(writtenMsg$),
  map(([_, msg]) => msg),
  filter((msg) => !!msg)
);

const Chat = () => {
  const messages = useSocketListener("chat messages", []);
  const writtenMsg = useObservable(writtenMsg$, "");

  // Emit written message to server and clear input
  useSocketEmiter(emitMsg$, ({ socket, data }) => {
    socket.emit("chat messages", { message: data });
    writtenMsg$.next("")
  });

  return (
    <div className="chat">
      <div className="messages">
        {messages.map(({ user, message }, index) => (
          <div key={index}>
            <span>{user}:</span>
            <b>{message}</b>
          </div>
        ))}
      </div>
      <div className="textfield">
        <input
          type="text"
          value={writtenMsg}
          onChange={(e) => writtenMsg$.next(e.target.value)}
        />
        <button onClick={(e) => clickSend$.next(e)}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
