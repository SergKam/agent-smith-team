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
            res.send('Response from GET /tasks');
            // const taskId = req.params.taskId;
            // const taskService = new TaskService();
            //
            // try {
            //     const task = await taskService.getTask(taskId);
            //     if (task) {
            //         res.json(task);
            //     } else {
            //         res.status(404).send('Task not found');
            //     }
            // } catch (error) {
            //     console.error('Error getting task:', error);
            //     res.status(500).send('Internal Server Error');
            // }
        },

    };
}
