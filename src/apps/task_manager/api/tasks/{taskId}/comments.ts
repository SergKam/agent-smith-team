import { Request, Response } from 'express';
import { CommentService } from '../../../services/CommentService';
import { paths } from '../../../types/api-types';

// Define types for request and response bodies

type PostCommentRequest =
  paths['/tasks/{taskId}/comments']['post']['requestBody']['content']['application/json'];
type PostCommentResponse =
  paths['/tasks/{taskId}/comments']['post']['responses']['201']['content']['application/json'];
type GetCommentsResponse =
  paths['/tasks/{taskId}/comments']['get']['responses']['200']['content']['application/json'];

export default function () {
  return {
    get: async (req: Request, res: Response) => {
      const taskId = parseInt(req.params.taskId, 10);
      const commentService = new CommentService();
      const comments = await commentService.getCommentsByTaskId(taskId);
      const response: GetCommentsResponse = comments as GetCommentsResponse;
      res.header('Content-Range', `comments 0-${comments.length}/${comments.length}`);
      res.status(200).json(response);
    },
    post: async (req: Request, res: Response) => {
      const taskId = parseInt(req.params.taskId, 10);
      const commentService = new CommentService();
      const commentData: PostCommentRequest = req.body;

      const createdComment = await commentService.addCommentToTask(
        taskId,
        { ...commentData, taskId },
      );
      const response: PostCommentResponse =
        createdComment as PostCommentResponse;
      res.status(201).json(response);
    },
  };
}
