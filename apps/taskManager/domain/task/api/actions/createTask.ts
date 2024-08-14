import { Request, Response } from "express";
import { paths } from "../../../../types/api-types";
import { UserNotFoundError } from "../../../user/repositories/UserRepository";
import { TaskStatus } from "../../models/TaskStatus";
import { TaskType } from "../../models/TaskType";
import { TaskPriority } from "../../models/TaskPriority";
import { TaskRelationType } from "../../models/TaskRelationType";
import { TaskService } from "../../services/TaskService";

type PostTaskRequest =
  paths["/tasks"]["post"]["requestBody"]["content"]["application/json"];
type PostTaskResponse =
  paths["/tasks"]["post"]["responses"]["201"]["content"]["application/json"];

export const createTask = async (req: Request, res: Response) => {
  const body: PostTaskRequest = req.body;
  const taskService = new TaskService();

  try {
    const createdTask = await taskService.createTask({
      ...body,
      status: body.status as TaskStatus,
      type: body.type as TaskType,
      priority: body.priority as TaskPriority,
      relations: body.relations?.map((relation) => ({
        ...relation,
        relationType: relation.relationType as TaskRelationType,
      })),
    });
    const response: PostTaskResponse = createdTask as PostTaskResponse;
    res.status(201).json(response);
  } catch (error: any) {
    if (error instanceof UserNotFoundError) {
      return res.status(400).json({ error: error.message });
    }

    throw error;
  }
};
