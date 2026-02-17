import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface DecodedToken {
    userId: string,
    token: string,
}

declare module "express" {
    interface Request {
        userId?: string;
    }
}

export const VerifyUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized", status: 401 });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        if (token != decodedToken.token) {
            return res.status(401).json({ success: false, message: "Unauthorized", status: 401 });
        }
        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}