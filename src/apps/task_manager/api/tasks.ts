import { Request, Response } from 'express';
import { paths } from '../types/api-types';
import { TaskService } from '../services/TaskService';
import { UserNotFoundError } from '../repositories/UserRepository';

type PostTaskRequest =
  paths['/tasks']['post']['requestBody']['content']['application/json'];
type PostTaskResponse =
  paths['/tasks']['post']['responses']['201']['content']['application/json'];
type GetTasksResponse =
  paths['/tasks']['get']['responses']['200']['content']['application/json'];

type GetTaskByIdResponse =
  paths['/tasks/{taskId}']['get']['responses']['200']['content']['application/json'];
type PutTaskRequest =
  paths['/tasks/{taskId}']['put']['requestBody']['content']['application/json'];
type PutTaskResponse =
  paths['/tasks/{taskId}']['put']['responses']['200']['content']['application/json'];

type DeleteTaskResponse =
  paths['/tasks/{taskId}']['delete']['responses']['204']['content'];

export default function () {
  return {
    post: async (req: Request, res: Response) => {
      const body: PostTaskRequest = req.body;
      const taskService = new TaskService();

      try {
        const createdTask = await taskService.createTask(body);
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
      res.status(200).json(response);
    },
    getById: async (req: Request, res: Response) => {
      const taskId = parseInt(req.params.taskId, 10);
      const taskService = new TaskService();

      const task = await taskService.getTaskById(taskId);
      if (!task) {
        return res.status(404).send('Task not found');
      }

      const response: GetTaskByIdResponse = task as GetTaskByIdResponse;
      res.status(200).json(response);
    },
    put: async (req: Request, res: Response) => {
      const taskId = parseInt(req.params.taskId, 10);
      const taskService = new TaskService();
      const taskData: PutTaskRequest = req.body;

      try {
        const updatedTask = await taskService.updateTaskById(taskId, taskData);
        if (!updatedTask) {
          return res.status(404).send('Task not found');
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
        return res.status(404).send('Task not found');
      }

      res.status(204).send();
    },
  };
}
