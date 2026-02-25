import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import logger from "../config/logger";
import { getAllItemsService, getItemByIdService } from "../service/explore.service";

export interface item {
    id: string;
    title: string;
    image: string;
    dailyPrice: number;
    category: string;
    discount?: number;
    rating: number;
}

export const exploreItems = catchAsync(async (req: Request, res: Response) => {
    logger.info("fetching items");

    const items: item[] = await getAllItemsService();

    logger.info("items fetched successfully");

    res.status(200).json({
        status: "success",
        data: items,
    })
})

export const exploreItem = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    logger.info(`fetching item ${id}`);

    const item = await getItemByIdService(id as string);

    logger.info("item fetched successfully");

    res.status(200).json({
        status: "success",
        item,
    })
})