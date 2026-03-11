import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import * as Sentry from "@sentry/node"

export interface DecodedToken {
    userId: string,
    userRole: string,
}

export const VerifyUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if (!token) {
        throw new AppError("Unauthorized. Please login", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    req.userId = decoded.userId;
    req.userRole = decoded.userRole;

    Sentry.setUser({
        id: decoded.userId
    })

    next();
});