import { getConnection } from '../database/db';
import { User } from '../models/User';

export class UserRepository {
  async createUser(user: Omit<User, 'id'>): Promise<number> {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute(
        'INSERT INTO users (name) VALUES (?)',
        [user.name],
      );
      return (result as any).insertId;
    } finally {
      connection.release();
    }
  }

  async getUserById(userId: number): Promise<User | null> {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE id = ?',
        [userId],
      );
      const users = rows as User[];
      return users.length > 0 ? users[0] : null;
    } finally {
      connection.release();
    }
  }

  async getAllUsers(): Promise<User[]> {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute('SELECT * FROM users');
      return rows as User[];
    } finally {
      connection.release();
    }
  }

  async updateUserById(userId: number, userData: Partial<User>): Promise<void> {
    const connection = await getConnection();
    try {
      const { name } = userData;
      await connection.execute('UPDATE users SET name = ? WHERE id = ?', [
        name,
        userId,
      ]);
    } finally {
      connection.release();
    }
  }

  async deleteUserById(userId: number): Promise<void> {
    const connection = await getConnection();
    try {
      await connection.execute('DELETE FROM users WHERE id = ?', [userId]);
    } finally {
      connection.release();
    }
  }

  async userExists(userId: number): Promise<boolean> {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT 1 FROM users WHERE id = ?',
        [userId],
      );
      const result = rows as any[];
      return result.length > 0;
    } finally {
      connection.release();
    }
  }
}

export class UserNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserNotFoundError';
  }
}
