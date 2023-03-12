import { BehaviorSubject } from "rxjs";
import { createMessageStream } from "./messages.mjs";
import PingPong from "./PingPong.mjs";

const rooms = new Map();

export const createRoomStreams = ({ io, client, room }) => {
  const { newMessage } = createMessageStream({ io, room });

  return {
    newMessage,
    pingPong: new PingPong(io)
  };
};
