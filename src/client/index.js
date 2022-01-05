import React, { useState, useEffect } from "react";
import ReactDom from "react-dom";
import { of, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { runPingPong , onKeyDown , onKeyUp, getPlayerData, setPlayerData} from './ping-pong'

const socket = io();

socket.on('myRoom1', (value) => {
  // console.log('value: ', value)
});

socket.on("message", (message) => {
  // console.log(message);
});


// App
const App = () => {
  const [messages, setMessages] = useState(["hallo"]);
  const [newMessage, setNewMessage] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);
    socket.on('roomConnection', roomHandler)
    socket.on('chatMessage', chatMessageHandler)
    socket.on('playerData', playerDataHandler)
    socket.on('gameMessage', gameMessageHandler)

    return () => [
      socket.off('roomConnection', roomHandler),
      socket.off('chatMessage', chatMessageHandler),
      socket.off('playerData', playerDataHandler),
      socket.off('gameMessage', gameMessageHandler),
      window.removeEventListener('keydown', keyDownHandler),
      window.removeEventListener('keyup', keyUpHandler),
    ]
  }, [])

  const gameMessageHandler = (gameObjects) => {
    console.log(gameObjects)
    setPlayerData(gameObjects)
  }

  const keyUpHandler = ({keyCode}) => socket.emit('playerData', keyCode, 'UP')
  const keyDownHandler = ({keyCode}) => socket.emit('gameMessage', {type: 'KEY_CODE', keyCode})

  const playerDataHandler = (data) => {
    (data && data.direction === 'UP') ? onKeyUp(data) : onKeyDown(data)
  }

  const roomHandler = (user) => setRoom(user.room)

  const chatMessageHandler = message => setMessages(old => [...old, message])

  const clickHandler = () => {
    socket.emit('chatMessage', newMessage)
    setNewMessage("");
  };

  const selectRoomHandler = () => {
    socket.emit("roomConnection", { name: "Michael", room: 'myRoom1' });
  }

  return (
    <div>
      <h1>Hello World</h1>
      <h2>{'Room: ' + room}</h2>
      <button onClick={selectRoomHandler}>Enter room 1</button>
      <div>
        <input
          type="text"
          value={newMessage}
          onChange={({ target: { value } }) => setNewMessage(value)}
        />
        <button onClick={clickHandler}>Send</button>
        <button onClick={()=> socket.emit('gameMessage', {type: 'START'})}>Start Game</button>
      </div>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

ReactDom.render(<App />, document.getElementById("app"));

runPingPong()


