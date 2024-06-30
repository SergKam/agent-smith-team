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

        const taskId = await this.taskRepository.createTask(task);

        if (task.relations && task.relations.length > 0) {
            await this.taskRepository.createTaskRelations(taskId, task.relations);
        }

        return { ...task, id: taskId };
    }
}
