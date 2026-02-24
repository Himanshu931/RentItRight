import { Request, Response } from "express";
import logger from "../config/logger";
import { updateProfileSchema, updateAddressSchema, profileSchema } from "../validatior/user.schema";
import { updateProfileService, userProfileService, getUserProfileService, updateProfileImageService, deleteProfileService, updateAddressService } from "../service/user.service";

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

export const updateProfile = async (req: Request, res: Response) => {
    try {
        logger.info("Updating user profile", req.userId);
        const validate = updateProfileSchema.safeParse(req.body);
        if (!validate.success) {
            logger.info("Error in updating profile", validate.error.flatten())
            return res.status(400).json({
                success: false,
                errors: validate.error.flatten(),
            });
        }

        await updateProfileService(req.userId!, validate.data);

        logger.info("Profile updated successfully");
        res.status(200).json({ success: true, message: "Profile updated successfully" });
    } catch (error: any) {
        logger.info("Error in updating profile", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const updateProfileImage = async (req: Request, res: Response) => {
    try {
        logger.info("Updating user profile image", req.userId);
        const { profileImage } = req.body;
        if (!profileImage) {
            logger.info("Error in updating profile image", "Profile image is required")
            return res.status(400).json({
                success: false,
                errors: "Profile image is required",
            });
        }

        await updateProfileImageService(req.userId!, profileImage);

        logger.info("Profile image updated successfully");
        res.status(200).json({ success: true, message: "Profile image updated successfully" });
    } catch (error: any) {
        logger.info("Error in updating profile image", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const updateAddress = async (req: Request, res: Response) => {
    try {
        logger.info("Updatig address for ", req.userId);
        const validate = updateAddressSchema.safeParse(req.body);
        if (!validate.success) {
            logger.info("Error in updating profile", validate.error.flatten())
            return res.status(400).json({
                success: false,
                errors: validate.error.flatten(),
            });
        }

        await updateAddressService(req.userId!, validate.data);

        logger.info("Address updated successfully");
        res.status(200).json({ success: true, message: "Address updated successfully" });
    } catch (error: any) {
        logger.info("Error in updating Address", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const deleteProfile = async (req: Request, res: Response) => {
    try {
        logger.info("Deleting user profile", req.userId);

        await deleteProfileService(req.userId!);

        logger.info("Profile deleted successfully");
        res.status(200).json({ success: true, message: "Profile deleted successfully" });
    } catch (error: any) {
        logger.info("Error in Deleting profile", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
