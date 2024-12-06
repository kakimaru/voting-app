import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import http from 'http';
import {Server} from 'socket.io';
import connectDB from './config/db';
import surveyRoutes from './routes/survey.routes';
import SurveySocket from './socket/survey.socket';
import userRouter from './routes/user.routes';

dotenv.config();

// Database
connectDB();

const app = express();


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4321', 
    credentials: true,
  },
})


const corsOptions = {
  origin: 'http://localhost:4321', 
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/users', userRouter);
app.use('/api/surveys', surveyRoutes);


const surveySocket = new SurveySocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
