import config from "./src/config/config.js";
import logger from "./src/logger/logger.js";
import { app } from "./src/app/app.js";
import mongoose from "mongoose";
import http from "http";

try {
  mongoose.connect(config.DB_URI);
  logger.info("Connected to DB..");
} catch (e) {
  logger.error(e.message);
}

const httpServer = http.createServer(app);

httpServer.listen(config.PORT, () => {
  logger.info(`Server listening at Port ${config.PORT}`);
});
