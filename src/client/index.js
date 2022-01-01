import React, { useState, useEffect } from "react";
import ReactDom from "react-dom";

const socket = io();

socket.on('myRoom1', (value) => {
  console.log('value: ', value)
});

socket.on("message", (message) => {
  console.log(message);
});


const App = () => {
  const [messages, setMessages] = useState(["hallo"]);
  const [newMessage, setNewMessage] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    socket.on('roomConnection', roomHandler)
    socket.on('chatMessage', chatMessageHandler)

    return () => [
      socket.off('roomConnection', roomHandler),
      socket.off('chatMessage', chatMessageHandler),
    ]
  })

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
