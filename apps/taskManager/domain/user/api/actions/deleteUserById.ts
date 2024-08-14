import { Request, Response } from "express";
import { UserService } from "../../services/UserService";

export const deleteUserById = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10);
  const userService = new UserService();

  const deleted = await userService.deleteUserById(userId);
  if (!deleted) {
    return res.status(404).send("User not found");
  }

  res.status(204).send();
};
