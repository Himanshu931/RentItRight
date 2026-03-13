import { Item } from "../models/item.model";
import { User } from "../models/user.model";
import mongoose from "mongoose";
import { AppError } from "../utils/AppError";
import { updateItemSchema, itemValidationSchema } from "../validatior/item.schema";
import z from "zod";
import logger from "../config/logger";
import { ROLE } from "../validatior/auth.schema";

function ensureOwner(role: ROLE) {
    if (role !== ROLE.OWNER) {
        logger.warn("Unauthorized access attempt", { role });
        throw new AppError("Unauthorized", 403);
    }
}

export const getItemService = async (
    id: string,
    status?: string,
    page: number = 1,
    q?: string,
    role?: ROLE
) => {

    logger.info("Fetching items", { userId: id, status, page, q });

    ensureOwner(role!);

    const query: mongoose.FilterQuery<Item> = {
        ownerId: new mongoose.Types.ObjectId(id)
    };

    if (status) query.status = status;

    if (q) query.$text = { $search: q };

    const limit = 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
        Item.find(query)
            .select("title images price category rating description")
            .lean()
            .sort(q ? { score: { $meta: "textScore" } } : { createdAt: -1 })
            .skip(skip)
            .limit(limit),

        Item.countDocuments(query)
    ]);

    logger.info("Items fetched successfully", {
        userId: id,
        totalItems: total,
        page
    });

    const formattedItems = items.map((item) => ({
        id: item._id.toString(),
        title: item.title,
        image: item.images?.[0] ?? null,
        price: item.price?.daily ?? 0,
        category: item.category,
        discount: item.discount?.daily ?? null,
        rating: item.rating?.average ?? 0,
    }));

    return {
        items: formattedItems,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

export const addItemService = async (
    userId: string,
    data: z.infer<typeof itemValidationSchema>
) => {

    logger.info("Creating new item", { userId });

    const user = await User.findById(userId).select("roles").lean();

    if (!user) {
        logger.error("User not found while creating item", { userId });
        throw new AppError("User not found", 404);
    }

    ensureOwner(user.roles as ROLE);

    const item = await Item.create({
        ownerId: userId,
        ...data,
    });

    logger.info("Item created successfully", {
        userId,
        itemId: item._id
    });

    return item;
};

export const updateItemService = async (
    itemId: string,
    userId: string,
    data: z.infer<typeof updateItemSchema>,
    role: ROLE
) => {

    logger.info("Updating item", { itemId, userId });

    ensureOwner(role);

    const item = await Item.findOneAndUpdate(
        { _id: itemId, ownerId: userId, status: { $ne: "rented" } },
        { $set: data },
        { new: true, runValidators: true }
    );

    if (!item) {
        logger.warn("Item update failed - item not found", { itemId, userId });
        throw new AppError("Item not found", 404);
    }

    logger.info("Item updated successfully", { itemId });

    return item;
};

export const pauseItemService = async (
    itemId: string,
    userId: string,
    role: ROLE
) => {

    logger.info("Pausing item", { itemId, userId });

    ensureOwner(role);

    const item = await Item.findOne({ _id: itemId, ownerId: userId });

    if (!item) {
        logger.warn("Pause failed - item not found", { itemId });
        throw new AppError("Item not found", 404);
    }

    if (item.status === "rented") {
        logger.warn("Pause failed - item already rented", { itemId });
        throw new AppError("Item already rented", 400);
    }

    item.status = "paused";
    await item.save();

    logger.info("Item paused successfully", { itemId });
};

export const deleteItemService = async (
    itemId: string,
    userId: string,
    role: ROLE
) => {

    logger.info("Deleting item", { itemId, userId });

    ensureOwner(role);

    const item = await Item.findOne({ _id: itemId, ownerId: userId });

    if (!item) {
        logger.warn("Delete failed - item not found", { itemId });
        throw new AppError("Item not found", 404);
    }

    if (item.status === "rented") {
        logger.warn("Delete failed - item currently rented", { itemId });
        throw new AppError("Item can't be deleted as it is currently rented", 400);
    }

    await Item.deleteOne({ _id: itemId, ownerId: userId });

    logger.info("Item deleted successfully", { itemId });
};