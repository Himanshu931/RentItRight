import { Request, Response } from "express";
import { loginService, registerService } from "../service/auth.service";
import { loginSchema, registerSchema } from "../validatior/auth.schema";
import { OTPValidator } from "../validatior/OTP.validator";
import { sendOTPService, verifyOTPService } from "../service/auth.service";
import logger from "../config/logger";

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;
        const validate = registerSchema.safeParse({ name, email, password, role });
        if (!validate.success) {
            return res.status(400).json({ success: false, message: "Invalid data", error: validate.error });
        }

        await registerService(validate.data);

        res.status(201).json({ success: true });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error });
    }
}

export const sendOTP = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        // const validate = registerSchema.safeParse({ email });
        // if (!validate.success) {
        //     return res.status(400).json({ success: false, message: "Invalid data", error: validate.error });
        // }

        await sendOTPService(email);

        res.status(200).json({ success: true, message: "OTP has been sent to your email" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error });
    }
}

export const verifyOTP = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        const validate = OTPValidator.safeParse({ email, otp });
        if (!validate.success) {
            return res.status(400).json({ success: false, message: "Invalid data", error: validate.error });
        }

        const token = await verifyOTPService(validate.data);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        })

        res.status(200).json({ success: true, message: "OTP verified successfully" });

    } catch (error: any) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const validate = loginSchema.safeParse({ email, password });
        if (!validate.success) {
            return res.status(400).json({ success: false, message: "Invalid data", error: validate.error });
        }

        const token = await loginService(validate.data);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        })

        res.status(200).json({ success: true, message: "User logged in successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error });
    }
}

export const logout = (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
    });

    logger.info("User logged out");

    res.status(200).json({ success: true, message: "Logged out" });
}
