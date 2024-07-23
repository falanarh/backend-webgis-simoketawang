import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import connectDB from './config/db';
import rtRoutes from './routes/rtRoutes';
import rumahTanggaRoutes from './routes/rumahTanggaRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

connectDB();

app.use(morgan('dev'));
app.use(express.json());
// app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/rumahTangga', rumahTanggaRoutes);
app.use('/api/rt', rtRoutes);

export default app;