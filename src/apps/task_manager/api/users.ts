import { Request, Response } from 'express';
import { paths } from '../types/api-types';
import { UserService } from '../services/UserService';
import { User } from '../models/User';

// Define types for request and response bodies

type PostUserRequest =
  paths['/users']['post']['requestBody']['content']['application/json'];
type PostUserResponse =
  paths['/users']['post']['responses']['201']['content']['application/json'];
type GetUsersResponse =
  paths['/users']['get']['responses']['200']['content']['application/json'];
type GetUserByIdResponse =
  paths['/users/{userId}']['get']['responses']['200']['content']['application/json'];
type PutUserRequest =
  paths['/users/{userId}']['put']['requestBody']['content']['application/json'];
type PutUserResponse =
  paths['/users/{userId}']['put']['responses']['200']['content']['application/json'];

export default function () {
  return {
    post: async (req: Request, res: Response) => {
      const body: PostUserRequest = req.body;
      const userService = new UserService();

      const user: User = { id: 0, ...body }; // Ensure the user object has an id
      const createdUser = await userService.createUser(user);
      const response: PostUserResponse = createdUser as PostUserResponse;
      res.status(201).json(response);
    },
    get: async (req: Request, res: Response) => {
      const userService = new UserService();

      const users = await userService.getAllUsers();
      const response: GetUsersResponse = users as GetUsersResponse;
      res.header('Content-Range', `users 0-${users.length}/${users.length}`)
      res.status(200).json(response);
    },
    getById: async (req: Request, res: Response) => {
      const userId = parseInt(req.params.userId, 10);
      const userService = new UserService();

      const user = await userService.getUserById(userId);
      if (!user) {
        return res.status(404).send('User not found');
      }

      const response: GetUserByIdResponse = user as GetUserByIdResponse;
      res.status(200).json(response);
    },
    put: async (req: Request, res: Response) => {
      const userId = parseInt(req.params.userId, 10);
      const userService = new UserService();
      const userData: PutUserRequest = req.body;

      const updatedUser = await userService.updateUserById(userId, userData);
      if (!updatedUser) {
        return res.status(404).send('User not found');
      }

      const response: PutUserResponse = updatedUser as PutUserResponse;
      res.status(200).json(response);
    },
    delete: async (req: Request, res: Response) => {
      const userId = parseInt(req.params.userId, 10);
      const userService = new UserService();

      const deleted = await userService.deleteUserById(userId);
      if (!deleted) {
        return res.status(404).send('User not found');
      }

      res.status(204).send();
    },
  };
}
