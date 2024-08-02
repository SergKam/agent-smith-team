import { Request, Response } from "express";
import { paths } from "../../../types/api-types";
import { TaskService } from "../services/TaskService";
import { UserNotFoundError } from "../../user/repositories/UserRepository";
import { TaskStatus } from "../models/TaskStatus";
import { TaskType } from "../models/TaskType";
import { TaskPriority } from "../models/TaskPriority";
import { TaskRelationType } from "../models/TaskRelationType";

// Define types for request and response bodies

type PostTaskRequest =
  paths["/tasks"]["post"]["requestBody"]["content"]["application/json"];
type PostTaskResponse =
  paths["/tasks"]["post"]["responses"]["201"]["content"]["application/json"];
type GetTasksResponse =
  paths["/tasks"]["get"]["responses"]["200"]["content"]["application/json"];

type GetTaskByIdResponse =
  paths["/tasks/{taskId}"]["get"]["responses"]["200"]["content"]["application/json"];
type PutTaskRequest =
  paths["/tasks/{taskId}"]["put"]["requestBody"]["content"]["application/json"];
type PutTaskResponse =
  paths["/tasks/{taskId}"]["put"]["responses"]["200"]["content"]["application/json"];

type DeleteTaskResponse =
  paths["/tasks/{taskId}"]["delete"]["responses"]["204"]["content"];

export default function () {
  return {
    post: async (req: Request, res: Response) => {
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
    },
    get: async (req: Request, res: Response) => {
      const taskService = new TaskService();

      const tasks = await taskService.getAllTasks();
      const response: GetTasksResponse = tasks as GetTasksResponse;
      res.header("Content-Range", `tasks 0-${tasks.length}/${tasks.length}`);
      res.status(200).json(response);
    },
    getById: async (req: Request, res: Response) => {
      const taskId = parseInt(req.params.taskId, 10);
      const taskService = new TaskService();

      const task = await taskService.getTaskById(taskId);
      if (!task) {
        return res.status(404).send("Task not found");
      }

      const response: GetTaskByIdResponse = task as GetTaskByIdResponse;
      res.status(200).json(response);
    },
    put: async (req: Request, res: Response) => {
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
    },
    delete: async (req: Request, res: Response) => {
      const taskId = parseInt(req.params.taskId, 10);
      const taskService = new TaskService();

      const deleted = await taskService.deleteTaskById(taskId);
      if (!deleted) {
        return res.status(404).send("Task not found");
      }

      res.status(204).send();
    },
  };
}
