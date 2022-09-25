import { createContext } from "react";
import { of } from "rxjs";
import io from "socket.io-client";
import "./App.css";
const URL = "http://localhost:3000";
import RouterSceen from "./components/RouterSceen.jsx";

export const SocketContext = createContext();
const connectionListener = () => console.log("Socket connected...");
const socket = io(URL, { autoConnect: true });
const socket$ = of(socket);
socket.on("connect", connectionListener);

function App() {
  return (
    <div className="App">
      {socket ? (
        <SocketContext.Provider value={socket$}>
          <RouterSceen />
        </SocketContext.Provider>
      ) : (
        <div>No socket available</div>
      )}
    </div>
  );
}

export default App;
