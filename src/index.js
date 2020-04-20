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

//Routes
app.use('/track', require('./routes/tracks.routes'));

const server = http.createServer(app);
server.listen(port, () =>{
    console.log("Server listening on port "+port);
})

