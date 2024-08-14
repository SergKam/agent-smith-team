import { createLogger, format, Logger, transports } from "winston";
import { Request, Response } from "express";
const logLevel = process.env.LOG_LEVEL || "info";

export type TsLogger = Logger & {
  trace(message?: any, ...optionalParams: any[]): void;
  middleware: (req: any, res: any, next: any) => void;
};
const wLogger = createLogger({
  level: logLevel,
  defaultMeta: { service: "taskManager" },
  format: format.simple(),
  transports: [new transports.Console()],
});

const logger = wLogger as TsLogger;
logger.trace = logger.debug;
logger.middleware = (req: Request, res: Response, next) => {
  const start = Date.now();
  res.on("finish", () => {
    logger.info(
      ` ${res.statusCode} ${req.method} ${req.url} ${
        Date.now() - start
      }ms ${res.get("Content-Length")}b`
    );
    logger.debug(`Request body: ${JSON.stringify(req.body)}`);
  });
  next();
};
export default logger;
