import app from "./app";
import { connectDB } from "./config/db";
import logger from "./config/logger";
const PORT = 3000;

connectDB();

app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
});
