
import { Request, Response } from 'express';

export default function() {
  return {
    get: (req: Request, res: Response) => {
      res.send('Response from GET /tasks');
    }
  };
}
