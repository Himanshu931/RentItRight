import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./routes/auth.route";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { RATE_LIMITER } from "./middleware/rateLimiter";
import { AUTH_LIMITER } from "./middleware/rateLimiter";
dotenv.config();

const app = express();

//middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(RATE_LIMITER);

//routes
app.use("/api/v1/auth", AUTH_LIMITER, authRoute);

//healthcheck
app.get("/", (req, res) => {
    res.send("API is running...")
})


export default app;