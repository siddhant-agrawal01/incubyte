import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

dotenv.config();

const app: Application = express();

const PORT = process.env.PORT;

const FRONTED_URL = process.env.FRONTED_URL;
app.use(helmet());

app.use(
  cors({
    origin: FRONTED_URL,
    credentials: true,
  })
);

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many authentication attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("api/auth", authLimiter);
app.use("api/sweets", apiLimiter);

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`server is online on port : ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

export default app;
