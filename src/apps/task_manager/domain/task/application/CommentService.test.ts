import { CommentService } from '../services/CommentService';
import { CommentRepository } from '../repositories/CommentRepository';
import { Comment, CommentInput } from '../models/Comment';

jest.mock('../repositories/CommentRepository');

const mockCommentRepository =
  new CommentRepository() as jest.Mocked<CommentRepository>;
const commentService = new CommentService(mockCommentRepository);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('CommentService', () => {
  describe('addCommentToTask', () => {
    it('should add a comment to a task', async () => {
      const comment: CommentInput = {
        taskId: 1,
        userId: 1,
        content: 'Test Comment',
      };

      mockCommentRepository.createComment.mockResolvedValue(1);

      const result = await commentService.addCommentToTask(1, comment);

      expect(result).toEqual({ ...comment, id: 1 });
      expect(mockCommentRepository.createComment).toHaveBeenCalledWith({
        ...comment,
        taskId: 1,
      });
    });
  });

  describe('getCommentsByTaskId', () => {
    it('should return comments for a specific task', async () => {
      const comments: Comment[] = [
        {
          id: 1,
          taskId: 1,
          userId: 1,
          content: 'Test Comment',
        },
      ];

      mockCommentRepository.getCommentsByTaskId.mockResolvedValue(comments);

      const result = await commentService.getCommentsByTaskId(1);

      expect(result).toEqual(comments);
      expect(mockCommentRepository.getCommentsByTaskId).toHaveBeenCalledWith(1);
    });
  });
});
