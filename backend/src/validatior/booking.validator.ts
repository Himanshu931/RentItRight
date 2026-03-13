import { z } from "zod";

export const createBookingSchema = z.object({
    itemId: z.string().min(1, "Item ID is required"),
    ownerId: z.string().min(1, "Owner ID is required"),
    startDate: z.string().min(1, "Start date is required").refine((date) => new Date(date) > new Date(), {
        message: "Start date must be greater than current date",
    }),
    address: z.object({
        district: z.string().min(1, "District is required"),
        state: z.string().min(1, "State is required"),
        pincode: z.string().min(1, "Pincode is required"),
    }),
    endDate: z.string().min(1, "End date is required").refine((date) => new Date(date) > new Date(), {
        message: "End date must be greater than start date",
    }),
    pricing: z.object({
        baseRate: z.number().min(1, "Base rate is required"),
        discountApplied: z.number().min(1, "Discount applied is required").optional(),
        securityDeposit: z.number().min(1, "Security deposit is required"),
        tax: z.number().min(1, "Tax is required").optional(),
        platformFee: z.number().min(1, "Platform fee is required"),
        totalAmount: z.number().min(1, "Total amount is required"),
    })
})

export const enum BookingStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled",
    COMPLETED = "completed",
    REJECTED = "rejected",
    ONGOING = "ongoing",
}