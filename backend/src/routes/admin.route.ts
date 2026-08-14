import { Router } from "express";
import { VerifyUser } from "../middleware/verifyUser";
import { AdminGuard } from "../middleware/adminGuard";
import {
    getDashboard,
    getUsers,
    getUserDetail,
    suspendUser,
    unsuspendUser,
    getListings,
    toggleListingActive,
    getBookings,
} from "../controllers/admin.controller";

const router = Router();

// All routes require authentication + admin role
router.use(VerifyUser, AdminGuard);


/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get admin dashboard aggregate data
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data with stats, user overview, health metrics, financials, and alerts
 */
router.get("/dashboard", getDashboard);


/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List all users with pagination and filters
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [owner, renter]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, suspended, inactive]
 *     responses:
 *       200:
 *         description: Paginated list of users
 */
router.get("/users", getUsers);


/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Get detailed user profile with stats and activity
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile, stats, and recent activity
 *       404:
 *         description: User not found
 */
router.get("/users/:id", getUserDetail);


/**
 * @swagger
 * /admin/users/{id}/suspend:
 *   patch:
 *     summary: Suspend a user account
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User suspended successfully
 *       403:
 *         description: Cannot suspend admin users
 */
router.patch("/users/:id/suspend", suspendUser);


/**
 * @swagger
 * /admin/users/{id}/unsuspend:
 *   patch:
 *     summary: Unsuspend a user account
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User unsuspended successfully
 */
router.patch("/users/:id/unsuspend", unsuspendUser);


/**
 * @swagger
 * /admin/listings:
 *   get:
 *     summary: List all items/listings with pagination and filters
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, paused, removed, rented]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title
 *     responses:
 *       200:
 *         description: Paginated list of listings
 */
router.get("/listings", getListings);


/**
 * @swagger
 * /admin/listings/{id}/toggle-active:
 *   patch:
 *     summary: Toggle a listing's active status (deactivate/reactivate)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Listing status toggled
 *       404:
 *         description: Listing not found
 */
router.patch("/listings/:id/toggle-active", toggleListingActive);


/**
 * @swagger
 * /admin/bookings:
 *   get:
 *     summary: List all bookings with pagination and filters
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, ongoing, completed, cancelled, all]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by item title, user name or email
 *     responses:
 *       200:
 *         description: Paginated list of bookings
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (requires admin role)
 */
router.get("/bookings", getBookings);

export default router;
