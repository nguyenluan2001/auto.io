let connection = null;
class Socket {
    constructor() {
        this._socket = null;
    }

    connect(server) {
        const io = require('socket.io')(server, {cors:{origin:"*"}});
        io.on('connection', (socket) => {
            console.log('SOCKET CONNECTED')
            this._socket = socket; 
            this._socket.on('statusConnetion',(data)=>{
                console.log(data)
            });
            this._socket.on('disconnect', () => {
                console.log(socket.id,"Un socket se desconecto");
            });
            console.log(`New socket connection: ${socket.id}`);
        });
    }

    sendEvent(event, data) {
        this._socket.emit(event, data);
    }

    registerEvent(event, handler) {
        this._socket.on(event, handler);
    }

    static init(server) {
        if(!connection) {
            connection = new Socket();
            connection.connect(server);
        }
    }

    static getConnection() {
        if(!connection) {
            throw new Error("no active connection");
        }
        return connection;
    }
}
module.exports = {
    connect: Socket.init,
    connection: Socket.getConnection 
}