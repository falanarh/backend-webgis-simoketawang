import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDB from "./config/db";
import rtRoutes from "./routes/rtRoutes";
import rumahTanggaRoutes from "./routes/rumahTanggaRoutes";
import authRoutes from "./routes/authRoutes";

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

app.use(express.json());
// app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/rumahTangga", rumahTanggaRoutes);
app.use("/api/rt", rtRoutes);

export default app;
