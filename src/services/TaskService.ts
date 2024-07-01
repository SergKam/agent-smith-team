import { Task, TaskRelation } from '../models/Task';
import { TaskRepository } from '../repositories/TaskRepository';
import {UserNotFoundError, UserRepository} from '../repositories/UserRepository';

export class TaskService {
    private taskRepository = new TaskRepository();
    private userRepository = new UserRepository();

    async createTask(task: Task): Promise<Task> {
        if (task.assignedTo && !(await this.userRepository.userExists(task.assignedTo))) {
            throw new UserNotFoundError('Assigned user not found');
        }

        // Ensure all relations have defined relatedTaskId
        if (task.relations) {
            task.relations = task.relations.filter((relation): relation is TaskRelation => {
                return relation.relatedTaskId !== undefined && relation.relationType !== undefined;
            });
        }

        const taskId = await this.taskRepository.createTask(task);

        if (task.relations && task.relations.length > 0) {
            await this.taskRepository.createTaskRelations(taskId, task.relations);
        }

        return { ...task, id: taskId };
    }
}
