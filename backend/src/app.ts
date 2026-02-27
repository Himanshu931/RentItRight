import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import authRoute from "./routes/auth.route";
import userRouter from "./routes/user.route";
import exploreRoute from "./routes/explore.route";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { RATE_LIMITER, AUTH_LIMITER } from "./middleware/rateLimiter";
import csrf from "csurf";
import mongoSanitize from "express-mongo-sanitize";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { globalErrorHandler } from "./middleware/error.middleware";


const app = express();

// -------------------- CORS --------------------
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

// -------------------- SECURITY MIDDLEWARES --------------------
app.use(helmet());
app.use(morgan("dev"));
// app.use(mongoSanitize())
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// -------------------- RATE LIMITING --------------------
app.use(RATE_LIMITER);

// -------------------- CSRF SETUP --------------------
const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    },
});

// CSRF token endpoint
app.get("/api/v1/csrf-token", csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// -------------------- ROUTES --------------------
app.use("/api/v1/auth", AUTH_LIMITER, authRoute);
// app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", csrfProtection, userRouter);
app.use("/api/v1/explore", exploreRoute);

// -------------------- API DOCUMENTATION--------------------
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// -------------------- HEALTH CHECK --------------------
app.get("/", (req, res) => {
    res.send("API is running...");
});

// -------------------- CSRF ERROR HANDLER --------------------
app.use((err: any, req: any, res: any, next: any) => {
    if (err.code === "EBADCSRFTOKEN") {
        return res.status(403).json({ message: "Invalid CSRF token" });
    }
    next(err);
});

// -------------------- GLOBAL ERROR HANDLER --------------------
app.use(globalErrorHandler);

export default app;
