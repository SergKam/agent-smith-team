import { Request, Response } from 'express';
import { CommentService } from '../../../services/CommentService';

export default function () {
  return {
    get: async (req: Request, res: Response) => {
      const taskId = parseInt(req.params.taskId, 10);
      const commentService = new CommentService();
      const comments = await commentService.getCommentsByTaskId(taskId);
      res.status(200).json(comments);
    },
    post: async (req: Request, res: Response) => {
      const taskId = parseInt(req.params.taskId, 10);
      const commentService = new CommentService();
      const commentData = req.body;

      const createdComment = await commentService.addCommentToTask(
        taskId,
        commentData,
      );
      res.status(201).json(createdComment);
    },
  };
}
