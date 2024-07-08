import pool from '../db';

export class UserNotFoundError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = 'UserNotFoundError';
    }
}

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

    async validateUserExists(userId: number): Promise<void> {
        const exists = await this.userExists(userId);
        if (!exists) {
            throw new UserNotFoundError('Assigned user not found');
        }
    }
}
