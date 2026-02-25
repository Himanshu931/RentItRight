import app from "./app";
import { connectDB } from "./config/db";
import logger from "./config/logger";
const PORT = "10.93.208.201";

connectDB();

app.listen(PORT, () => {
    logger.info(`Server running on http://${PORT}`);
});
