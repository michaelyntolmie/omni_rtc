const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000, host: '0.0.0.0' });

const rooms = {};

wss.on('connection', (ws, req) => {
  const roomName = req.url.slice(1);
  if (!rooms[roomName]) {
    rooms[roomName] = [];
  }
  rooms[roomName].push(ws);

  console.log(`New client connected to room: ${roomName}`);

  ws.on('message', (message) => {
    rooms[roomName].forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    rooms[roomName] = rooms[roomName].filter(client => client !== ws);
    console.log('Client disconnected');
  });
});

