
import { Request, Response } from 'express';

export default function() {
  return {
    post: (req: Request, res: Response) => {
      res.send('Response from POST /tasks/{taskId}/comments');
    }
  };
}
