import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import userRoutes from './routes/user.routes';

dotenv.config();

// Database
connectDB();

const app = express();

//CORS
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
app.use('/api/users', userRoutes);

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
