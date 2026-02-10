import bcrypt from "bcrypt";
import User from "../models/user.model";
import logger from "../config/logger";
import jwt from "jsonwebtoken";
import { OTP } from "../models/OTP.mnodel";
import { sendOTP } from "../utils/sendOTP";


export const registerService = async (userData: { name: string, email: string, password: string, role: string }) => {

    const isExist = await User.findOne({ email: userData.email });
    if (isExist) {
        logger.info(`User already exists`);
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role
    })

    logger.info(`User registered successfully with email ${userData.email}`);
}

export const sendOTPService = async (email: string) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const isCreated = await OTP.create({
        email,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    })

    if (!isCreated) {
        logger.info("Unable to create otp")
    }

    await sendOTP(email, otp);
    logger.info(`OTP sent to ${email}`);
}

export const verifyOTPService = async (otpData: { email: string, otp: string }) => {
    const isExist = await OTP.findOne({ email: otpData.email }).sort({ createdAt: -1 });
    console.log("backend otp", isExist)
    if (!isExist) {
        logger.info("OTP not found");
        throw new Error("OTP not found");
    }

    if (isExist.otp !== otpData.otp) {
        logger.info("Invalid OTP");
        throw new Error("Invalid OTP");
    }

    if (isExist.expiresAt < new Date()) {
        logger.info("OTP expired");
        throw new Error("OTP expired");
    }

    await OTP.deleteOne({ email: otpData.email });

    await User.updateOne({ email: otpData.email }, { isVerified: true });

    const token = await jwt.sign({ userId: otpData.email }, process.env.JWT_SECRET!, { expiresIn: "24h" });

    logger.info(`OTP verified for ${otpData.email}`);
    return token;
}

export const loginService = async (userData: { email: string, password: string }) => {
    logger.info(`User login attempt with email ${userData.email}`);

    const user = await User.findOne({ email: userData.email });
    if (!user) {
        logger.info("User not found");
        throw new Error("User Doesn't exists")
    }

    if (user && !user.isVerified) {
        logger.info("User not verified");
        throw new Error("User not verified");
    }

    const isPasswordValid = await bcrypt.compare(userData.password, user.password);
    if (!isPasswordValid) {
        logger.info("Invalid password");
        throw new Error("Invalid password");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: "24h" });

    logger.info(`User logged in successfully with email ${userData.email}`);
    return token;
}
