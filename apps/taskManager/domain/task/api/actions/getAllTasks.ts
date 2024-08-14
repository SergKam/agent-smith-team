import { Request, Response } from "express";
import { paths } from "../../../../types/api-types";
import { TaskService } from "../../services/TaskService";
import { Task } from "../../models/Task";

type GetTasksResponse =
  paths["/tasks"]["get"]["responses"]["200"]["content"]["application/json"];

export const getAllTasks = async (req: Request, res: Response) => {
  const taskService = new TaskService();

  const filters = req.query.filter ? JSON.parse(req.query.filter as string) : {};
  const tasks = await taskService.getAllTasks(filters as Partial<Task>);
  const response: GetTasksResponse = tasks as GetTasksResponse;
  res.header("Content-Range", `tasks 0-${tasks.length}/${tasks.length}`);
  res.status(200).json(response);
};