import { Request, Response } from "express";
import logger from "../config/logger";
import { profileSchema } from "../validatior/user.schema";
import { userProfileService, getUserProfileService } from "../service/user.service";

export const createProfile = async (req: Request, res: Response) => {
    try {
        logger.info("Creating profile for user");
        const validate = profileSchema.safeParse(req.body);
        if (!validate.success) {
            logger.info("Error in Creating Profile", validate.error.flatten())
            return res.status(400).json({
                success: false,
                errors: validate.error.flatten(),
            });
        }

        await userProfileService(req.userId!, validate.data);

        logger.info("Profile created successfully");
        res.status(201).json({ success: true, message: "Profile created successfully" });
    } catch (error: any) {
        logger.info("Error in profile controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const getProfile = async (req: Request, res: Response) => {
    try {
        logger.info("Getting profile details for user");

        const user = await getUserProfileService(req.userId!)

        logger.info("Profile fetched successfully");
        res.status(200).json({ success: true, user });
    } catch (error: any) {
        logger.info("Error in profile controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}