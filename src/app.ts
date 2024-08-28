import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDB from "./config/db";
import rtRoutes from "./routes/rtRoutes";
import rumahTanggaRoutes from "./routes/rumahTanggaRoutes";
import authRoutes from "./routes/authRoutes";
import slsRoutes from "./routes/slsRoutes";
import usahaKlengkengRoutes from "./routes/usahaKlengkengRoutes";
import uploadRoutes from './routes/uploadRoutes';

const cors = require("cors");

dotenv.config();

const app = express();

connectDB();

app.use(morgan("dev"));

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//   })
// );

app.use(cors({
  origin: ['https://desa-cantik-sda.vercel.app', 'http://localhost:5173'], // Ganti dengan domain Anda
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Metode yang diizinkan
  // allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
// app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/sls", slsRoutes)
app.use("/api/usahaKlengkeng", usahaKlengkengRoutes);
app.use('/api/photo', uploadRoutes);

export default app;
