import { Request, Response } from "express";
import { paths } from "../../../../types/api-types";
import { UserService } from "../../services/UserService";
import { User } from "../../models/User";
import wLogger from "../../../../middleware/logger";

type PostUserRequest =
  paths["/users"]["post"]["requestBody"]["content"]["application/json"];
type PostUserResponse =
  paths["/users"]["post"]["responses"]["201"]["content"]["application/json"];

export const createUser = async (req: Request, res: Response) => {
  try {
    const body: PostUserRequest = req.body;

    if (body.name.trim() === "") {
      return res.status(400).json({ error: "Name cannot be empty" });
    }

    const userService = new UserService();

    const user: User = { id: 0, name: body.name.trim() };
    const createdUser = await userService.createUser(user);
    const response: PostUserResponse = createdUser as PostUserResponse;
    wLogger.info("User created successfully", { user: response });
    res.status(201).json(response);
  } catch (error) {
    wLogger.error("Error in createUser:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
