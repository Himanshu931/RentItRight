import { Router } from "express";
import { acceptBooking, cancelBooking, createBooking, getBookingById, getBookings, rejectBooking } from "../controllers/booking.controller"
const router = Router();

// for user and owner to get all their bookings
router.get("/", getBookings)

// for user to create a booking
router.post("/", createBooking)

// for user & owner to get details of a specific booking
router.get("/:id", getBookingById)

router.patch("/:id/approve", acceptBooking)

router.patch("/:id/cancel", cancelBooking)

router.patch("/:id/reject", rejectBooking)

// to be implemented
// router.patch("/:id/complete")

export default router;