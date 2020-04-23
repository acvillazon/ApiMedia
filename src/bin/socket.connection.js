
var socketio = function(app,server){
    app.io = require('socket.io')();
    app.io.listen(server);
    
    app.io.on('connection', (socket) => {
        console.log("New user connected!");
        
        socket.on('streamToMaster', (data) => {
          socket.emit("streamFromClient",data);
        });
    });
}

module.exports = socketio;