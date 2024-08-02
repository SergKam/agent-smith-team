import { User } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  async createUser(user: Omit<User, "id">): Promise<User> {
    const userId = await this.userRepository.createUser(user);
    return { ...user, id: userId };
  }

  async getUserById(userId: number): Promise<User | null> {
    return this.userRepository.getUserById(userId);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.getAllUsers();
  }

  async updateUserById(
    userId: number,
    userData: Partial<User>
  ): Promise<User | null> {
    const existingUser = await this.userRepository.getUserById(userId);
    if (!existingUser) {
      return null;
    }

    const updatedUser = { ...existingUser, ...userData };
    await this.userRepository.updateUserById(userId, updatedUser);

    return updatedUser;
  }

  async deleteUserById(userId: number): Promise<boolean> {
    const existingUser = await this.userRepository.getUserById(userId);
    if (!existingUser) {
      return false;
    }

    await this.userRepository.deleteUserById(userId);
    return true;
  }
}
