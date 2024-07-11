import { ErrorRequestHandler } from 'express';
import { UserNotFoundError } from '../repositories/UserRepository';

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  if (err instanceof UserNotFoundError) {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: 'Internal Server Error' });
};

export default errorMiddleware;
