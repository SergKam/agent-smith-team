import { Request, Response } from 'express';
import { TaskService } from '../../services/TaskService';
import { UserNotFoundError } from '../../repositories/UserRepository';

export default function() {
    return {
        get: async (req: Request, res: Response) => {
            const taskId = parseInt(req.params.taskId, 10);
            const taskService = new TaskService();

            const task = await taskService.getTaskById(taskId);
            if (!task) {
                return res.status(404).send('Task not found');
            }

            res.status(200).json(task);
        },
        put: async (req: Request, res: Response) => {
            const taskId = parseInt(req.params.taskId, 10);
            const taskService = new TaskService();
            const taskData = req.body;

            try {
                const updatedTask = await taskService.updateTaskById(taskId, taskData);
                if (!updatedTask) {
                    return res.status(404).send('Task not found');
                }

                res.status(200).json(updatedTask);

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
        }
    };
}
