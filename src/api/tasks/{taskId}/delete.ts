
import { Request, Response } from 'express';

export default function() {
  return {
    delete: (req: Request, res: Response) => {
      res.send('Response from DELETE /tasks/{taskId}');
    }
  };
}
