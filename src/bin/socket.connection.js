
var socketio = function(app,server){
    app.io = require('socket.io')();
    app.io.listen(server);
    
    app.io.on('connection', (socket) => {
        socket.on('streamToMaster', (data) => {
          app.io.emit("streamFromClient",data);
        });
    });
}

module.exports = socketio;