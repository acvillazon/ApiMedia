const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser")
const http = require("http");

const app = new express();
const port = process.env.PORT || 3000;

//Middelwares
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(express.static('src/public'));

/// ROUTES
let track = require("./routes/tracks.routes");
let videos = require("./routes/videos.routes");

//Routes
app.use('/track', track);
app.use('/video', videos);

const server = http.createServer(app);

///SOCKET.IO
require("./bin/socket.connection")(app,server)
server.listen(port, () =>{
    console.log("Server listening on port "+port);
})