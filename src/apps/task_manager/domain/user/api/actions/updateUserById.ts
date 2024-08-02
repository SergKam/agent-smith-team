import { Request, Response } from 'express';
import { paths } from '../../../../types/api-types';
import { UserService } from '../../services/UserService';

type PutUserRequest = paths['/users/{userId}']['put']['requestBody']['content']['application/json'];
type PutUserResponse = paths['/users/{userId}']['put']['responses']['200']['content']['application/json'];

export const updateUserById = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10);
  const userService = new UserService();
  const userData: PutUserRequest = req.body;

  const updatedUser = await userService.updateUserById(userId, userData);
  if (!updatedUser) {
    return res.status(404).send('User not found');
  }

  const response: PutUserResponse = updatedUser as PutUserResponse;
  res.status(200).json(response);
};
