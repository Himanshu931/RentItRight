import rateLimit from "express-rate-limit";
import { Request, Response } from "express";

declare module "express-serve-static-core" {
    interface Request {
        rateLimit: {
            limit: number;
            current: number;
            remaining: number;
            resetTime: Date;
        };
    }
}

export const RATE_LIMITER = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: 'Too many requests from this IP address',
        retryAfter: '15 minutes',
        documentation: 'https://api.example.com/docs/rate-limits'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            error: 'Rate limit exceeded',
            message: 'Too many requests from this IP, please try again later',
            retryAfter: Math.round(req.rateLimit.resetTime.getTime() / 1000)
        });
    }
});

export const AUTH_LIMITER = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: {
        error: 'Too many authentication attempts',
        retryAfter: '10 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            success: false,
            error: 'Rate limit exceeded',
            message: 'Too many authentication attempts, please try again later',
            retryAfter: Math.round(req.rateLimit.resetTime.getTime() / 1000)
        });
    }
});

export const OTP_LIMITER = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            success: false,
            error: 'Rate limit exceeded',
            message: 'Too many OTP requests. Please wait 10 minutes before trying again.',
            retryAfter: Math.round(req.rateLimit.resetTime.getTime() / 1000)
        });
    }
});