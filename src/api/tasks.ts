import { Request, Response } from 'express';
import { paths } from '../types/api-types';
import { TaskService } from '../services/TaskService';
import {UserNotFoundError} from "../repositories/UserRepository";

type PostTaskRequest = paths['/tasks']['post']['requestBody']['content']['application/json'];
type PostTaskResponse = paths['/tasks']['post']['responses']['201']['content']['application/json'];
type GetTasksResponse = paths['/tasks']['get']['responses']['200']['content']['application/json'];

export default function() {
    return {
        post: async (req: Request, res: Response) => {
            const body: PostTaskRequest = req.body;
            const taskService = new TaskService();

            try {
                const createdTask = await taskService.createTask(body);
                const response: PostTaskResponse = createdTask as PostTaskResponse;
                res.status(201).json(response);
            } catch (error: any) {
                console.error('Error creating task:', error);
                if (error.message === 'Assigned user not found') {
                    res.status(400).json({ error: error.message });
                } else {
                    res.status(500).send('Internal Server Error');
                }
            }
        },
        get: async (req: Request, res: Response) => {
            const taskService = new TaskService();

            try {
                const tasks = await taskService.getAllTasks();
                const response: GetTasksResponse = tasks as GetTasksResponse;
                res.status(200).json(response);
            } catch (error) {
                console.error('Error getting tasks:', error);
                res.status(500).send('Internal Server Error');
            }
        }
    };
}
