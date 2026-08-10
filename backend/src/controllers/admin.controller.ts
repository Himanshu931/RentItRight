import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import {
    getDashboardStatsService,
    getUsersService,
    getUserDetailService,
    blockUserService,
    unblockUserService,
    getListingsService,
    toggleListingActiveService,
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


export const blockUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await blockUserService(id);
    res.status(200).json({
        success: true,
        message: result.message,
    });
});


export const unblockUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await unblockUserService(id);
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
