const IoService = require('app/Services').IoService;

module.exports = (io) => {

    IoS = new IoService();

    var chat = io.of('/chat');
    chat.on('connection', (socket) => {
        IoS.addClient(socket, socket.handshake.query);
        
        socket.on('newRoom', (data) => {
            let emit = IoS.newRoom(data);

            io.sockets.in(room).emit('o', {
                message: emit
            });
        });

        socket.on('i', (data) => {
            io.sockets.in(data.room).emit('o', {
                message: data.message
            });
        });

        socket.on('disconnect', () => {
            IoS.removeClient(socket, socket.handshake.query);
        });
    });
}
