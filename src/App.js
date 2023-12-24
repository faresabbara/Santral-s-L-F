// Importing necessary styles, libraries, and components
import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

// Creating a socket connection to the server
const socket = io.connect("http://localhost:3001");

// Main App component
function App() {
  // State variables for username, room, and whether to show the chat
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  // Function to join a chat room
  const joinRoom = () => {
    // Check if both username and room are provided
    if (username !== "" && room !== "") {
      // Emit a "join_room" event to the server
      socket.emit("join_room", room);

      // Set showChat to true, rendering the Chat component
      setShowChat(true);
    }
  };

  // JSX rendering of the component
  return (
    <div className="App">
      {/* Conditional rendering based on showChat */}
      {!showChat ? (
        // Render the join chat form
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          {/* Input for username */}
          <input
            type="text"
            placeholder="Name..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          {/* Input for room ID */}
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          {/* Button to join the room */}
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        // Render the Chat component if showChat is true
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

// Exporting the App component
export default App;
