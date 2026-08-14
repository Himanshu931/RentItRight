import { Worker } from "bullmq";
import { createRedisConnection } from "../config/redis";
import { cancellationEmail, acceptedBookingEmail, bookingRequestedEmail, paymentSuccessfulEmailToOwner, bookingConfirmedEmailToRenter } from "../utils/sendEmails";
import { User } from "../models/user.model";
import { Booking } from "../models/booking.model";
import logger from "../config/logger";

export const emailWorker = new Worker(
    "emailQueue",
    async (job) => {
        const { renter_id, owner_id, bookingId, amount, days } = job.data;
        
        // Fetch booking to get the item title
        const booking = await Booking.findById(bookingId).populate("item_id", "title");
        const itemName = booking && (booking.item_id as any)?.title ? (booking.item_id as any).title : "Your requested item";

        if (job.name === "sendBookingRequestedEmail") {
            const user = await User.findById(owner_id);
            if (!user) throw new Error(`User not found for owner_id: ${owner_id}`);
            logger.info(`Sending request email to ${user.email} for booking ${bookingId}`);
            await bookingRequestedEmail(user.email, itemName);
        } else if (job.name === "sendPaymentSuccessfulEmail") {
            const user = await User.findById(owner_id);
            if (!user) throw new Error(`User not found for owner_id: ${owner_id}`);
            logger.info(`Sending payment success email to ${user.email} for booking ${bookingId}`);
            await paymentSuccessfulEmailToOwner(user.email, itemName, amount, days);
        } else {
            const user = await User.findById(renter_id);
            if (!user) throw new Error(`User not found for renter_id: ${renter_id}`);

            if (job.name === "sendBookingRejectedEmail") {
                logger.info(`Sending rejection email to ${user.email} for booking ${bookingId}`);
                await cancellationEmail(user.email, itemName);
            } else if (job.name === "sendBookingAcceptedEmail") {
                logger.info(`Sending acceptance email to ${user.email} for booking ${bookingId}`);
                await acceptedBookingEmail(user.email, itemName);
            } else if (job.name === "sendBookingConfirmedEmail") {
                logger.info(`Sending booking confirmed email to ${user.email} for booking ${bookingId}`);
                await bookingConfirmedEmailToRenter(user.email, itemName, amount, days);
            } else {
                logger.warn(`Unknown email job type: ${job.name}`);
            }
        }
    },
    {
        connection: createRedisConnection() as any,
    }
);

emailWorker.on("completed", (job) => {
    logger.info(`Email job [${job.name}] completed successfully`);
});

emailWorker.on("failed", (job, err) => {
    logger.error(`Email job [${job?.name}] failed: ${err.message}`);
});