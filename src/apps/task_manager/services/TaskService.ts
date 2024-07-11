import { Task, TaskRelation } from '../models/Task';
import { TaskRepository } from '../repositories/TaskRepository';
import {
  UserRepository,
  UserNotFoundError,
} from '../repositories/UserRepository';
import { TaskStatus } from '../models/TaskStatus';
import { TaskType } from '../models/TaskType';
import { TaskPriority } from '../models/TaskPriority';
import { TaskRelationType } from '../models/TaskRelationType';

export class TaskService {
  private taskRepository: TaskRepository;
  private userRepository: UserRepository;

  constructor(
    taskRepository: TaskRepository = new TaskRepository(),
    userRepository: UserRepository = new UserRepository(),
  ) {
    this.taskRepository = taskRepository;
    this.userRepository = userRepository;
  }

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    if (task.assignedTo) {
      const userExists = await this.userRepository.userExists(task.assignedTo);
      if (!userExists) {
        throw new UserNotFoundError('Assigned user not found');
      }
    }

    // Ensure all relations have defined relatedTaskId and relationType
    const validRelations = (task.relations || []).filter(
      (relation): relation is TaskRelation => {
        return (
          relation.relatedTaskId !== undefined &&
          relation.relationType !== undefined
        );
      },
    );

    const taskId = await this.taskRepository.createTask({
      ...task,
      status: task.status as TaskStatus,
      type: task.type as TaskType,
      priority: task.priority as TaskPriority,
    });

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

  async updateTaskById(
    taskId: number,
    taskData: Partial<Task>,
  ): Promise<Task | null> {
    const existingTask = await this.taskRepository.getTaskById(taskId);
    if (!existingTask) {
      return null;
    }

    if (taskData.assignedTo) {
      const userExists = await this.userRepository.userExists(
        taskData.assignedTo,
      );
      if (!userExists) {
        throw new UserNotFoundError('Assigned user not found');
      }
    }

    const updatedTask = { ...existingTask, ...taskData };
    await this.taskRepository.updateTaskById(taskId, {
      ...updatedTask,
      status: updatedTask.status as TaskStatus,
      type: updatedTask.type as TaskType,
      priority: updatedTask.priority as TaskPriority,
    });

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
