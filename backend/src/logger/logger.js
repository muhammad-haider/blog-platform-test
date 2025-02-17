import pretty from "pino-pretty";
import pino from "pino";

const stream = pretty({
  colorize: true,
});
const logger = pino({ level: "debug" }, stream);

export default logger;
