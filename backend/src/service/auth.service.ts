import bcrypt from "bcrypt";
import { User } from "../models/user.model"
import logger from "../config/logger";
import { userInterface } from "../controllers/auth.controller";
import jwt from "jsonwebtoken";
import { OTP } from "../models/OTP.model";
import { sendOTP } from "../utils/sendOTP";
import { AppError } from "../utils/AppError";

export const registerService = async (userData: {
  email: string;
  password: string;
}) => {
  logger.info("Registering user");
  const isExist = await User.findOne({ email: userData.email });
  if (isExist) {
    logger.info(`User already exists`);
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  await User.create({
    email: userData.email,
    password: hashedPassword,
  });

  logger.info(`User registered successfully with email ${userData.email}`);
};

export const sendOTPService = async (email: string) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const hashedOtp = await bcrypt.hash(otp, 10);

  await OTP.create({
    email,
    otp: hashedOtp,
    expiresAt,
  });

  await sendOTP(email, otp)
};


export const verifyOTPService = async (otpData: {
  email: string;
  otp: string;
}) => {
  const isExist = await OTP.findOne({ email: otpData.email }).sort({
    createdAt: -1,
  });

  if (!isExist) {
    logger.info("OTP not found");
    throw new AppError("OTP not found", 400);
  }

  const isOtpValid = await bcrypt.compare(otpData.otp, isExist.otp);
  if (!isOtpValid) {
    logger.info("Invalid OTP");
    throw new AppError("Invalid OTP", 400);
  }

  if (isExist.expiresAt < new Date()) {
    logger.info("OTP expired");
    throw new AppError("OTP expired", 410);
  }

  await OTP.deleteOne({ email: otpData.email });

  await User.updateOne({ email: otpData.email }, { isVerified: true });

  const user = await User.findOne({ email: otpData.email });
  if (!user) {
    logger.info("User not found after OTP verification");
    throw new AppError("User not found", 400);
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET!,
    { expiresIn: "24h" },
  );

  logger.info(`OTP verified for ${otpData.email}`);
  return token;
};

export const loginService = async (userData: {
  email: string;
  password: string;
}) => {
  logger.info(`User login attempt with email ${userData.email}`);

  const user = await User.findOne({ email: userData.email });
  if (!user) {
    logger.info("User not found");
    throw new AppError("User Not Found", 400);
  }

  if (user && !user.isVerified) {
    logger.info("User not verified");
    throw new AppError("User Not Verified", 403);
  }

  const isPasswordValid = await bcrypt.compare(
    userData.password,
    user.password,
  );
  if (!isPasswordValid) {
    logger.info("Invalid password");
    throw new AppError("Invalid Password", 400);
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "24h",
  });

  logger.info(`User logged in successfully with email ${userData.email}`);
  return token;
};

export const MeService = async (id: string | undefined) => {
  if (id === undefined) {
    logger.info("Id should be defined in Me controler");
    throw new AppError("Id is not defined", 400);
  }
  const user = await User.findById(id);
  if (!user) {
    logger.info("User not found");
    throw new AppError("User Not Found", 400);
  }

  const userResponse: userInterface = {
    id: user._id.toString(),
    email: user.email,
    name: user.name!,
    role: user.roles!,
  };

  return userResponse;
};
