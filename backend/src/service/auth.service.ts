import bcrypt from "bcrypt";
import { User } from "../models/user.model"
import logger from "../config/logger";
import { userInterface } from "../controllers/auth.controller";
import jwt from "jsonwebtoken";
import { OTP } from "../models/OTP.model";
import { sendOTP, sendPasswordResetOTP } from "../utils/sendEmails";
import { AppError } from "../utils/AppError";

export const registerService = async (userData: {
  email: string;
  password: string;
}) => {
  logger.info("User registration started", { email: userData.email });

  const isExist = await User.findOne({ email: userData.email });

  if (isExist) {
    logger.warn("User already exists", { email: userData.email });
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  await User.create({
    email: userData.email,
    name : userData.email.split("@")[0],
    password: hashedPassword,
  });

  logger.info("User registered successfully", { email: userData.email });
}

export const sendOTPService = async (email: string) => {
  logger.info("OTP generation requested", { email });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const hashedOtp = await bcrypt.hash(otp, 10);

  await OTP.create({
    email,
    otp: hashedOtp,
    expiresAt,
  });

  await sendOTP(email, otp);

  logger.info("OTP sent successfully", { email });
};


export const verifyOTPService = async (otpData: {
  email: string;
  otp: string;
}) => {

  logger.info("OTP verification attempt", { email: otpData.email });
  const isExist = await OTP.findOne({ email: otpData.email }).sort({
    createdAt: -1,
  });

  if (!isExist) {
    logger.warn("OTP not found", { email: otpData.email });
    throw new AppError("OTP not found", 400);
  }

  const isOtpValid = await bcrypt.compare(otpData.otp, isExist.otp);
  if (!isOtpValid) {
    logger.warn("Invalid OTP", { email: otpData.email });
    throw new AppError("Invalid OTP", 400);
  }

  if (isExist.expiresAt < new Date()) {
    logger.warn("OTP expired", { email: otpData.email });
    throw new AppError("OTP expired", 410);
  }

  await OTP.deleteOne({ email: otpData.email });

  await User.updateOne({ email: otpData.email }, { isVerified: true });

  const user = await User.findOne({ email: otpData.email });
  if (!user) {
    logger.warn("User not found after OTP verification", { email: otpData.email });
    throw new AppError("User not found", 400);
  }

  const token = jwt.sign(
    { userId: user._id, userRole: user.roles },
    process.env.JWT_SECRET!,
    { expiresIn: "24h" },
  );

  logger.info(`OTP verified successfully`, { email: otpData.email });

  return token;
};

export const loginService = async (userData: {
  email: string;
  password: string;
}) => {
  logger.info("User login attempt", { email: userData.email });

  const user = await User.findOne({ email: userData.email });
  if (!user) {
    logger.warn("User not found", { email: userData.email });
    throw new AppError("User Not Found", 400);
  }

  if (user && user.isSuspended) {
    logger.warn("User account suspended", { email: userData.email });
    throw new AppError("Account is Suspended", 403);
  }

  if (user && !user.isVerified) {
    logger.warn("User not verified", { email: userData.email });
    throw new AppError("User Not Verified", 403);
  }

  const isPasswordValid = await bcrypt.compare(
    userData.password,
    user.password,
  );
  if (!isPasswordValid) {
    logger.warn("Invalid password", { email: userData.email });
    throw new AppError("Invalid Password", 400);
  }

  const token = jwt.sign({ userId: user._id, userRole: user.roles }, process.env.JWT_SECRET!, {
    expiresIn: "24h",
  });

  logger.info("User login success", { email: userData.email, userId: user._id });
  return token;
};

export const MeService = async (id: string | undefined) => {

  logger.info("Fetching current user profile", { userId: id });

  if (id === undefined) {
    throw new AppError("Id is not defined", 400);
  }
  const user = await User.findById(id);
  if (!user) {
    logger.warn("User not found", { userId: id });
    throw new AppError("User Not Found", 400);
  }

  const userResponse: userInterface = {
    id: user._id.toString(),
    email: user.email,
    name: user.name!,
    role: user.roles!,
    phone: user.phone!,
    profileImage: user.profileImage!,
  };

  logger.info("User profile fetched successfully", { userId: id });

  return userResponse;
};

export const forgotPasswordSendOTPService = async (email: string) => {
  logger.info("Forgot password OTP requested", { email });

  const user = await User.findOne({ email });
  if (!user) {
    logger.warn("User not found for forgot password", { email });
    throw new AppError("User not found", 404);
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const hashedOtp = await bcrypt.hash(otp, 10);

  await OTP.create({
    email,
    otp: hashedOtp,
    expiresAt,
  });

  await sendPasswordResetOTP(email, otp);

  logger.info("Forgot password OTP sent successfully", { email });
};

export const forgotPasswordVerifyOTPService = async (otpData: {
  email: string;
  otp: string;
}) => {
  logger.info("Forgot password OTP verification attempt", { email: otpData.email });
  
  const isExist = await OTP.findOne({ email: otpData.email }).sort({
    createdAt: -1,
  });

  if (!isExist) {
    logger.warn("OTP not found", { email: otpData.email });
    throw new AppError("OTP not found", 400);
  }

  const isOtpValid = await bcrypt.compare(otpData.otp, isExist.otp);
  if (!isOtpValid) {
    logger.warn("Invalid OTP", { email: otpData.email });
    throw new AppError("Invalid OTP", 400);
  }

  if (isExist.expiresAt < new Date()) {
    logger.warn("OTP expired", { email: otpData.email });
    throw new AppError("OTP expired", 410);
  }

  await OTP.deleteOne({ email: otpData.email });

  const user = await User.findOne({ email: otpData.email });
  if (!user) {
    logger.warn("User not found after OTP verification", { email: otpData.email });
    throw new AppError("User not found", 400);
  }

  // Create a short-lived reset token (10 mins)
  const resetToken = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "10m" }
  );

  logger.info("Forgot password OTP verified successfully", { email: otpData.email });

  return resetToken;
};

export const resetPasswordService = async (resetToken: string, newPassword: string) => {
  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET!) as { userId: string, email: string };
    
    logger.info("Password reset attempt", { email: decoded.email });

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    logger.info("Password reset successfully", { email: decoded.email });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError("Reset token expired", 401);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError("Invalid reset token", 401);
    }
    throw error;
  }
};
