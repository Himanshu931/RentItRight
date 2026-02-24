import { AppError } from "../utils/AppError";
import logger from "../config/logger";
import { Request, Response, NextFunction } from "express";

// Handle Mongo Duplicate Key Error
const handleDuplicateKeyError = (err: any) => {
    const field = Object.keys(err.keyValue)[0];
    return new AppError(`${field} already exists`, 400);
};

// Handle Mongoose Validation Error
const handleValidationError = (err: any) => {
    const errors = Object.values(err.errors).map((el: any) => el.message);
    return new AppError(errors.join(". "), 400);
};

// Handle Invalid ObjectId Error
const handleCastError = (err: any) => {
    return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
};

// Handle JWT Errors
const handleJWTError = () => new AppError("Invalid token. Please login again", 401);

const handleJWTExpired = () =>
    new AppError("Token expired. Please login again", 401);

const handleCastErrorDB = (err: any) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
}

export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // DEVELOPMENT MODE
    if (process.env.NODE_ENV === "development") {
        console.error("💥 ERROR:", err);
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            stack: err.stack,
            error: err,
        });
    }

    // PRODUCTION MODE
    let error = { ...err };
    error.message = err.message;

    // Known/operational errors (thrown by AppError) – send directly
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    // MongoDB Duplicate Key
    if (err.code === 11000) error = handleDuplicateKeyError(err);

    // Mongoose Validation Error
    if (err.name === "ValidationError") error = handleValidationError(err);

    // Mongoose Cast Error (Invalid ObjectId)
    if (err.name === "CastError") error = handleCastError(err);

    // JWT Errors
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpired();

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Something went wrong",
    });
};