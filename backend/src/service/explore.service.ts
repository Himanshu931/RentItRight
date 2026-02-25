import { Item } from "../models/item.model";
import { AppError } from "../utils/AppError";
import { Types } from "mongoose";

export const getAllItemsService = async () => {
    const items = await Item.find({ isActive: true })
        .sort({ createdAt: -1 })
        .lean();

    if (!items.length) {
        throw new AppError("No items found", 404);
    }

    return items.map((i) => ({
        id: i._id.toString(),
        title: i.title,
        image: i.images?.[0],
        dailyPrice: i.price.daily,
        category: i.category,
        discount: i.discount?.daily,
        rating: i.rating.average,
    }));
};

export const getItemByIdService = async (id: string) => {
    const item = await Item.findById(id)
        .populate<{ ownerId: { _id: Types.ObjectId; name: string; profileImage?: string } }>("ownerId")
        .lean();

    if (!item) {
        throw new AppError("No Item found", 404);
    }

    return {
        id: item._id.toString(),
        title: item.title,
        description: item.description,
        images: item.images ?? [],
        location: item.location,
        category: item.category,
        rating: item.rating.average,
        price: item.price?.daily ?? 0,
        unavailableDates: item.availability.unavailableDates,
        owner: item.ownerId
            ? {
                id: item.ownerId._id.toString(),
                name: item.ownerId.name,
                image: item.ownerId.profileImage ?? null,
            }
            : null,
    };
};