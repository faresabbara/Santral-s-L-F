import React, { useState, useEffect } from 'react';
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
  // State variables
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [attachment, setAttachment] = useState(null);

  // Function to send a message to the server
  const sendMessage = async () => {
    if (currentMessage.trim() !== "") {
      // Prepare message data
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: `${new Date().getHours()}:${new Date().getMinutes()}`,
      };

      // Emit "send_message" event to the server
      await socket.emit("send_message", messageData);

      // Update messageList with the new message
      setMessageList((list) => [...list, messageData]);

      // Clear the input field
      setCurrentMessage("");
    }
  };

  const handleAttachmentChange = (event) => {
    // Handle changes in the attachment input
    const file = event.target.files[0];
    setAttachment(file);
  };

  const handleUploadClick = () => {
    // Trigger a click on the hidden file input
    document.getElementById("attachmentInput").click();
  };

  // Effect to listen for incoming messages from the server
  useEffect(() => {
    const receiveMessage = (data) => {
      // Update messageList with the received message
      setMessageList((list) => [...list, data]);
    };

    // Attach the event listener
    socket.on("receive_message", receiveMessage);

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("receive_message", receiveMessage);
    };
  }, [socket]);

  // Render the chat component
  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>L&F's Support</p>
      </div>
      <div className="chat-body">
        {/* ScrollToBottom component for automatic scrolling */}
        <ScrollToBottom className="message-container">
          {/* Map over messageList and render each message */}
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
                key={messageContent.time} // Use a unique key for each message
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="author">{messageContent.author}</p>
                    <p id="time">{messageContent.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        {/* Input for uploading an image file */}
        <input
          type="file"
          accept="image/*"
          onChange={handleAttachmentChange}
          style={{ display: 'none' }}
          id="attachmentInput"
        />
        {/* Upload button styled as a button for the attachment input */}
        <button onClick={handleUploadClick} className="upload-button">
          📎 
        </button>
        {/* Input field for typing messages */}
        <input
          type="text"
          value={currentMessage}
          placeholder="Message.."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        {/* Button to send messages */}
        <button onClick={sendMessage}>&#9658;</button>
        
      </div>
    </div>
  );
}

export default Chat;
