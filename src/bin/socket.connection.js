const { io } = require('../index');
const { Message } = require('./message');
const Pending = require('../controllers/chats.controller');

const HASH_CONNECTION = new Map();

function SendMessage({ message, dest, user }) {
  const messageObject = new Message(message, user, dest);
  const destination = HASH_CONNECTION.get(dest);
  if (!destination) {
    console.log(Pending.createPending(messageObject));
  } else {
    io.to(destination).emit('newMessage', {
      private: true,
      message: {
        message: messageObject.message,
        user: messageObject.user,
        dest: messageObject.dest,
        date: messageObject.date,
      },
    });
  }
}

io.on('connection', (socket) => {
  io.to(socket.id).emit('newMessage', { YourID: socket.id });

  socket.on('streamToMaster', (data) => {
    io.emit('streamFromClient', data);
  });

  socket.on('disconnect', () => {
    HASH_CONNECTION.forEach((value, key) => {
      if (socket.id === value) {
        HASH_CONNECTION.delete(key);
      }
    });
  });

  socket.on('newMessage', (data) => {
    if (data.sayHi) {
      HASH_CONNECTION.set(data.id, socket.id);
    } else {
      SendMessage(data.message);
    }
  });
});
