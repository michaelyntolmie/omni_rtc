const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

const rooms = {};

wss.on('connection', (ws, req) => {
  const roomName = req.url.slice(1); // take "/room1" and make "room1"
  if (!rooms[roomName]) {
    rooms[roomName] = [];
  }
  rooms[roomName].push(ws);

  console.log(`New client connected to room: ${roomName}`);

  ws.on('message', (message) => {
    console.log('Received message:', message);

    // Send to everyone else in the same room
    rooms[roomName].forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    // Remove from room
    rooms[roomName] = rooms[roomName].filter(client => client !== ws);
  });
});
