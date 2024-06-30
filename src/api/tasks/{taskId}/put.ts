
import { Request, Response } from 'express';

export default function() {
  return {
    put: (req: Request, res: Response) => {
      res.send('Response from PUT /tasks/{taskId}');
    }
  };
}
