import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import logger from "../config/logger";
import { createBookingService, getBookingService, getBookingIdService, acceptBookingService, cancelBookingService, rejectBookingService } from "../service/booking.service";
import { createBookingSchema } from "../validatior/booking.validator";
import { AppError } from "../utils/AppError";

export const getBookings = catchAsync(async (req: Request, res: Response) => {
    logger.info("Fetching booking list for user", req.userId);

    const bookings: any[] = await getBookingService(req.userId!, req.userRole!);

    logger.info("Bookings fetched successfully");
    res.status(200).json({
        success: true,
        message: "Bookings fetched successfully",
        bookings,
    })
})

export const createBooking = catchAsync(async (req: Request, res: Response) => {
    logger.info("Creating booking for user", req.userId);

    const validate = createBookingSchema.safeParse(req.body);
    if (!validate.success) {
        throw new AppError(`Invalid Data ${validate.error.flatten()}`, 400)
    }

    await createBookingService(req.userId!, validate.data);

    logger.info("Booking created successfully");
    res.status(201).json({
        success: true,
        message: "Booking created successfully",
    })
})

//handle race condition for booking the same items by multiple user

export const getBookingById = catchAsync(async (req: Request, res: Response) => {
    logger.info("Fetching booking by id for user", req.userId);

    const booking = await getBookingIdService(req.userId!, req.params.id as string);

    logger.info("Booking fetched successfully");
    res.status(200).json({
        success: true,
        message: "Booking fetched successfully",
        booking,
    })
})

export const acceptBooking = catchAsync(async (req: Request, res: Response) => {
    logger.info(`Booking ${req.params.id} is accepted by owner: ${req.userId}`);

    await acceptBookingService(req.userId!, req.params.id as string);

    logger.info("Booking accepted successfully");
    res.status(200).json({
        success: true,
        message: "Booking accepted successfully",
    })
})

export const cancelBooking = catchAsync(async (req: Request, res: Response) => {
    logger.info(`Booking ${req.params.id} is cancelled by user: ${req.userId}`);

    if (req.userRole !== "renter") {
        throw new AppError("Forbidden: Only renter can cancel the booking", 403)
    }

    const { cancelMessage } = req.body;

    if (!cancelMessage) {
        throw new AppError("Cancel message is required", 400)
    }

    if (cancelMessage.length < 10 || cancelMessage.length > 500) {
        throw new AppError("Cancel message must be between 10 and 500 characters long", 400)
    }

    await cancelBookingService(req.userId!, req.params.id as string, req.userRole! as "renter" | "owner", cancelMessage);

    logger.info("Booking cancelled successfully");
    res.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
    })
})

export const rejectBooking = catchAsync(async (req: Request, res: Response) => {
    logger.info(`Booking ${req.params.id} is rejected by owner: ${req.userId}`);

    if (req.userRole !== "owner") {
        throw new AppError("Forbidden: Only owner can reject the booking", 403)
    }

    const { rejectMessage } = req.body;

    if (!rejectMessage) {
        throw new AppError("Reject message is required", 400)
    }

    if (rejectMessage.length < 10 || rejectMessage.length > 500) {
        throw new AppError("Reject message must be between 10 and 500 characters long", 400)
    }

    await rejectBookingService(req.userId!, req.params.id as string, req.userRole! as "owner", rejectMessage);

    logger.info("Booking rejected successfully");
    res.status(200).json({
        success: true,
        message: "Booking rejected successfully",
    })
})