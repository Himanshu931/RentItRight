import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import {
    getDashboardStatsService,
    getUsersService,
    getUserDetailService,
    suspendUserService,
    unsuspendUserService,
    getListingsService,
    toggleListingActiveService,
    getBookingsService,
} from "../service/admin.service";


// ── Dashboard ──────────────────────────────────────────

export const getDashboard = catchAsync(async (req: Request, res: Response) => {
    const data = await getDashboardStatsService();
    res.status(200).json({
        success: true,
        data,
        message: "Dashboard data fetched successfully",
    });
});


// ── Users ──────────────────────────────────────────────

export const getUsers = catchAsync(async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const role = req.query.role as string | undefined;
    const search = req.query.search as string | undefined;
    const status = req.query.status as string | undefined;

    const data = await getUsersService({ page, limit, role, search, status });
    res.status(200).json({
        success: true,
        data,
        message: "Users fetched successfully",
    });
});


export const getUserDetail = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const data = await getUserDetailService(id);
    res.status(200).json({
        success: true,
        data,
        message: "User detail fetched successfully",
    });
});


export const suspendUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await suspendUserService(id);
    res.status(200).json({
        success: true,
        message: result.message,
    });
});

export const unsuspendUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await unsuspendUserService(id);
    res.status(200).json({
        success: true,
        message: result.message,
    });
});



// ── Listings ───────────────────────────────────────────

export const getListings = catchAsync(async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const status = req.query.status as string | undefined;
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;

    const data = await getListingsService({ page, limit, status, category, search });
    res.status(200).json({
        success: true,
        data,
        message: "Listings fetched successfully",
    });
});


export const toggleListingActive = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await toggleListingActiveService(id);
    res.status(200).json({
        success: true,
        data: { isActive: result.isActive },
        message: result.message,
    });
});

// ── Bookings ───────────────────────────────────────────

export const getBookings = catchAsync(async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;

    const data = await getBookingsService({ page, limit, status, search });
    res.status(200).json({
        success: true,
        data,
        message: "Bookings fetched successfully",
    });
});
