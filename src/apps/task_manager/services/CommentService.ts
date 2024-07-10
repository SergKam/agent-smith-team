import {Comment} from '../models/Comment';
import {CommentRepository} from '../repositories/CommentRepository';

export class CommentService {
    private commentRepository = new CommentRepository();

    async addCommentToTask(taskId: number, commentData: Comment): Promise<Comment> {
        const commentId = await this.commentRepository.createComment({...commentData, taskId});
        return {...commentData, id: commentId, taskId};
    }

    async getCommentsByTaskId(taskId: number): Promise<Comment[]> {
        return this.commentRepository.getCommentsByTaskId(taskId);
    }
}
