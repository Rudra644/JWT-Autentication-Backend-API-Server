import express from 'express';
import connectDB from './config/database';
import userRoutes from './routes/userRoutes';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/users', userRoutes);

export default app;
