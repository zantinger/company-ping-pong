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
    socket.on('develop', devLog)
    socket.on('gameData', gameDataHandler)
    // socket.on('roomConnection', roomHandler)
    // socket.on('chatMessage', chatMessageHandler)
    // socket.on('playerData', playerDataHandler)
    // socket.on('gameMessage', gameMessageHandler)

    return () => [
      // socket.off('roomConnection', roomHandler),
      // socket.off('chatMessage', chatMessageHandler),
      // socket.off('playerData', playerDataHandler),
      // socket.off('gameMessage', gameMessageHandler),
      socket.off('gameData', gameDataHandler),
      socket.off('develop', devLog),
      window.removeEventListener('keydown', keyDownHandler),
      window.removeEventListener('keyup', keyUpHandler),
    ]
  }, [])
  
  const devLog = console.log

  // const gameMessageHandler = (gameObjects) => {
  //   console.log(gameObjects)
  //   setPlayerData(gameObjects)
  // }

  // Register user in room
  // TODO: Room must be selectable
  socket.emit("roomConnection", { name: "Michael", room: 'myRoom1' });


  // Handler for key press
  // Sending @type and @payload to channel keyPressed
  const keyUpHandler = ({repeat, keyCode}) => {
    if (repeat) return;
socket.emit('keyPressed', {type: 'KEY_UP', payload: keyCode})
  }
  const keyDownHandler = ({repeat, keyCode}) => {
    if (repeat) return;
    console.log('######')
socket.emit('keyPressed', {type: 'KEY_DOWN', payload: keyCode})
  }

  const gameDataHandler = setPlayerData

  // const playerDataHandler = (data) => {
  //   (data && data.direction === 'UP') ? onKeyUp(data) : onKeyDown(data)
  // }

  // const roomHandler = (user) => setRoom(user.room)

  // const chatMessageHandler = message => setMessages(old => [...old, message])

  // const clickHandler = () => {
  //   socket.emit('chatMessage', newMessage)
  //   setNewMessage("");
  // };


        // <button onClick={clickHandler}>Send</button>
        // <button onClick={()=> socket.emit('gameMessage', {type: 'START'})}>Start Game</button>
      // <button onClick={selectRoomHandler}>Enter room 1</button>
  return (
    <div>
      <h1>Hello World</h1>
      <h2>{'Room: ' + room}</h2>
      <div>
        <input
          type="text"
          value={newMessage}
          onChange={({ target: { value } }) => setNewMessage(value)}
        />
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


