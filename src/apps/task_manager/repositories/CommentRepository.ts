import pool from '../db';
import { Comment, CommentInput } from '../models/Comment';

export class CommentRepository {
    async createComment(comment: CommentInput): Promise<number> {
        const connection = await pool.getConnection();
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
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM comments WHERE taskId = ?',
                [taskId]
            );
            return rows as Comment[];
        } finally {
            connection.release();
        }
    }
}