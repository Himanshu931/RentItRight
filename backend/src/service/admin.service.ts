import { User } from "../models/user.model";
import { Item } from "../models/item.model";
import { Booking } from "../models/booking.model";
import { Payment } from "../models/payment.model";
import { Review } from "../models/review.model";
import { ItemReview } from "../models/itemReview.model";
import { AppError } from "../utils/AppError";
import mongoose from "mongoose";


// ─────────────────────────────────────────────────────────
//  DASHBOARD — Aggregate Stats
// ─────────────────────────────────────────────────────────

interface DashboardStats {
    topStats: {
        totalUsers: number;
        totalListings: number;
        activeRentals: number;
    };
    userOverview: {
        owners: { total: number; active: number; suspended: number };
        renters: { total: number; active: number; suspended: number };
    };
    listingsHealth: Array<[string, string, string]>;
    bookingsHealth: Array<[string, string, string]>;
    financialSnapshot: {
        grossRevenue: number;
        commissionEarned: number;
        payoutsPending: number;
    };
    alerts: Array<{ text: string; count: number }>;
}

export const getDashboardStatsService = async (): Promise<DashboardStats> => {
    // ── Top Stats ──
    const [totalUsers, totalListings, activeRentals] = await Promise.all([
        User.countDocuments({ isVerified: true }),
        Item.countDocuments(),
        Booking.countDocuments({ booking_status: "ongoing" }),
    ]);

    // ── User Overview ──
    const [
        totalOwners,
        activeOwners,
        suspendedOwners,
        totalRenters,
        activeRenters,
        suspendedRenters,
    ] = await Promise.all([
        User.countDocuments({ roles: "owner", isVerified: true }),
        User.countDocuments({ roles: "owner", isVerified: true, isBlocked: false, isActive: true }),
        User.countDocuments({ roles: "owner", isBlocked: true }),
        User.countDocuments({ roles: "renter", isVerified: true }),
        User.countDocuments({ roles: "renter", isVerified: true, isBlocked: false, isActive: true }),
        User.countDocuments({ roles: "renter", isBlocked: true }),
    ]);

    // ── Listings Health ──
    const [activeListings, pausedListings, removedListings] = await Promise.all([
        Item.countDocuments({ status: "active", isActive: true }),
        Item.countDocuments({ status: "paused" }),
        Item.countDocuments({ isActive: false }),
    ]);

    const listingsHealth: Array<[string, string, string]> = [
        ["Active Listings", activeListings.toLocaleString(), "success"],
        ["Paused by Owner", pausedListings.toLocaleString(), "warning"],
        ["Removed/Inactive", removedListings.toLocaleString(), "error"],
    ];

    // ── Bookings Health ──
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [activeSessions, completedMTD, cancelledTotal] = await Promise.all([
        Booking.countDocuments({ booking_status: "ongoing" }),
        Booking.countDocuments({
            booking_status: "completed",
            updatedAt: { $gte: startOfMonth },
        }),
        Booking.countDocuments({ booking_status: "cancelled" }),
    ]);

    const bookingsHealth: Array<[string, string, string]> = [
        ["Active Sessions", activeSessions.toLocaleString(), "bright"],
        ["Completed (MTD)", completedMTD.toLocaleString(), "success"],
        ["Cancelled", cancelledTotal.toLocaleString(), "muted"],
    ];

    // ── Financial Snapshot ──
    const financialAgg = await Booking.aggregate([
        { $match: { payment_status: "paid" } },
        {
            $group: {
                _id: null,
                grossRevenue: { $sum: "$pricing.totalAmount" },
                commissionEarned: { $sum: "$pricing.platformFee" },
            },
        },
    ]);

    const grossRevenue = financialAgg[0]?.grossRevenue || 0;
    const commissionEarned = financialAgg[0]?.commissionEarned || 0;

    // Payouts pending = total ownerEarnings from completed bookings minus what's been withdrawn
    // Simplified: sum ownerEarning from paid bookings that are completed but not yet settled
    const payoutAgg = await Booking.aggregate([
        {
            $match: {
                payment_status: "paid",
                booking_status: { $in: ["completed", "ongoing"] },
            },
        },
        {
            $group: {
                _id: null,
                pendingPayouts: { $sum: "$pricing.ownerEarning" },
            },
        },
    ]);

    const payoutsPending = payoutAgg[0]?.pendingPayouts || 0;

    // ── Alerts ──
    const [unverifiedUsers, cancelledBookings] = await Promise.all([
        User.countDocuments({ isVerified: true, isActive: true, isBlocked: false, name: { $exists: false } }),
        Booking.countDocuments({ booking_status: "cancelled" }),
    ]);

    const inactiveListingsCount = await Item.countDocuments({ isActive: false });

    const alerts: Array<{ text: string; count: number }> = [];

    if (inactiveListingsCount > 0) {
        alerts.push({
            text: `${inactiveListingsCount} listings have been deactivated`,
            count: inactiveListingsCount,
        });
    }
    if (unverifiedUsers > 0) {
        alerts.push({
            text: `${unverifiedUsers} users have incomplete profiles`,
            count: unverifiedUsers,
        });
    }
    if (cancelledBookings > 0) {
        alerts.push({
            text: `${cancelledBookings} bookings have been cancelled`,
            count: cancelledBookings,
        });
    }

    return {
        topStats: { totalUsers, totalListings, activeRentals },
        userOverview: {
            owners: { total: totalOwners, active: activeOwners, suspended: suspendedOwners },
            renters: { total: totalRenters, active: activeRenters, suspended: suspendedRenters },
        },
        listingsHealth,
        bookingsHealth,
        financialSnapshot: { grossRevenue, commissionEarned, payoutsPending },
        alerts,
    };
};


// ─────────────────────────────────────────────────────────
//  USERS — List with Filters + Pagination
// ─────────────────────────────────────────────────────────

interface GetUsersParams {
    page: number;
    limit: number;
    role?: string;
    search?: string;
    status?: string;
}

export const getUsersService = async ({ page, limit, role, search, status }: GetUsersParams) => {
    const filter: any = { isVerified: true };

    // Role filter
    if (role && ["owner", "renter"].includes(role)) {
        filter.roles = role;
    }
    // Exclude admins from listing
    if (!role) {
        filter.roles = { $ne: "admin" };
    }

    // Status filter
    if (status === "active") {
        filter.isBlocked = false;
        filter.isActive = true;
    } else if (status === "suspended") {
        filter.isBlocked = true;
    } else if (status === "inactive") {
        filter.isActive = false;
    }

    // Search filter
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        User.find(filter)
            .select("name email roles profileImage isBlocked isActive isVerified createdAt owner renter")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        User.countDocuments(filter),
    ]);

    // Format users for frontend
    const formattedUsers = users.map((user) => {
        let userStatus = "Active";
        if (user.isBlocked) userStatus = "Suspended";
        else if (!user.isActive) userStatus = "Inactive";

        const isOwner = user.roles === "owner";

        return {
            _id: user._id,
            name: user.name || "Unnamed User",
            email: user.email,
            role: user.roles === "owner" ? "Owner" : "Renter",
            status: userStatus,
            joined: new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }),
            count: isOwner
                ? `${user.owner?.totalListings || 0} Listings`
                : `${user.renter?.totalBookings || 0} Orders`,
            rating: isOwner
                ? (user.owner?.rating?.average || 0).toFixed(1)
                : (user.renter?.rating?.average || 0).toFixed(1),
            avatar: user.profileImage || "",
            suspended: user.isBlocked,
        };
    });

    return {
        users: formattedUsers,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};


// ─────────────────────────────────────────────────────────
//  USER DETAIL — Single User with Stats & Activity
// ─────────────────────────────────────────────────────────

export const getUserDetailService = async (userId: string) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new AppError("Invalid user ID", 400);
    }

    const user = await User.findById(userId)
        .select("-password -googleId")
        .lean();

    if (!user) {
        throw new AppError("User not found", 404);
    }

    const isOwner = user.roles === "owner";

    // Get stats
    const [totalBookings, totalReviews, disputeCount] = await Promise.all([
        Booking.countDocuments(
            isOwner ? { owner_id: user._id } : { renter_id: user._id }
        ),
        Review.countDocuments({ reviewedUserId: user._id }),
        Booking.countDocuments({
            ...(isOwner ? { owner_id: user._id } : { renter_id: user._id }),
            booking_status: "cancelled",
        }),
    ]);

    // Get recent activity (last 10 bookings)
    const recentBookings = await Booking.find(
        isOwner ? { owner_id: user._id } : { renter_id: user._id }
    )
        .sort({ updatedAt: -1 })
        .limit(10)
        .populate("item_id", "title")
        .lean();

    const activity = recentBookings.map((booking) => {
        let tone = "bright";
        let title = "Booking Update";

        switch (booking.booking_status) {
            case "completed":
                tone = "success";
                title = "Booking Completed";
                break;
            case "ongoing":
                tone = "bright";
                title = "Active Rental";
                break;
            case "confirmed":
                tone = "bright";
                title = "Booking Confirmed";
                break;
            case "pending":
                tone = "warning";
                title = "Booking Pending";
                break;
            case "cancelled":
                tone = "error";
                title = "Booking Cancelled";
                break;
        }

        const itemTitle = (booking.item_id as any)?.title || "Unknown Item";
        const amount = booking.pricing?.totalAmount || 0;

        return {
            title,
            time: new Date(booking.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }),
            text: `${title} for ${itemTitle}. Amount: ₹${amount.toLocaleString()}`,
            tone,
        };
    });

    // Determine status
    let status = "Active";
    if (user.isBlocked) status = "Suspended";
    else if (!user.isActive) status = "Inactive";

    return {
        profile: {
            _id: user._id,
            name: user.name || "Unnamed User",
            email: user.email,
            phone: user.phone || "",
            profileImage: user.profileImage || "",
            role: user.roles,
            status,
            isVerified: user.isVerified,
            isBlocked: user.isBlocked,
            joinDate: new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            }),
            address: user.address || {},
            walletBalance: user.walletBalance,
        },
        stats: {
            totalBookings,
            totalEarnings: isOwner ? (user.owner?.totalEarnings || 0) : (user.renter?.totalSpent || 0),
            avgRating: isOwner
                ? (user.owner?.rating?.average || 0)
                : (user.renter?.rating?.average || 0),
            reviewCount: totalReviews,
            disputes: disputeCount,
        },
        activity,
    };
};


// ─────────────────────────────────────────────────────────
//  USER ACTIONS — Block / Unblock
// ─────────────────────────────────────────────────────────

export const blockUserService = async (userId: string) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new AppError("Invalid user ID", 400);
    }

    const user = await User.findById(userId).select("roles isBlocked").lean();
    if (!user) throw new AppError("User not found", 404);
    if (user.roles === "admin") throw new AppError("Cannot block an admin user", 403);
    if (user.isBlocked) throw new AppError("User is already blocked", 400);

    await User.findByIdAndUpdate(userId, { isBlocked: true });
    return { message: "User has been blocked successfully" };
};

export const unblockUserService = async (userId: string) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new AppError("Invalid user ID", 400);
    }

    const user = await User.findById(userId).select("isBlocked").lean();
    if (!user) throw new AppError("User not found", 404);
    if (!user.isBlocked) throw new AppError("User is not blocked", 400);

    await User.findByIdAndUpdate(userId, { isBlocked: false });
    return { message: "User has been unblocked successfully" };
};


// ─────────────────────────────────────────────────────────
//  LISTINGS — List with Filters + Pagination
// ─────────────────────────────────────────────────────────

interface GetListingsParams {
    page: number;
    limit: number;
    status?: string;
    category?: string;
    search?: string;
}

export const getListingsService = async ({ page, limit, status, category, search }: GetListingsParams) => {
    const filter: any = {};

    // Status filter
    if (status === "active") {
        filter.status = "active";
        filter.isActive = true;
    } else if (status === "paused") {
        filter.status = "paused";
    } else if (status === "removed") {
        filter.isActive = false;
    } else if (status === "rented") {
        filter.status = "rented";
    }

    // Category filter
    if (category) {
        filter.category = { $regex: category, $options: "i" };
    }

    // Search filter
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
        ];
    }

    const skip = (page - 1) * limit;

    const [listings, total] = await Promise.all([
        Item.find(filter)
            .populate("ownerId", "name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Item.countDocuments(filter),
    ]);

    const formattedListings = listings.map((listing) => {
        let listingStatus = "Active";
        if (!listing.isActive) listingStatus = "Removed";
        else if (listing.status === "paused") listingStatus = "Paused";
        else if (listing.status === "rented") listingStatus = "Rented";

        return {
            _id: listing._id,
            title: listing.title,
            owner: (listing.ownerId as any)?.name || "Unknown Owner",
            ownerId: (listing.ownerId as any)?._id || listing.ownerId,
            rating: (listing.rating?.average || 0).toFixed(1),
            category: listing.category,
            price: listing.price?.daily || 0,
            status: listingStatus,
            reports: 0, // No report model yet
            image: listing.images?.[0] || "",
            totalBookings: listing.totalBookings || 0,
            createdAt: listing.createdAt,
        };
    });

    return {
        listings: formattedListings,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};


// ─────────────────────────────────────────────────────────
//  LISTING ACTIONS — Toggle Active
// ─────────────────────────────────────────────────────────

export const toggleListingActiveService = async (listingId: string) => {
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
        throw new AppError("Invalid listing ID", 400);
    }

    const listing = await Item.findById(listingId).select("isActive").lean();
    if (!listing) throw new AppError("Listing not found", 404);

    const newStatus = !listing.isActive;
    await Item.findByIdAndUpdate(listingId, { isActive: newStatus });

    return {
        message: newStatus
            ? "Listing has been reactivated"
            : "Listing has been deactivated",
        isActive: newStatus,
    };
};
