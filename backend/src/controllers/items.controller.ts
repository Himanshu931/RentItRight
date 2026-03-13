import { Request, Response } from "express"
import logger from "../config/logger";
import { AppError } from "../utils/AppError";
import { getItemService, pauseItemService, deleteItemService, updateItemService, addItemService } from "../service/items.service";
import { catchAsync } from "../utils/catchAsync";
import { updateItemSchema, itemValidationSchema } from "../validatior/item.schema";
import { ROLE } from "../validatior/auth.schema";

type ItemStatus = "active" | "paused" | "rented";

export const getItemsByUser = catchAsync(async (req: Request, res: Response) => {
    logger.info("Fetching itmes listed by user: ", req.userId);

    const status = req.query.status as ItemStatus;
    const page = req.query.page;
    const q = req.query.q as string;

    const items = await getItemService(req.userId!, status, Number(page), q, req.userRole! as ROLE);

    logger.info("Items fetched successfully");

    res.status(200).json({
        success: true,
        message: "Items fetched successfully",
        data: items
    })
})

export const updateItem = catchAsync(async (req: Request, res: Response) => {
    logger.info("Updating item: ", req.params.id)

    const itemId = req.params.id as string;

    const validate = updateItemSchema.safeParse(req.body);
    if (!validate.success) {
        throw new AppError(`Invalid data ${validate.error.flatten().fieldErrors}`, 422);
    }

    await updateItemService(itemId, req.userId!, validate.data, req.userRole! as ROLE);

    logger.info("Item has been updated")

    res.status(200).json({
        success: true,
        message: "Item updated"
    })
})

export const addItem = catchAsync(async (req: Request, res: Response) => {
    logger.info("Adding item by user: ", req.userId);

    const validate = itemValidationSchema.safeParse(req.body);
    if (!validate.success) {
        throw new AppError(`Invalid data ${validate.error.flatten().fieldErrors}`, 422);
    }

    await addItemService(req.userId!, validate.data, req.userRole! as ROLE);

    logger.info("Item added successfully");

    res.status(200).json({
        success: true,
        message: "Item added successfully"
    })

})

export const pauseItem = catchAsync(async (req: Request, res: Response) => {
    logger.info("Pausing item: ", req.params.id);

    const itemId = req.params.id as string;

    if (!itemId) {
        throw new AppError("Item ID is required", 400);
    }

    await pauseItemService(itemId, req.userId!, req.userRole! as ROLE);

    logger.info("Item paused successfully");

    res.status(200).json({
        success: true,
        message: "Item paused successfully",
    })
})

export const deleteItem = catchAsync(async (req: Request, res: Response) => {
    logger.info("Deleting item: ", req.params.id);

    const itemId = req.params.id as string

    if (!itemId) {
        throw new AppError("Item ID is required", 400);
    }

    await deleteItemService(itemId, req.userId!, req.userRole! as ROLE)

    logger.info("Item deleted successfully");

    res.status(200).json({
        success: true,
        message: "Item deleted successfully",
    })

})


