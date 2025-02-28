const PORT = process.env.PORT || 5000;

import app from "./app";
import connectDB from "./config/db";
import { logger } from "./config/logger";

connectDB().then(() => { app.listen(PORT, () => logger.info(`Server running on port ${PORT}`)); });