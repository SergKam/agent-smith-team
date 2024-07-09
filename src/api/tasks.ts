import { Request, Response } from 'express';
import { paths } from '../types/api-types';
import { TaskService } from '../services/TaskService';
import { UserNotFoundError } from '../repositories/UserRepository';



type PostTaskRequest = paths['/tasks']['post']['requestBody']['content']['application/json'];
type PostTaskResponse = paths['/tasks']['post']['responses']['201']['content']['application/json'];
type GetTasksResponse = paths['/tasks']['get']['responses']['200']['content']['application/json'];

export default function() {
    return {
        post: async (req: Request, res: Response, next: Function) => {
            const body: PostTaskRequest = req.body;
            const taskService = new TaskService();

            try {
                const createdTask = await taskService.createTask(body);
                const response: PostTaskResponse = createdTask as PostTaskResponse;
                res.status(201).json(response);
            } catch (error: any) {
                if (error instanceof UserNotFoundError) {
                    res.status(400).json({ error: error.message });
                } else {
                    next(error);
                }
            }
        },
        get: async (req: Request, res: Response, next: Function) => {
            const taskService = new TaskService();

            const tasks = await taskService.getAllTasks();
            const response: GetTasksResponse = tasks as GetTasksResponse;
            res.status(200).json(response);
        }
    };
}
