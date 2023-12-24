// Importing necessary libraries
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

// Adding CORS middleware to allow cross-origin requests
app.use(cors());

// Creating an HTTP server using Express
const server = http.createServer(app);

// Creating a Socket.IO server and configuring CORS options
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: ["GET", "POST"], // Allow specified HTTP methods
  },
});

// Event handler when a client connects to the server
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`); // Log when a user connects

  // Event handler for when a user joins a room
  socket.on("join_room", (data) => {
    socket.join(data); // Join the specified room
    console.log(`User with ID: ${socket.id} joined room: ${data}`); //to
  });

  // Event handler for when a user sends a message
  socket.on("send_message", (data) => {
    // Send the message to all clients in the specified room, except the sender
    socket.to(data.room).emit("receive_message", data);
  });

  // Event handler when a client disconnects from the server
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id); // Log when a user disconnects
  });
});

// Start the server and listen on port 3001
server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
