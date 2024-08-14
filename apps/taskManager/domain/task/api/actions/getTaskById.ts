import { Request, Response } from "express";
import { paths } from "../../../../types/api-types";
import { TaskService } from "../../services/TaskService";

type GetTaskByIdResponse =
  paths["/tasks/{taskId}"]["get"]["responses"]["200"]["content"]["application/json"];

export const getTaskById = async (req: Request, res: Response) => {
  const taskId = parseInt(req.params.taskId, 10);
  const taskService = new TaskService();

  const task = await taskService.getTaskById(taskId);
  if (!task) {
    return res.status(404).send("Task not found");
  }

  const response: GetTaskByIdResponse = task as GetTaskByIdResponse;
  res.status(200).json(response);
};