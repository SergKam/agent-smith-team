import { UserRepository } from './UserRepository';
import { getConnection } from '../database/db';

jest.mock('../database/db');

const mockGetConnection = getConnection as jest.MockedFunction<
  typeof getConnection
>;

const mockConnection = {
  execute: jest.fn(),
  release: jest.fn(),
};

mockGetConnection.mockResolvedValue(mockConnection as any);

const userRepository = new UserRepository();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('UserRepository', () => {
  describe('createUser', () => {
    it('should create a new user', async () => {
      const user = { name: 'Test User' };

      mockConnection.execute.mockResolvedValue([{ insertId: 1 }]);

      const result = await userRepository.createUser(user);

      expect(result).toBe(1);
      expect(mockConnection.execute).toHaveBeenCalledWith(
        'INSERT INTO users (name) VALUES (?)',
        [user.name],
      );
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const user = { id: 1, name: 'Test User' };

      mockConnection.execute.mockResolvedValue([[user]]);

      const result = await userRepository.getUserById(1);

      expect(result).toEqual(user);
      expect(mockConnection.execute).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE id = ?',
        [1],
      );
    });

    it('should return null if user does not exist', async () => {
      mockConnection.execute.mockResolvedValue([[]]);

      const result = await userRepository.getUserById(9999);

      expect(result).toBeNull();
      expect(mockConnection.execute).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE id = ?',
        [9999],
      );
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' },
      ];

      mockConnection.execute.mockResolvedValue([users]);

      const result = await userRepository.getAllUsers();

      expect(result).toEqual(users);
      expect(mockConnection.execute).toHaveBeenCalledWith(
        'SELECT * FROM users',
      );
    });
  });

  describe('updateUserById', () => {
    it('should update a user by ID', async () => {
      const userData = { name: 'Updated User' };

      mockConnection.execute.mockResolvedValue([{}]);

      await userRepository.updateUserById(1, userData);

      expect(mockConnection.execute).toHaveBeenCalledWith(
        'UPDATE users SET name = ? WHERE id = ?',
        [userData.name, 1],
      );
    });
  });

  describe('deleteUserById', () => {
    it('should delete a user by ID', async () => {
      mockConnection.execute.mockResolvedValue([{}]);

      await userRepository.deleteUserById(1);

      expect(mockConnection.execute).toHaveBeenCalledWith(
        'DELETE FROM users WHERE id = ?',
        [1],
      );
    });
  });
});
