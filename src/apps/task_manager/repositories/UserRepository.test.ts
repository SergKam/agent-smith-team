import { UserRepository, UserNotFoundError } from './UserRepository';
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
  describe('userExists', () => {
    it('should return true if user exists', async () => {
      mockConnection.execute.mockResolvedValue([[{ id: 1 }]]);

      const result = await userRepository.userExists(1);

      expect(result).toBe(true);
      expect(mockConnection.execute).toHaveBeenCalledWith(
        'SELECT id FROM users WHERE id = ?',
        [1],
      );
    });

    it('should return false if user does not exist', async () => {
      mockConnection.execute.mockResolvedValue([[]]);

      const result = await userRepository.userExists(1);

      expect(result).toBe(false);
      expect(mockConnection.execute).toHaveBeenCalledWith(
        'SELECT id FROM users WHERE id = ?',
        [1],
      );
    });
  });

  describe('validateUserExists', () => {
    it('should not throw an error if user exists', async () => {
      mockConnection.execute.mockResolvedValue([[{ id: 1 }]]);

      await expect(userRepository.validateUserExists(1)).resolves.not.toThrow();
    });

    it('should throw UserNotFoundError if user does not exist', async () => {
      mockConnection.execute.mockResolvedValue([[]]);

      await expect(userRepository.validateUserExists(1)).rejects.toBeInstanceOf(
        UserNotFoundError,
      );
    });
  });
});
