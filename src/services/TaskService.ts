import { Task, TaskRelation } from '../models/Task';
import { TaskRepository } from '../repositories/TaskRepository';
import { UserRepository } from '../repositories/UserRepository';

export class TaskService {
    private taskRepository = new TaskRepository();
    private userRepository = new UserRepository();

    async createTask(task: Task): Promise<Task> {
        if (task.assignedTo && !(await this.userRepository.userExists(task.assignedTo))) {
            throw new Error('Assigned user not found');
        }

        // Ensure all relations have defined relatedTaskId and relationType
        const validRelations = (task.relations || []).filter((relation): relation is TaskRelation => {
            return relation.relatedTaskId !== undefined && relation.relationType !== undefined;
        });

        const taskId = await this.taskRepository.createTask(task);

        if (validRelations.length > 0) {
            await this.taskRepository.createTaskRelations(taskId, validRelations);
        }

        return { ...task, id: taskId, relations: validRelations };
    }

    async getTaskById(taskId: number): Promise<Task | null> {
        return this.taskRepository.getTaskById(taskId);
    }

    async getAllTasks(): Promise<Task[]> {
        return this.taskRepository.getAllTasks();
    }

    async updateTaskById(taskId: number, taskData: Partial<Task>): Promise<Task | null> {
        const existingTask = await this.taskRepository.getTaskById(taskId);
        if (!existingTask) {
            return null;
        }

        if (taskData.assignedTo && !(await this.userRepository.userExists(taskData.assignedTo))) {
            throw new Error('Assigned user not found');
        }

        const updatedTask = { ...existingTask, ...taskData };
        await this.taskRepository.updateTaskById(taskId, updatedTask);

        return updatedTask;
    }

    async deleteTaskById(taskId: number): Promise<boolean> {
        const existingTask = await this.taskRepository.getTaskById(taskId);
        if (!existingTask) {
            return false;
        }

        await this.taskRepository.deleteTaskById(taskId);
        return true;
    }
}
