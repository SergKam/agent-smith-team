import { Request, Response } from 'express';
import { paths } from '../../types/api-types';
import { TaskService } from '../../services/TaskService';

type PostTaskRequest = paths['/tasks']['post']['requestBody']['content']['application/json'];
type PostTaskResponse = paths['/tasks']['post']['responses']['201']['content']['application/json'];

export default function() {
    return {
        post: async (req: Request, res: Response) => {
            const body: PostTaskRequest = req.body;
            const taskService = new TaskService();

            try {
                const createdTask = await taskService.createTask(body);
                const response: PostTaskResponse = createdTask;
                res.status(201).json(response);
            } catch (error) {
                console.error('Error creating task:', error);
                res.status(500).send('Internal Server Error');
            }
        }
    };
}
