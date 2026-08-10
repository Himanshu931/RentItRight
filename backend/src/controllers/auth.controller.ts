import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { loginSchema, registerSchema } from "../validatior/auth.schema";
import { OTPValidator } from "../validatior/OTP.validator";
import { loginService, registerService, sendOTPService, verifyOTPService, MeService } from "../service/auth.service";
import logger from "../config/logger";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";

export interface userInterface {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  profileImage: string;
}

export const register = catchAsync(async (req: Request, res: Response) => {
  const validate = registerSchema.safeParse(req.body);
  if (!validate.success) {
    throw new AppError(`Invalid data ${validate.error.flatten().fieldErrors}`, 400);
  }

  await registerService(validate.data);

  res.status(201).json({ success: true });
})

export const sendOTP = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    throw new AppError("Email is required", 400);
  }

  await sendOTPService(email)

  res
    .status(200)
    .json({ success: true, message: "OTP has been sent to your email" });
});

export const verifyOTP = catchAsync(async (req: Request, res: Response) => {
  const validate = OTPValidator.safeParse(req.body);
  if (!validate.success) {
    throw new AppError(`Invalid data ${validate.error.flatten().fieldErrors}`, 400);
  }

  const token = await verifyOTPService(validate.data);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res
    .status(200)
    .json({ success: true, message: "OTP verified successfully" });
})

export const login = catchAsync(async (req: Request, res: Response) => {
  const validate = loginSchema.safeParse(req.body);
  if (!validate.success) {
    throw new AppError(`Invalid data ${validate.error.flatten().fieldErrors}`, 400);
  }
  const token = await loginService(validate.data);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res
    .status(200)
    .json({ success: true, message: "User logged in successfully" });
})

export const me = catchAsync(async (req: Request, res: Response) => {
  const userId = req.userId;

  const user: userInterface = await MeService(userId);

  res
    .status(200)
    .json({
      success: true,
      message: "User fetched successfully",
      user: user,
    });
})

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });
  res.status(200).json({ success: true, message: "Logged out" });
};

export const googleCallback = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  if (!user) {
    throw new AppError("Authentication failed", 401);
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, userRole: user.roles },
    process.env.JWT_SECRET!,
    { expiresIn: "24h" }
  );

  // Set cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  const frontendUrl = process.env.FRONTEND_URL;
  
  // If user doesn't have a phone, they haven't completed their profile
  if (!user.phone) {
    return res.redirect(`${frontendUrl}/?auth=success&mode=completeProfile`);
  }

  // Otherwise, fallback to role based redirection
  res.redirect(`${frontendUrl}/role-redirect`);
});
