import { Server, Socket } from 'socket.io';
import Survey from '../model/survey.model';
class SurveySocket {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    this.init();
  }


  private init() {
    this.io.on('connection', (socket: Socket) => {
      console.log('A new client connected');

      socket.on('userConnected', (data: { username: string }) => {
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

export default SurveySocket;
