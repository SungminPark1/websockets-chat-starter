const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');
const utils = require('./utils.js');

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
      msg: `There are ${Object.keys(users).length} users online`,
    };

    socket.name = data.name;
    users[socket.name] = socket.name;

    // emit msg to new user
    socket.emit('msg', joinMsg);
    socket.join('room1');

    // emit msg to everyone in room
    const res = {
      name: 'server',
      msg: `${data.name} has joined the room`,
    };
    socket.broadcast.to('room1').emit('msg', res);

    // emit msg to new user
    socket.emit('msg', {
      name: 'server',
      msg: 'You joined the room',
    });
  });
};

const onMsg = (sock) => {
  const socket = sock;

  socket.on('msgToServer', (data) => {
    // commands
    if (data.substring(0, 1) === '/') {
      if (data.substring(1, 5) === 'help') {
        socket.emit('msg', {
          name: 'server',
          msg: utils.commands,
        });
      } else if (data.substring(1, 5) === 'roll') {
        const number = Math.floor((Math.random() * 6) + 1);
        io.sockets.in('room1').emit('msg', {
          name: 'server',
          msg: `${socket.name} rolled a ${number} on a six sided die`,
        });
      } else if (data.substring(1, 5) === 'time') {
        const d = new Date();
        const timeString = `${1 + d.getMonth()}/${d.getDate()}/${d.getFullYear()}, ${d.getHours()}:${d.getMinutes()}`;
        socket.emit('msg', {
          name: 'server',
          msg: timeString,
        });
      } else if (data.substring(1, 6) === 'users') {
        socket.emit('msg', {
          name: 'server',
          msg: `Number of users: ${Object.keys(users).length}`,
        });
      } else if (data.substring(1, 4) === 'dog') {
        const dog = `${socket.name} summoned the Annoying Dog. ${utils.dog}`;
        io.sockets.in('room1').emit('msg', {
          name: 'server',
          msg: dog,
        });
      } else if (data.substring(1, 11) === 'changeuser') {
        const newName = data.substring(12);
        io.sockets.in('room1').emit('msg', {
          name: 'server',
          msg: `${socket.name} has changed their name to ${newName}`,
        });

        delete users[socket.name];

        socket.name = newName;
        users[socket.name] = socket.name;
      } else {
        socket.emit('msg', {
          name: 'server',
          msg: utils.invalidCommand,
        });
      }
      return;
    }

    io.sockets.in('room1').emit('msg', {
      name: socket.name,
      msg: data,
    });
  });
};

const onDisconnect = (sock) => {
  const socket = sock;

  socket.on('disconnect', () => {
    io.sockets.in('room1').emit('msg', {
      name: 'server',
      msg: `${socket.name} has left the room.`,
    });
    delete users[socket.name];
  });
};

io.sockets.on('connection', (socket) => {
  onJoined(socket);
  onMsg(socket);
  onDisconnect(socket);
});

console.log('Websocket server started');
