import pool from '../db';

export class UserRepository {
    async userExists(userId: number): Promise<boolean> {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT id FROM users WHERE id = ?',
                [userId]
            );
            return (rows as any[]).length > 0;
        } finally {
            connection.release();
        }
    }
}
