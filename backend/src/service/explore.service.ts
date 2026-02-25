import mongoose, { Types } from "mongoose";
import { Item, IItem } from "../models/item.model";
import { AppError } from "../utils/AppError";
import { esClient, ITEMS_INDEX } from "../config/elasticSearch";
import type { QueryDslQueryContainer } from "@elastic/elasticsearch/lib/api/types";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface SearchParams {
    q?: string;
    category?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mongoose services (listing / detail)
// ─────────────────────────────────────────────────────────────────────────────

export const getAllItemsService = async (cursor?: string, limit = 10) => {
    const query: mongoose.FilterQuery<IItem> = { isActive: true };

    // Cursor-based pagination
    if (cursor) {
        query._id = { $lt: new Types.ObjectId(cursor) };
    }

    const items = await Item.find(query)
        .sort({ _id: -1 })
        .limit(limit)
        .lean();

    if (!items.length) {
        return [];
    }

    return items.map((i) => ({
        id: i._id.toString(),
        title: i.title,
        image: i.images?.[0] ?? null,
        dailyPrice: i.price?.daily ?? 0,
        category: i.category,
        discount: i.discount?.daily ?? null,
        rating: i.rating?.average ?? 0,
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

// ─────────────────────────────────────────────────────────────────────────────
// ElasticSearch — index a single item (call after create / update)
// ─────────────────────────────────────────────────────────────────────────────

export const indexItemToES = async (item: IItem & { _id: Types.ObjectId }) => {
    await esClient.index({
        index: ITEMS_INDEX,
        id: item._id.toString(),
        document: {
            title: item.title,
            category: item.category,
            subCategory: item.subCategory ?? null,
            dailyPrice: item.price?.daily ?? 0,
            rating: item.rating?.average ?? 0,
        },
    });
};

// ─────────────────────────────────────────────────────────────────────────────
// ElasticSearch — full-text search with filters + pagination
// ─────────────────────────────────────────────────────────────────────────────

export const searchItemsService = async ({
    q,
    category,
    city,
    minPrice,
    maxPrice,
    page = 1,
    limit = 12,
}: SearchParams) => {
    const from = (page - 1) * limit;

    // Build filter clauses
    const filters: object[] = [{ term: { isActive: true } }];

    if (category) {
        filters.push({ term: { category } });
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        const range: Record<string, number> = {};
        if (minPrice !== undefined) range.gte = minPrice;
        if (maxPrice !== undefined) range.lte = maxPrice;
        filters.push({ range: { dailyPrice: range } });
    }

    // Build the query
    const esQuery: QueryDslQueryContainer = q
        ? {
            bool: {
                must: [
                    {
                        multi_match: {
                            query: q,
                            fields: ["title^3", "category^2"],
                            fuzziness: "AUTO",
                            operator: "or",
                        },
                    },
                ],
                filter: filters as QueryDslQueryContainer[],
            },
        }
        : {
            bool: {
                must: [{ match_all: {} }],
                filter: filters as QueryDslQueryContainer[],
            },
        };

    const result = await esClient.search({
        index: ITEMS_INDEX,
        from,
        size: limit,
        query: esQuery,
        sort: q
            ? [{ _score: { order: "desc" } }]            // relevance when searching
            : [{ "rating": { order: "desc" } }],         // rating when browsing
    });

    const hits = result.hits.hits;
    const total = typeof result.hits.total === "number"
        ? result.hits.total
        : (result.hits.total?.value ?? 0);

    const items = hits.map((hit) => {
        const src = hit._source as any;
        return {
            id: hit._id,
            title: src.title,
            image: src.image ?? null,
            dailyPrice: src.dailyPrice,
            category: src.category,
            discount: src.discountDaily ?? null,
            rating: src.rating,
            location: src.location,
            score: hit._score ?? null,
        };
    });

    return {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: from + hits.length < total,
    };
};