import { createContext, useEffect, useState } from "react";
import { of } from "rxjs";
import io from "socket.io-client";
import "./App.css";
// const URL = "http://localhost:3000";
const URL = "http://testpong2-env.eba-rnsvppyh.eu-central-1.elasticbeanstalk.com/";
import Router from "./components/Router.jsx";

export const SocketContext = createContext();

function App() {
  const [socket$, setSocket$] = useState(undefined);

  useEffect(() => {
    const socket = io(URL, { autoConnect: true });
    socket.on("connect", () => {
      setSocket$(of(socket));
    });
  }, []);

  return (
    <div className="App">
      {socket$ ? (
        <SocketContext.Provider value={socket$}>
          <Router />
        </SocketContext.Provider>
      ) : (
        <div>No socket available</div>
      )}
    </div>
  );
}

export default App;
