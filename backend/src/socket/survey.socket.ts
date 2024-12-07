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
        
        this.io.emit('newPoll', data);
      });

      socket.on('deleteSurvey', (surveyId) => {
        console.log(`Deleting survey with ID: ${surveyId}`);
       this.io.emit('surveyDeleted', surveyId);
      });

      socket.on('vote', async (surveyId, optionIndex) => {
        try {
          const survey = await Survey.findById(surveyId); 
          if (survey) {
            survey.votes[optionIndex];
            await survey.save();
            this.io.emit('voteUpdated', {
              surveyId,
              votes: survey.votes,
            });
          }
        } catch (error) {
          console.error("Error al actualizar los votos:", error);
        }
      });

      socket.on('disconnect', () => {
        console.log('A client disconnected');
      });
    });
  }
}

export default SurveySocket;
