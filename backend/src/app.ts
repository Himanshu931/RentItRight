import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./routes/auth.route";
import helmet from "helmet";
import morgan from "morgan";
dotenv.config();

const app = express();

//middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

//routes
app.use("/api/v1/auth", authRoute);

//healthcheck
app.get("/", (req, res) => {
    res.send("API is running...")
})


export default app;