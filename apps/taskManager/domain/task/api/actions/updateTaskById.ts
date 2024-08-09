import { Request, Response } from "express";
import { paths } from "../../../../types/api-types";
import { TaskService } from "../../services/TaskService";
import { UserNotFoundError } from "../../../user/repositories/UserRepository";
import { TaskStatus } from "../../models/TaskStatus";
import { TaskType } from "../../models/TaskType";
import { TaskPriority } from "../../models/TaskPriority";
import { TaskRelationType } from "../../models/TaskRelationType";

type PutTaskRequest =
  paths["/tasks/{taskId}"]["put"]["requestBody"]["content"]["application/json"];
type PutTaskResponse =
  paths["/tasks/{taskId}"]["put"]["responses"]["200"]["content"]["application/json"];

export const updateTaskById = async (req: Request, res: Response) => {
  const taskId = parseInt(req.params.taskId, 10);
  const taskService = new TaskService();
  const taskData: PutTaskRequest = req.body;

  try {
    const updatedTask = await taskService.updateTaskById(taskId, {
      ...taskData,
      status: taskData.status as TaskStatus,
      type: taskData.type as TaskType,
      priority: taskData.priority as TaskPriority,
      relations: taskData.relations?.map((relation) => ({
        ...relation,
        relationType: relation.relationType as TaskRelationType,
      })),
    });
    if (!updatedTask) {
      return res.status(404).send("Task not found");
    }

    const response: PutTaskResponse = updatedTask as PutTaskResponse;
    res.status(200).json(response);
  } catch (error: any) {
    if (error instanceof UserNotFoundError) {
      return res.status(400).json({ error: error.message });
    }

    throw error;
  }
};