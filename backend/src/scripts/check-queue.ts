import { Queue } from "bullmq";
import { createRedisConnection } from "../config/redis";

const emailQueue = new Queue("emailQueue", {
    connection: createRedisConnection() as any,
});

async function run() {
    const failedJobs = await emailQueue.getFailed();
    console.log("Failed jobs count:", failedJobs.length);
    for (const job of failedJobs) {
        console.log("Job ID:", job.id, "Name:", job.name);
        console.log("Failed Reason:", job.failedReason);
    }
    process.exit(0);
}

run();
