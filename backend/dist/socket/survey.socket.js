"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SurveySocket {
    constructor(io) {
        this.io = io;
        this.init();
    }
    // Inicializar el manejo de eventos en los sockets
    init() {
        this.io.on('connection', (socket) => {
            console.log('Un nuevo cliente se ha conectado');
            // Emitir un mensaje a todos los clientes cuando un nuevo usuario se conecta
            socket.on('userConnected', (data) => {
                this.io.emit('newUserConnected', `${data.username} has connected`);
            });
            // Escuchar el evento para crear una nueva encuesta
            socket.on('newPoll', (data) => {
                console.log('New poll data received:', data);
                // Emitir el evento 'newPoll' a todos los clientes conectados
                this.io.emit('newPoll', data);
            });
            // Escuchar desconexiones de clientes
            socket.on('disconnect', () => {
                console.log('Un cliente se ha desconectado');
            });
        });
    }
}
exports.default = SurveySocket;
