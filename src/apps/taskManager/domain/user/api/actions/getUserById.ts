import { Request, Response } from "express";
import { paths } from "../../../../types/api-types";
import { UserService } from "../../services/UserService";

type GetUserByIdResponse =
  paths["/users/{userId}"]["get"]["responses"]["200"]["content"]["application/json"];

export const getUserById = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10);
  const userService = new UserService();

  const user = await userService.getUserById(userId);
  if (!user) {
    return res.status(404).send("User not found");
  }

  const response: GetUserByIdResponse = user as GetUserByIdResponse;
  res.status(200).json(response);
};
