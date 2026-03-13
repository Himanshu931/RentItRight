import { Item } from "../models/item.model";
import mongoose from "mongoose";
import { AppError } from "../utils/AppError";
import { updateItemSchema, itemValidationSchema } from "../validatior/item.schema";
import z from "zod";
import logger from "../config/logger";
import { ROLE } from "../validatior/auth.schema";

function ensureOwner(role: ROLE) {
    if (role !== ROLE.OWNER) {
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

export const addItemService = async (userId: string, data: z.infer<typeof itemValidationSchema>, role: ROLE) => {

    ensureOwner(role);

    const item = await Item.create({
        ownerId: userId,
        ...data,
    })

    if (!item) {
        logger.error("Unable to create item for user", userId)
    }
}

export const updateItemService = async (itemId: string, userId: string, data: z.infer<typeof updateItemSchema>, role: ROLE) => {

    ensureOwner(role!)

    const item = await Item.findOneAndUpdate({ _id: itemId, ownerId: userId, status: { $ne: "rented" } }, { $set: data }, { new: true, runValidators: true })

    if (!item) {
        throw new AppError("Item not found", 404);
    }
}

export const pauseItemService = async (itemId: string, userId: string, role: ROLE) => {

    ensureOwner(role!)

    const item = await Item.findOne({ _id: itemId, ownerId: userId });

    if (!item) {
        throw new AppError("Item not found", 404);
    }

    if (item.status === "rented") {
        throw new AppError("Item already rented", 400)
    }

    item.status = "paused";
    await item.save();
}

export const deleteItemService = async (itemId: string, userId: string, role: ROLE) => {

    ensureOwner(role!)

    const item = await Item.findOne({ _id: itemId, ownerId: userId });

    if (!item) {
        throw new AppError("Item not found", 404);
    }

    if (item.status === "rented") {
        throw new AppError("Item can't be deleted as it is currently rented", 400)
    }

    await Item.deleteOne({ _id: itemId, ownerId: userId });
}