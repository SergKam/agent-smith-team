import { Request, Response } from 'express';
import { TaskService } from '../../services/TaskService';

export default function() {
    return {
        get: async (req: Request, res: Response) => {
            const taskId = parseInt(req.params.taskId, 10);
            const taskService = new TaskService();

            try {
                const task = await taskService.getTaskById(taskId);
                if (task) {
                    res.status(200).json(task);
                } else {
                    res.status(404).send('Task not found');
                }
            } catch (error) {
                console.error('Error getting task:', error);
                res.status(500).send('Internal Server Error');
            }
        },
        put: async (req: Request, res: Response) => {
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
                console.error('Error updating task:', error);
                if (error.message === 'Assigned user not found') {
                    res.status(400).json({ error: error.message });
                } else {
                    res.status(500).send('Internal Server Error');
                }
            }
        },
        delete: async (req: Request, res: Response) => {
            res.send('Response from DELETE /tasks');
        }
    };
}
