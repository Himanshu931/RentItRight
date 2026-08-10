import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

/**
 * Middleware to restrict access to admin-only routes.
 * Must be used AFTER VerifyUser middleware so req.userRole is populated.
 */
export const AdminGuard = (req: Request, res: Response, next: NextFunction) => {
    if (req.userRole !== "admin") {
        throw new AppError("Forbidden. Admin access required", 403);
    }
    next();
};
