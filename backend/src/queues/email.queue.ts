import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const emailQueue = new Queue("emailQueue", {
    connection: redisConnection as any,
})

export const bookingStatusQueue = new Queue("bookingStatusQueue", {
    connection: redisConnection as any,
})