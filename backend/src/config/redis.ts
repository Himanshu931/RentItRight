import { Redis } from "ioredis";
import logger from "./logger";


export const createRedisConnection = () => {
    const conn = new Redis(process.env.REDIS_URL as string, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
    });

    conn.on("connect", () => {
        logger.info("Redis connected")
    })

    conn.on("error", (err) => {
        logger.error("Redis connection error", err)
    })

    return conn;
};