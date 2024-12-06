import { Server, Socket } from 'socket.io';
import Survey from '../model/survey.model'; // Ruta donde está el modelo de la encuesta

class SurveySocket {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    this.init();
  }

  // Inicializar el manejo de eventos en los sockets
  private init() {
    this.io.on('connection', (socket: Socket) => {
      console.log('Un nuevo cliente se ha conectado');

      // Emitir un mensaje a todos los clientes cuando un nuevo usuario se conecta
      socket.on('userConnected', (data: { username: string }) => {
        this.io.emit('newUserConnected', `${data.username} has connected`);
      });

      // Escuchar el evento para crear una nueva encuesta
      socket.on('newPoll', (data) => {
        console.log('New poll data received:', data);
        
        // Emitir el evento 'newPoll' a todos los clientes conectados
        socket.broadcast.emit('newPoll', data);
      });

      // Escuchar desconexiones de clientes
      socket.on('disconnect', () => {
        console.log('Un cliente se ha desconectado');
      });
    });
  }
}

export default SurveySocket;
