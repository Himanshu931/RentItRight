import { Booking } from "../models/booking.model"
import { Item } from "../models/item.model";
import { AppError } from "../utils/AppError";
import { BookingStatus } from "../validatior/booking.validator";
import mongoose from "mongoose";
import { emailQueue } from "../queues/email.queue";
import { bookingStatusQueue } from "../queues/email.queue";

interface PopulatedItem {
    _id: mongoose.Types.ObjectId;
    title: string;
    images: string[];
    category: string;
}

interface PopulatedOwner {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    phone?: string;
}

interface ICreateBooking {
    itemId: string;
    ownerId: string;
    startDate: string;
    endDate: string;
    address: {
        district: string;
        state: string;
        pincode: string;
    };
    pricing: {
        baseRate: number;
        discountApplied?: number;
        securityDeposit: number;
        tax?: number;
        platformFee: number;
        totalAmount: number;
    }
}

export const getBookingService = async (userId: string, userRole: string) => {

    const filter = userRole === "owner" ? { owner_id: userId } : { renter_id: userId };

    const bookings = await Booking.find(filter)
        .select("item_id start_date end_date pricing booking_status payment_status")
        .populate("item_id", "title images")
        .sort({ createdAt: -1 })
        .lean();

    return bookings.map((booking) => {
        const item = booking.item_id as any;

        return {
            id: booking._id.toString(),
            item: item
                ? {
                    id: item._id?.toString(),
                    title: item.title,
                    image: item.images?.[0] || null,
                }
                : null,
            date: {
                startDate: booking.start_date,
                endDate: booking.end_date,
            },
            address: {
                district: booking.address?.district,
                state: booking.address?.state,
                pincode: booking.address?.pincode,
            },
            totalAmount: booking.pricing?.totalAmount ?? 0,
            status: booking.booking_status,
            paymentStatus: booking.payment_status,
        };
    });
};

export const createBookingService = async (
    userId: string,
    booking: ICreateBooking
) => {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new AppError("Invalid booking dates", 400);
    }

    if (endDate <= startDate) {
        throw new AppError("End date must be after start date", 400);
    }

    if (startDate < new Date()) {
        throw new AppError("Booking cannot start in the past", 400);
    }

    const totalDays = Math.ceil(
        (endDate.getTime() - startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    // availability check
    const existingBooking = await Booking.findOne({
        item_id: booking.itemId,
        status: { $ne: "cancelled" },
        start_date: { $lt: endDate },
        end_date: { $gt: startDate },
    });

    if (existingBooking) {
        throw new AppError("Item already booked for selected dates", 409);
    }

    const item = await Item.findById(booking.itemId);
    if (!item) throw new AppError("Item not found", 404);

    await Booking.create({
        renter_id: userId,
        owner_id: item.ownerId,
        item_id: booking.itemId,
        start_date: startDate,
        end_date: endDate,
        address: booking.address,
        pricing: {
            totalAmount: booking.pricing.totalAmount,
            discountApplied: booking.pricing.discountApplied,
            securityDeposit: booking.pricing.securityDeposit,
            tax: booking.pricing.tax,
            platformFee: booking.pricing.platformFee,
        },
        total_days: totalDays,
    });

    return true;
};

export const getBookingIdService = async (
    userId: string,
    bookingId: string
) => {
    const booking = await Booking.findOne({
        _id: bookingId,
        $or: [{ renter_id: userId }, { owner_id: userId }],
    })
        .populate("item_id", "title images category")
        .populate("owner_id", "name email phone")
        .lean() as any as (Omit<InstanceType<typeof Booking>, "item_id" | "owner_id"> & {
            item_id: PopulatedItem | null;
            owner_id: PopulatedOwner | null;
        }) | null;

    if (!booking) {
        throw new AppError("Booking not found", 404);
    }

    const now = new Date();

    const duration = Math.ceil(
        (booking.end_date.getTime() - booking.start_date.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const daysRemaining =
        booking.end_date > now
            ? Math.ceil(
                (booking.end_date.getTime() - now.getTime()) /
                (1000 * 60 * 60 * 24)
            )
            : 0;

    return {
        id: booking._id.toString(),

        item: booking.item_id
            ? {
                id: booking.item_id._id.toString(),
                title: booking.item_id.title,
                image: booking.item_id.images?.[0] || null,
                category: booking.item_id.category,
            }
            : null,

        pricing: {
            baseRate: booking.pricing.baseRate,
            totalAmount: booking.pricing.totalAmount,
            discountApplied: booking.pricing.discountApplied,
            securityDeposit: booking.pricing.securityDeposit,
            tax: booking.pricing.tax,
            duration,
        },

        address: {
            district: booking.address?.district,
            state: booking.address?.state,
            pincode: booking.address?.pincode,
        },

        startDate: booking.start_date,
        endDate: booking.end_date,
        status: booking.booking_status,
        paymentStatus: booking.payment_status,
        daysRemaining,

        ownerInfo: booking.owner_id
            ? {
                id: booking.owner_id._id.toString(),
                name: booking.owner_id.name,
                email: booking.owner_id.email,
                phone: booking.owner_id.phone,
            }
            : null,
    };
};

export const acceptBookingService = async (
    userId: string,
    bookingId: string
) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const booking = await Booking.findOne(
            {
                _id: bookingId,
                owner_id: userId,
                booking_status: BookingStatus.PENDING,
            }
        ).session(session);

        if (!booking) {
            throw new AppError("Booking not found or already processed", 404);
        }

        // Confirm selected booking
        booking.booking_status = BookingStatus.CONFIRMED;
        await booking.save({ session });

        //sending email to queue to those who are accepted
        await emailQueue.add("sendBookingAcceptedEmail", {
            renter_id: booking.renter_id,
            bookingId: booking._id,
        });

        //updating the status from completed to ONGOING to COMPLETED acc to start and End Date
        await bookingStatusQueue.add("update-status", {
            bookingId: booking._id,
        });

        const rejectedBookings = await Booking.find(
            {
                _id: { $ne: booking._id },
                item_id: booking.item_id,
                booking_status: BookingStatus.PENDING,
                start_date: { $lt: booking.end_date },
                end_date: { $gt: booking.start_date },
            }
        ).session(session);

        // Reject all other overlapping pending bookings
        await Booking.updateMany(
            { _id: { $in: rejectedBookings.map(booking => booking._id) } },
            {
                $set: {
                    booking_status: BookingStatus.REJECTED,
                    cancellationReason: "Another booking request was accepted",
                    cancelledBy: "system",
                },
            },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        // sending email to queue for background process 
        for (const renter_id of rejectedBookings.map(booking => booking.renter_id)) {
            await emailQueue.add("sendBookingRejectedEmail", {
                renter_id,
                bookingId,
            });
        }

        return true;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const cancelBookingService = async (
    userId: string,
    bookingId: string,
    userRole: "renter" | "owner",
    cancelMessage: string
) => {

    const booking = await Booking.findOne({ renter_id: userId });

    if (!booking) {
        throw new AppError("Booking not found", 404);
    }

    if (
        booking.booking_status === BookingStatus.CANCELLED ||
        booking.booking_status === BookingStatus.REJECTED ||
        booking.booking_status === BookingStatus.COMPLETED
    ) {
        throw new AppError("Booking already finalized", 400);
    }

    if (
        booking.booking_status === BookingStatus.CONFIRMED &&
        Date.now() > booking.start_date.getTime()
    ) {
        throw new AppError("Booking cannot be cancelled after start date", 400);
    }

    booking.booking_status = BookingStatus.CANCELLED;
    booking.cancelledBy = userRole;
    booking.cancellationReason = cancelMessage;

    await booking.save();

    return {
        id: booking._id.toString(),
        status: booking.booking_status,
    };
};

export const rejectBookingService = async (userId: string, bookingId: string, userRole: "owner", rejectMessage: string) => {

    const booking = await Booking.findOne({ _id: bookingId, owner_id: userId });

    if (!booking) {
        throw new AppError("Booking not found", 404);
    }

    if (booking.booking_status !== BookingStatus.PENDING) {
        throw new AppError("Booking is already processed", 400);
    }

    booking.booking_status = BookingStatus.REJECTED;
    booking.cancellationReason = rejectMessage;
    booking.cancelledBy = userRole;

    await booking.save();

    return
}