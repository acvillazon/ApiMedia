/* eslint-disable global-require */
/* eslint-disable func-names */
const Express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');
const io = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');

const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
  path: `./src/.env.${ENV}`,
});

const { LOWDB } = require('./middleware/lowdb.middleware');

new LOWDB().createDB(); // create DB lowDb
const app = new Express();
const port = process.env.PORT || 3000;

require('./bin/connectionDB');

// Middelwares
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
// /Static files
app.use(Express.static(path.resolve(__dirname, 'public')));

// / ROUTES
const track = require('./routes/tracks.routes');
const videos = require('./routes/videos.routes');
const users = require('./routes/user.routes');
const chat = require('./routes/chat.routes');

app.use(track);
app.use(videos);
app.use(users);
app.use(chat);

// / Server HTTP
const server = http.createServer(app);

// / CONNECTION TO SOCKET
module.exports.io = io(server);
require('./bin/socket.connection');

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
