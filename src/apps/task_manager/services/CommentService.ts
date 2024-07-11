import { Comment, CommentInput } from '../models/Comment';
import { CommentRepository } from '../repositories/CommentRepository';

export class CommentService {
  private commentRepository: CommentRepository;

  constructor(commentRepository: CommentRepository = new CommentRepository()) {
    this.commentRepository = commentRepository;
  }

  async addCommentToTask(
    taskId: number,
    commentData: CommentInput,
  ): Promise<Comment> {
    const commentId = await this.commentRepository.createComment({
      ...commentData,
      taskId,
    });
    return { ...commentData, id: commentId, taskId };
  }

  async getCommentsByTaskId(taskId: number): Promise<Comment[]> {
    return this.commentRepository.getCommentsByTaskId(taskId);
  }
}
