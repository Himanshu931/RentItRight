import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import logger from "../config/logger";
import { getAllItemsService, getItemByIdService, searchItemsService } from "../service/explore.service";

export interface item {
    id: string;
    title: string;
    image: string;
    dailyPrice: number;
    category: string;
    discount: number | null;
    rating: number;
}

export const exploreItems = catchAsync(async (req: Request, res: Response) => {
    logger.info("fetching items");

    const limit = Number(req.query.limit) || 12;
    const cursor = (req.query.cursor as string) || "";

    const items: item[] = await getAllItemsService(cursor, limit);

    logger.info("items fetched successfully");

    res.status(200).json({
        status: "success",
        data: items,
    });
});

export const exploreItem = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    logger.info(`fetching item ${id}`);

    const item = await getItemByIdService(id as string);

    logger.info("item fetched successfully");

    res.status(200).json({
        status: "success",
        item,
    });
});

export const searchItems = catchAsync(async (req: Request, res: Response) => {
    const q = (req.query.q as string) || undefined;
    const category = (req.query.category as string) || undefined;
    const city = (req.query.city as string) || undefined;
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;

    logger.info(`[Search] q=${q} category=${category} city=${city} price=${minPrice}-${maxPrice} page=${page}`);

    const result = await searchItemsService({ q, category, city, minPrice, maxPrice, page, limit });

    logger.info(`[Search] Found ${result.total} items`);

    res.status(200).json({
        status: "success",
        ...result,
    });
});