import { Request, Response } from "express";
import { TaskService } from "../../services/TaskService";
import { paths } from "../../../../types/api-types";

type DeleteTaskResponse =
  paths["/tasks/{taskId}"]["delete"]["responses"]["204"]["content"];

export const deleteTaskById = async (req: Request, res: Response) => {
  const taskId = parseInt(req.params.taskId, 10);
  const taskService = new TaskService();

  const deleted = await taskService.deleteTaskById(taskId);
  if (!deleted) {
    return res.status(404).send("Task not found");
  }

  res.status(204).send();
};
