import { Request, Response } from 'express';
import { CommentService } from '../../../services/CommentService';

export default function() {
    return {
        post: async (req: Request, res: Response, next: Function) => {
            const taskId = parseInt(req.params.taskId, 10);
            const commentService = new CommentService();
            const commentData = req.body;

            const createdComment = await commentService.addCommentToTask(taskId, commentData);
            res.status(201).json(createdComment);
        }
    };
}
