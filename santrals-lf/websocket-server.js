const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 4000 });

server.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      console.log(`Received message from ${parsedMessage.type}: ${parsedMessage.text}`);

      // Broadcast the message to all connected clients
      server.clients.forEach((client) => {
        if (client !== socket && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(parsedMessage));
        }
      });
    } catch (error) {
      console.error('Error parsing incoming message:', error);
    }
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on port 4000');
