import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('A user connected with socket ID:', socket.id); // pretty cool!

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    // io.emit -  sends an event to everyone
    io.emit('chat message', msg);

    // io.to - sends message to specific socket.id
    io.to(socket.id).emit(
      'privateMessage',
      'SERVER msg: Hello! Your id is: ' + socket.id
    );
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
