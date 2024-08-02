import { Request, Response } from "express";
import { paths } from "../../../../types/api-types";
import { UserService } from "../../services/UserService";

type GetUsersResponse =
  paths["/users"]["get"]["responses"]["200"]["content"]["application/json"];

export const getAllUsers = async (req: Request, res: Response) => {
  const userService = new UserService();

  const users = await userService.getAllUsers();
  const response: GetUsersResponse = users as GetUsersResponse;
  res.header("Content-Range", `users 0-${users.length}/${users.length}`);
  res.status(200).json(response);
};
