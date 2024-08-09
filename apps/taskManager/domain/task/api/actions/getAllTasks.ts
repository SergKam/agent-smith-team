import { Request, Response } from "express";
import { paths } from "../../../../types/api-types";
import { TaskService } from "../../services/TaskService";

type GetTasksResponse =
  paths["/tasks"]["get"]["responses"]["200"]["content"]["application/json"];

export const getAllTasks = async (req: Request, res: Response) => {
  const taskService = new TaskService();

  const tasks = await taskService.getAllTasks();
  const response: GetTasksResponse = tasks as GetTasksResponse;
  res.header("Content-Range", `tasks 0-${tasks.length}/${tasks.length}`);
  res.status(200).json(response);
};