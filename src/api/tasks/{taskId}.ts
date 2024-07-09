import { Request, Response } from 'express';
import { TaskService } from '../../services/TaskService';
import { UserNotFoundError } from '../../repositories/UserRepository';

export default function() {
    return {
        get: async (req: Request, res: Response, next: Function) => {
            const taskId = parseInt(req.params.taskId, 10);
            const taskService = new TaskService();

            const task = await taskService.getTaskById(taskId);
            if (task) {
                res.status(200).json(task);
            } else {
                res.status(404).send('Task not found');
            }
        },
        put: async (req: Request, res: Response, next: Function) => {
            const taskId = parseInt(req.params.taskId, 10);
            const taskService = new TaskService();
            const taskData = req.body;

            try {
                const updatedTask = await taskService.updateTaskById(taskId, taskData);
                if (updatedTask) {
                    res.status(200).json(updatedTask);
                } else {
                    res.status(404).send('Task not found');
                }
            } catch (error: any) {
                if (error instanceof UserNotFoundError) {
                    res.status(400).json({ error: error.message });
                } else {
                    next(error);
                }
            }
        },
        delete: async (req: Request, res: Response, next: Function) => {
            const taskId = parseInt(req.params.taskId, 10);
            const taskService = new TaskService();

            const deleted = await taskService.deleteTaskById(taskId);
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).send('Task not found');
            }
        }
    };
}
