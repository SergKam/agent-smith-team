import { Comment, CommentInput } from '../models/Comment';
import { CommentRepository } from '../repositories/CommentRepository';

export class CommentService {
    private commentRepository = new CommentRepository();

    async addCommentToTask(taskId: number, commentData: CommentInput): Promise<Comment> {
        const commentId = await this.commentRepository.createComment({ ...commentData, taskId });
        return { ...commentData, id: commentId, taskId };
    }
}