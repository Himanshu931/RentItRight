import app from "./app";
import { connectDB } from "./config/db";
import logger from "./config/logger";
import { initElasticIndex } from "./config/elasticSearch";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();
        await initElasticIndex();

        app.listen(PORT, () => {
            logger.info(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        logger.error("Failed to start server", error);
        process.exit(1);
    }
};

startServer();