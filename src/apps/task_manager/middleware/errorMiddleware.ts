import { ErrorRequestHandler } from "express";
import { UserNotFoundError } from "../domain/user/repositories/UserRepository";
import wLogger from "./logger";

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  wLogger.error(err.message, { stack: err.stack });
  if (err.status) {
    return res.status(err.status).json(err);
  }

  if (err instanceof UserNotFoundError) {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({ message: "Internal Server Error" });
};

export default errorMiddleware;
