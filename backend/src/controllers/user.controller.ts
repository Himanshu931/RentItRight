import { Request, Response } from "express";
import logger from "../config/logger";
import { updateProfileSchema, updateAddressSchema, profileSchema } from "../validatior/user.schema";
import { updateProfileService, userProfileService, getUserProfileService, updateProfileImageService, deleteProfileService, updateAddressService, dashboardDataService } from "../service/user.service";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";

export const createProfile = catchAsync(async (req: Request, res: Response) => {
    logger.info("Creating profile for user");
    const validate = profileSchema.safeParse(req.body);
    if (!validate.success) {
        throw new AppError(`Invalid Data ${validate.error.flatten()}`, 400)
    }

    await userProfileService(req.userId!, validate.data);

    logger.info("Profile created successfully");
    res.status(201).json({ success: true, message: "Profile created successfully" });
})

export const getProfile = catchAsync(async (req: Request, res: Response) => {
    logger.info("Getting profile details for user");

    const user = await getUserProfileService(req.userId!)

    logger.info("Profile fetched successfully");
    res.status(200).json({ success: true, user });
})

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
    logger.info("Updating user profile", req.userId);
    const validate = updateProfileSchema.safeParse(req.body);
    if (!validate.success) {
        throw new AppError(`Invalid Data ${validate.error.flatten()}`, 400)
    }

    await updateProfileService(req.userId!, validate.data);

    logger.info("Profile updated successfully");
    res.status(200).json({ success: true, message: "Profile updated successfully" });
})

export const updateProfileImage = catchAsync(async (req: Request, res: Response) => {

    logger.info("Updating user profile image", req.userId);
    const { profileImage } = req.body;
    if (!profileImage) {
        logger.info("Error in updating profile image", "Profile image is required")
        throw new AppError("Profile Image is required", 400)
    }

    await updateProfileImageService(req.userId!, profileImage);

    logger.info("Profile image updated successfully");
    res.status(200).json({ success: true, message: "Profile image updated successfully" });
})

export const updateAddress = catchAsync(async (req: Request, res: Response) => {
    logger.info("Updatig address for ", req.userId);
    const validate = updateAddressSchema.safeParse(req.body);
    if (!validate.success) {
        throw new AppError(`Invalid Data ${validate.error.flatten()}`, 400)
    }

    await updateAddressService(req.userId!, validate.data);

    logger.info("Address updated successfully");
    res.status(200).json({ success: true, message: "Address updated successfully" });
})

export const deleteProfile = catchAsync(async (req: Request, res: Response) => {

    logger.info("Deleting user profile", req.userId);

    await deleteProfileService(req.userId!);

    logger.info("Profile deleted successfully");
    res.status(200).json({ success: true, message: "Profile deleted successfully" });
})

export const dashboard = catchAsync(async (req: Request, res: Response) => {
    logger.info("Fetching dashboard data for user", req.userId);

    const data = await dashboardDataService(req.userId!);

    logger.info("Dashboard data fetched successfully");
    res.status(200).json({ success: true, data });
})