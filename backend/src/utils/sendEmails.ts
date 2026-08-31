import nodemailer from "nodemailer";
import { AppError } from "./AppError";
import { logger } from "@sentry/node";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
})

export const sendOTP = async (email: string, otp: string) => {
    try {
        await transporter.sendMail({
            from: `"RentItRight" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `${otp} is your RentItRight verification code`,
            html: `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
    <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #2D3436; margin: 0; font-size: 24px;">RentItRight</h1>
    </div>
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; text-align: center;">
        <p style="color: #636e72; font-size: 16px; margin-bottom: 10px;">Verification Code</p>
        <h2 style="color: #0984e3; font-size: 36px; font-weight: bold; margin: 10px 0; letter-spacing: 5px;">${otp}</h2>
        <p style="color: #b2bec3; font-size: 12px;">This code expires in <strong>10 minutes</strong>.</p>
    </div>
    <p style="color: #636e72; font-size: 14px; margin-top: 20px; line-height: 1.5;">
        If you didn't request this, please ignore this email or contact support if you have concerns.
    </p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="color: #b2bec3; font-size: 11px; text-align: center;">
        © ${new Date().getFullYear()} RentItRight. All rights reserved.
    </p>
</div>
`,
        });
    } catch (error) {
        logger.error("Unable to send OTP", { email, error });
        throw new AppError("Unable to send OTP", 500)
    }
}

export const cancellationEmail = async (email: string, itemName: string) => {
    try {
        await transporter.sendMail({
            from: `"RentItRight" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Booking Cancelled Notification`,
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #d63031; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -1px;">RentItRight</h1>
                </div>
                <div style="background-color: #f9f9f9; padding: 25px; border-radius: 8px; text-align: center; border-top: 4px solid #d63031;">
                    <p style="color: #2d3436; font-size: 18px; font-weight: 600; margin: 0 0 10px 0;">Booking Cancelled</p>
                    <p style="color: #636e72; font-size: 14px; margin: 0;">Your booking has been cancelled.</p>
                    <div style="margin: 20px 0; padding: 15px; background: #ffffff; border-radius: 6px; border: 1px dashed #b2bec3;">
                        <p style="margin: 0; font-size: 12px; color: #b2bec3; text-transform: uppercase; font-weight: bold;">Item Requested</p>
                        <p style="margin: 5px 0 0 0; font-size: 16px; color: #2d3436; font-weight: bold;">${itemName}</p>
                    </div>
                </div>
                <p style="color: #636e72; font-size: 14px; margin-top: 20px; line-height: 1.6; text-align: center;">
                    If you have any questions or need assistance, please contact our support team.
                </p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
                <p style="color: #b2bec3; font-size: 11px; text-align: center;">
                    © ${new Date().getFullYear()} RentItRight. All rights reserved.
                </p>
            </div>
            `
        })
    } catch (error) {
        throw new AppError("Unable to send cancellation email", 500)
    }
}

export const acceptedBookingEmail = async (email: string, itemName: string) => {
    try {
        await transporter.sendMail({
            from: `"RentItRight" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Booking Accepted Notification`,
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #00b894; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -1px;">RentItRight</h1>
                </div>
                <div style="background-color: #f9f9f9; padding: 25px; border-radius: 8px; text-align: center; border-top: 4px solid #00b894;">
                    <p style="color: #2d3436; font-size: 18px; font-weight: 600; margin: 0 0 10px 0;">Booking Accepted!</p>
                    <p style="color: #636e72; font-size: 14px; margin: 0;">Good news! Your booking has been accepted by the owner.</p>
                    <div style="margin: 20px 0; padding: 15px; background: #ffffff; border-radius: 6px; border: 1px dashed #b2bec3;">
                        <p style="margin: 0; font-size: 12px; color: #b2bec3; text-transform: uppercase; font-weight: bold;">Item Requested</p>
                        <p style="margin: 5px 0 0 0; font-size: 16px; color: #2d3436; font-weight: bold;">${itemName}</p>
                    </div>
                </div>
                <p style="color: #636e72; font-size: 14px; margin-top: 20px; line-height: 1.6; text-align: center;">
                    Please proceed to your dashboard to complete the payment and confirm your rental.
                </p>
                <div style="text-align: center; margin-top: 25px;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/rentals" style="background-color: #00b894; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">View Booking</a>
                </div>
                <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
                <p style="color: #b2bec3; font-size: 11px; text-align: center;">
                    © ${new Date().getFullYear()} RentItRight. All rights reserved.
                </p>
            </div>
            `
        })
    } catch (error) {
        throw new AppError("Unable to send accepted email", 500)
    }
}

export const bookingRequestedEmail = async (email: string, itemName: string) => {
    try {
        await transporter.sendMail({
            from: `"RentItRight" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `New Booking Request Notification`,
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #0984e3; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -1px;">RentItRight</h1>
                </div>
                <div style="background-color: #f9f9f9; padding: 25px; border-radius: 8px; text-align: center; border-top: 4px solid #0984e3;">
                    <p style="color: #2d3436; font-size: 18px; font-weight: 600; margin: 0 0 10px 0;">New Booking Request!</p>
                    <p style="color: #636e72; font-size: 14px; margin: 0;">You have received a new booking request.</p>
                    <div style="margin: 20px 0; padding: 15px; background: #ffffff; border-radius: 6px; border: 1px dashed #b2bec3;">
                        <p style="margin: 0; font-size: 12px; color: #b2bec3; text-transform: uppercase; font-weight: bold;">Item Requested</p>
                        <p style="margin: 5px 0 0 0; font-size: 16px; color: #2d3436; font-weight: bold;">${itemName}</p>
                    </div>
                </div>
                <p style="color: #636e72; font-size: 14px; margin-top: 20px; line-height: 1.6; text-align: center;">
                    Please log in to your dashboard to review and <strong>accept</strong> or <strong>reject</strong> this request.
                </p>
                <div style="text-align: center; margin-top: 25px;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/owner" style="background-color: #0984e3; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">View Request</a>
                </div>
                <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
                <p style="color: #b2bec3; font-size: 11px; text-align: center;">
                    © ${new Date().getFullYear()} RentItRight. All rights reserved.
                </p>
            </div>
            `
        })
    } catch (error) {
        logger.error("Unable to send requested email", { email, error });
        throw new AppError("Unable to send requested email", 500)
    }
}

export const sendPasswordResetOTP = async (email: string, otp: string) => {
    try {
        await transporter.sendMail({
            from: `"RentItRight" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `${otp} is your RentItRight password reset code`,
            html: `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
    <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #2D3436; margin: 0; font-size: 24px;">RentItRight</h1>
    </div>
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; text-align: center;">
        <p style="color: #636e72; font-size: 16px; margin-bottom: 10px;">Password Reset Code</p>
        <h2 style="color: #0984e3; font-size: 36px; font-weight: bold; margin: 10px 0; letter-spacing: 5px;">${otp}</h2>
        <p style="color: #b2bec3; font-size: 12px;">This code expires in <strong>10 minutes</strong>.</p>
    </div>
    <p style="color: #636e72; font-size: 14px; margin-top: 20px; line-height: 1.5;">
        If you didn't request a password reset, you can safely ignore this email.
    </p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="color: #b2bec3; font-size: 11px; text-align: center;">
        © ${new Date().getFullYear()} RentItRight. All rights reserved.
    </p>
</div>
`,
        });
    } catch (error) {
        logger.error("Unable to send Password Reset OTP", { email, error });
        throw new AppError("Unable to send Password Reset OTP", 500)
    }
}

export const paymentSuccessfulEmailToOwner = async (email: string, itemName: string, amount: number, days: number) => {
    try {
        await transporter.sendMail({
            from: `"RentItRight" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Payment Received - Booking Confirmed!`,
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #00b894; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -1px;">RentItRight</h1>
                </div>
                <div style="background-color: #f9f9f9; padding: 25px; border-radius: 8px; text-align: center; border-top: 4px solid #00b894;">
                    <p style="color: #2d3436; font-size: 18px; font-weight: 600; margin: 0 0 10px 0;">Payment Received!</p>
                    <p style="color: #636e72; font-size: 14px; margin: 0;">The renter has successfully paid for the booking.</p>
                    <div style="margin: 20px 0; padding: 15px; background: #ffffff; border-radius: 6px; border: 1px dashed #b2bec3;">
                        <p style="margin: 0; font-size: 12px; color: #b2bec3; text-transform: uppercase; font-weight: bold;">Item</p>
                        <p style="margin: 5px 0 15px 0; font-size: 16px; color: #2d3436; font-weight: bold;">${itemName}</p>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="color: #636e72; font-size: 14px;">Duration:</span>
                            <span style="color: #2d3436; font-weight: bold; font-size: 14px;">${days} Days</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #636e72; font-size: 14px;">Earnings:</span>
                            <span style="color: #00b894; font-weight: bold; font-size: 16px;">₹${amount}</span>
                        </div>
                    </div>
                </div>
                <p style="color: #636e72; font-size: 14px; margin-top: 20px; line-height: 1.6; text-align: center;">
                    Your earnings have been credited to your wallet.
                </p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
                <p style="color: #b2bec3; font-size: 11px; text-align: center;">
                    © ${new Date().getFullYear()} RentItRight. All rights reserved.
                </p>
            </div>
            `
        })
    } catch (error) {
        throw new AppError("Unable to send payment success email", 500)
    }
}

export const bookingConfirmedEmailToRenter = async (email: string, itemName: string, amount: number, days: number) => {
    try {
        await transporter.sendMail({
            from: `"RentItRight" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Booking Confirmed!`,
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #0984e3; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -1px;">RentItRight</h1>
                </div>
                <div style="background-color: #f9f9f9; padding: 25px; border-radius: 8px; text-align: center; border-top: 4px solid #0984e3;">
                    <p style="color: #2d3436; font-size: 18px; font-weight: 600; margin: 0 0 10px 0;">Booking Confirmed!</p>
                    <p style="color: #636e72; font-size: 14px; margin: 0;">Your payment was successful and the rental is confirmed.</p>
                    <div style="margin: 20px 0; padding: 15px; background: #ffffff; border-radius: 6px; border: 1px dashed #b2bec3;">
                        <p style="margin: 0; font-size: 12px; color: #b2bec3; text-transform: uppercase; font-weight: bold;">Item</p>
                        <p style="margin: 5px 0 15px 0; font-size: 16px; color: #2d3436; font-weight: bold;">${itemName}</p>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="color: #636e72; font-size: 14px;">Duration:</span>
                            <span style="color: #2d3436; font-weight: bold; font-size: 14px;">${days} Days</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #636e72; font-size: 14px;">Amount Paid:</span>
                            <span style="color: #0984e3; font-weight: bold; font-size: 16px;">₹${amount}</span>
                        </div>
                    </div>
                </div>
                <p style="color: #636e72; font-size: 14px; margin-top: 20px; line-height: 1.6; text-align: center;">
                    Thank you for choosing RentItRight!
                </p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
                <p style="color: #b2bec3; font-size: 11px; text-align: center;">
                    © ${new Date().getFullYear()} RentItRight. All rights reserved.
                </p>
            </div>
            `
        })
    } catch (error) {
        throw new AppError("Unable to send booking confirmed email", 500)
    }
}
