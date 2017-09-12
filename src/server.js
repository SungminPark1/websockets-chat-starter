const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const index = fs.readFileSync(`${__dirname}/../client/client.html`);

const onRequest = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(index);
  res.end();
};

const app = http.createServer(onRequest).listen(port);

console.log(`Listening on localhost:${port}`);

const io = socketio(app);

const users = {};

const onJoined = (sock) => {
  const socket = sock;

  socket.on('join', (data) => {
    const joinMsg = {
      name: 'server',
      msg: `There are ${Object.jeys(users).length} users online`,
    };

    socket.name = data.name;
    // emit msg to new user
    socket.emit('msg', joinMsg);

    socket.join('room1');

    // emit msg to everyone in room
    const res = {
      name: 'server',
      msg: `${data.name} has joined the room`,
    };
    socket.broadcast.to('room1').emit('msg', res);

    console.log(`${data.name} joined`);

    // emit msg to new user
    socket.emit('msg', {
      name: 'server',
      msg: 'You joined the room',
    });
  });
};

const onMsg = (sock) => {
  const socket = sock;
};

const onDisconnect = (sock) => {
  const socket = sock;
};

io.sockets.on('connection', (socket) => {
  console.log('started');

  onJoined(socket);
  onMsg(socket);
  onDisconnect(socket);
});

console.log('Websocket server started');
