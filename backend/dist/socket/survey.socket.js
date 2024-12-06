"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SurveySocket {
    constructor(io) {
        this.io = io;
        this.init();
    }
    init() {
        this.io.on('connection', (socket) => {
            console.log('A new client connected');
            socket.on('userConnected', (data) => {
                socket.broadcast.emit('newUserConnected', `${data.username} has connected`);
            });
            socket.on('newPoll', (data) => {
                console.log('New poll data received:', data);
                socket.broadcast.emit('newPoll', data);
            });
            socket.on('disconnect', () => {
                console.log('A client disconnected');
            });
        });
    }
}
exports.default = SurveySocket;
