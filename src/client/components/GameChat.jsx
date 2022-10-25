import { useEffect } from "react";
import { filter, BehaviorSubject, Subject, map, withLatestFrom } from "rxjs";
import { useObservable, useSocketEmiter, useSocketListener } from "../utils";

// Subject for user input
const writtenMsg$ = new BehaviorSubject("");
const msgHistory$ = new BehaviorSubject([]);

// Subject for click
const clickSend$ = new Subject();

const emitMsg$ = clickSend$.pipe(
  withLatestFrom(writtenMsg$),
  map(([_, msg]) => msg),
  filter((msg) => !!msg)
);

const GameChat = () => {
  const incomingMsg = useSocketListener("chat message", null);
  const writtenMsg = useObservable(writtenMsg$, "");
  const msgHistory = useObservable(msgHistory$, []);

  // Messages are not stored by the server, so we handle it here.
  // Every incoming message trigger the next method on msgHistory$.
  useEffect(() => {
    const h = msgHistory$.value;
    msgHistory$.next(incomingMsg ? [...h, incomingMsg] : h);
  }, [incomingMsg]);

  // Emit written message to server and clear input
  useSocketEmiter(emitMsg$, ({ socket, data }) => {
    socket.emit("chat message", { message: data });
    writtenMsg$.next("");
  });

  return (
    <div className="chat">
      <div className="messages">
        {msgHistory.map(({ user, message }, index) => (
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

export default GameChat;
