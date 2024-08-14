import { Comment, CommentInput } from "../models/Comment";
import { getConnection } from "../../../database/db";

export class CommentRepository {
  async createComment(comment: CommentInput): Promise<number> {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute(
        `INSERT INTO comments (taskId, userId, content) VALUES (?, ?, ?)`,
        [comment.taskId, comment.userId, comment.content]
      );
      return (result as any).insertId;
    } finally {
      connection.release();
    }
  }

  async getCommentsByTaskId(taskId: number): Promise<Comment[]> {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute(
        "SELECT * FROM comments WHERE taskId = ?",
        [taskId]
      );
      return rows as Comment[];
    } finally {
      connection.release();
    }
    }

  async getAllComments(): Promise<Comment[]> {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute("SELECT * FROM comments");
      return rows as Comment[];
    } finally {
      connection.release();
    }
  }
}
