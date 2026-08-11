import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import logger from "../config/logger";
import { updateProfileSchema, updateAddressSchema, profileSchema, changePasswordSchema } from "../validatior/user.schema";
import { updateProfileService, userProfileService, getUserProfileService, updateProfileImageService, deleteProfileService, updateAddressService, dashboardDataService, getWishlistService, toggleWishlistService, changePasswordService } from "../service/user.service";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";

export const createProfile = catchAsync(async (req: Request, res: Response) => {
    const validate = profileSchema.safeParse(req.body);
    if (!validate.success) {
        throw new AppError(`Invalid Data ${validate.error.flatten()}`, 400)
    }

    const { user } = await userProfileService(req.userId!, validate.data);

    // Generate a new JWT token with the updated role
    const token = jwt.sign(
        { userId: user._id, userRole: user.roles },
        process.env.JWT_SECRET!,
        { expiresIn: "24h" }
    );

    // Update the cookie with the new token
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ success: true, message: "Profile created successfully" });
})

export const getProfile = catchAsync(async (req: Request, res: Response) => {
    const user = await getUserProfileService(req.userId!)
    res.status(200).json({ success: true, user });
})

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
    const validate = updateProfileSchema.safeParse(req.body);
    if (!validate.success) {
        throw new AppError(`Invalid Data ${validate.error.flatten()}`, 400)
    }

    await updateProfileService(req.userId!, validate.data);
    res.status(200).json({ success: true, message: "Profile updated successfully" });
})

export const updateProfileImage = catchAsync(async (req: Request, res: Response) => {
    const { profileImage } = req.body;
    if (!profileImage) {
        throw new AppError("Profile Image is required", 400)
    }

    await updateProfileImageService(req.userId!, profileImage);
    res.status(200).json({ success: true, message: "Profile image updated successfully" });
})

export const updateAddress = catchAsync(async (req: Request, res: Response) => {
    const validate = updateAddressSchema.safeParse(req.body);
    if (!validate.success) {
        throw new AppError(`Invalid Data ${validate.error.flatten()}`, 400)
    }

    await updateAddressService(req.userId!, validate.data);
    res.status(200).json({ success: true, message: "Address updated successfully" });
})

export const deleteProfile = catchAsync(async (req: Request, res: Response) => {
    await deleteProfileService(req.userId!);
    res.status(200).json({ success: true, message: "Profile deleted successfully" });
})

export const dashboard = catchAsync(async (req: Request, res: Response) => {
    const data = await dashboardDataService(req.userId!);
    res.status(200).json({ success: true, data: data, message: "Dashboard data fetched successfully" });
})

export const getWishlist = catchAsync(async (req: Request, res: Response) => {
    const wishlist = await getWishlistService(req.userId!);
    res.status(200).json({ success: true, data: wishlist, message: "Wishlist fetched successfully" });
})

export const toggleWishlist = catchAsync(async (req: Request, res: Response) => {
    const { itemId } = req.body;
    if (!itemId) {
        throw new AppError("Item ID is required", 400);
    }

    const result = await toggleWishlistService(req.userId!, itemId);
    res.status(200).json({ success: true, data: result, message: result.message });
})

export const changePassword = catchAsync(async (req: Request, res: Response) => {
    const validate = changePasswordSchema.safeParse(req.body);
    if (!validate.success) {
        throw new AppError(`Invalid Data ${validate.error.flatten()}`, 400)
    }

    await changePasswordService(req.userId!, validate.data);
    res.status(200).json({ success: true, message: "Password changed successfully" });
})
