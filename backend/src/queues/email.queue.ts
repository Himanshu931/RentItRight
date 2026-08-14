import { Queue } from "bullmq";
import { createRedisConnection } from "../config/redis";

export const emailQueue = new Queue("emailQueue", {
    connection: createRedisConnection() as any,
})

export const bookingStatusQueue = new Queue("bookingStatusQueue", {
    connection: createRedisConnection() as any,
})