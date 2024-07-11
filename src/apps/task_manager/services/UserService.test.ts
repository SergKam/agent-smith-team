import { UserService } from './UserService';
import { UserRepository } from '../repositories/UserRepository';
import { User } from '../models/User';

jest.mock('../repositories/UserRepository');

const mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
const userService = new UserService(mockUserRepository);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('UserService', () => {
  describe('createUser', () => {
    it('should create a new user', async () => {
      const user: Omit<User, 'id'> = { name: 'Test User' };

      mockUserRepository.createUser.mockResolvedValue(1);

      const result = await userService.createUser(user);

      expect(result).toEqual({ ...user, id: 1 });
      expect(mockUserRepository.createUser).toHaveBeenCalledWith(user);
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const user: User = { id: 1, name: 'Test User' };

      mockUserRepository.getUserById.mockResolvedValue(user);

      const result = await userService.getUserById(1);

      expect(result).toEqual(user);
      expect(mockUserRepository.getUserById).toHaveBeenCalledWith(1);
    });

    it('should return null if user does not exist', async () => {
      mockUserRepository.getUserById.mockResolvedValue(null);

      const result = await userService.getUserById(9999);

      expect(result).toBeNull();
      expect(mockUserRepository.getUserById).toHaveBeenCalledWith(9999);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users: User[] = [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' },
      ];

      mockUserRepository.getAllUsers.mockResolvedValue(users);

      const result = await userService.getAllUsers();

      expect(result).toEqual(users);
      expect(mockUserRepository.getAllUsers).toHaveBeenCalled();
    });
  });

  describe('updateUserById', () => {
    it('should update a user by ID', async () => {
      const existingUser: User = { id: 1, name: 'Test User' };
      const updatedUserData: Partial<User> = { name: 'Updated User' };
      const updatedUser: User = { ...existingUser, ...updatedUserData };

      mockUserRepository.getUserById.mockResolvedValue(existingUser);
      mockUserRepository.updateUserById.mockResolvedValue();

      const result = await userService.updateUserById(1, updatedUserData);

      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.getUserById).toHaveBeenCalledWith(1);
      expect(mockUserRepository.updateUserById).toHaveBeenCalledWith(
        1,
        updatedUser,
      );
    });

    it('should return null if user does not exist', async () => {
      mockUserRepository.getUserById.mockResolvedValue(null);

      const result = await userService.updateUserById(9999, {
        name: 'Updated User',
      });

      expect(result).toBeNull();
      expect(mockUserRepository.getUserById).toHaveBeenCalledWith(9999);
    });
  });

  describe('deleteUserById', () => {
    it('should delete a user by ID', async () => {
      const existingUser: User = { id: 1, name: 'Test User' };

      mockUserRepository.getUserById.mockResolvedValue(existingUser);
      mockUserRepository.deleteUserById.mockResolvedValue();

      const result = await userService.deleteUserById(1);

      expect(result).toBe(true);
      expect(mockUserRepository.getUserById).toHaveBeenCalledWith(1);
      expect(mockUserRepository.deleteUserById).toHaveBeenCalledWith(1);
    });

    it('should return false if user does not exist', async () => {
      mockUserRepository.getUserById.mockResolvedValue(null);

      const result = await userService.deleteUserById(9999);

      expect(result).toBe(false);
      expect(mockUserRepository.getUserById).toHaveBeenCalledWith(9999);
    });
  });
});
