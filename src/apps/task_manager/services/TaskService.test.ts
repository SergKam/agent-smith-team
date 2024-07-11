import { TaskService } from './TaskService';
import { TaskRepository } from '../repositories/TaskRepository';
import {
  UserRepository,
  UserNotFoundError,
} from '../repositories/UserRepository';
import { Task, TaskRelation } from '../models/Task';
import { TaskStatus } from '../models/TaskStatus';
import { TaskType } from '../models/TaskType';
import { TaskPriority } from '../models/TaskPriority';

jest.mock('../repositories/TaskRepository');
jest.mock('../repositories/UserRepository');

const mockTaskRepository = new TaskRepository() as jest.Mocked<TaskRepository>;
const mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;

const taskService = new TaskService(mockTaskRepository, mockUserRepository);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TaskService', () => {
  describe('createTask', () => {
    it('should create a new task', async () => {
      const task: Task = {
        title: 'Test Task',
        status: TaskStatus.PENDING,
        type: TaskType.TASK,
        priority: TaskPriority.MEDIUM,
      };

      mockTaskRepository.createTask.mockResolvedValue(1);

      const result = await taskService.createTask(task);

      expect(result).toEqual({ ...task, id: 1, relations: [] });
      expect(mockTaskRepository.createTask).toHaveBeenCalledWith(task);
    });

    it('should throw UserNotFoundError if assigned user does not exist', async () => {
      const task: Task = {
        title: 'Test Task',
        status: TaskStatus.PENDING,
        type: TaskType.TASK,
        priority: TaskPriority.MEDIUM,
        assignedTo: 9999,
      };

      mockUserRepository.userExists.mockResolvedValue(false);

      await expect(taskService.createTask(task)).rejects.toBeInstanceOf(
        UserNotFoundError,
      );
    });
  });

  describe('getTaskById', () => {
    it('should return a task by ID', async () => {
      const task: Task = {
        id: 1,
        title: 'Test Task',
        status: TaskStatus.PENDING,
        type: TaskType.TASK,
        priority: TaskPriority.MEDIUM,
      };

      mockTaskRepository.getTaskById.mockResolvedValue(task);

      const result = await taskService.getTaskById(1);

      expect(result).toEqual(task);
      expect(mockTaskRepository.getTaskById).toHaveBeenCalledWith(1);
    });

    it('should return null if task does not exist', async () => {
      mockTaskRepository.getTaskById.mockResolvedValue(null);

      const result = await taskService.getTaskById(9999);

      expect(result).toBeNull();
      expect(mockTaskRepository.getTaskById).toHaveBeenCalledWith(9999);
    });
  });

  describe('getAllTasks', () => {
    it('should return all tasks', async () => {
      const tasks: Task[] = [
        {
          id: 1,
          title: 'Test Task 1',
          status: TaskStatus.PENDING,
          type: TaskType.TASK,
          priority: TaskPriority.MEDIUM,
        },
        {
          id: 2,
          title: 'Test Task 2',
          status: TaskStatus.IN_PROGRESS,
          type: TaskType.STORY,
          priority: TaskPriority.HIGH,
        },
      ];

      mockTaskRepository.getAllTasks.mockResolvedValue(tasks);

      const result = await taskService.getAllTasks();

      expect(result).toEqual(tasks);
      expect(mockTaskRepository.getAllTasks).toHaveBeenCalled();
    });
  });

  describe('updateTaskById', () => {
    it('should update a task by ID', async () => {
      const existingTask: Task = {
        id: 1,
        title: 'Test Task',
        status: TaskStatus.PENDING,
        type: TaskType.TASK,
        priority: TaskPriority.MEDIUM,
      };

      const updatedTaskData: Partial<Task> = {
        title: 'Updated Task',
        status: TaskStatus.IN_PROGRESS,
      };

      const updatedTask: Task = { ...existingTask, ...updatedTaskData };

      mockTaskRepository.getTaskById.mockResolvedValue(existingTask);
      mockTaskRepository.updateTaskById.mockResolvedValue();

      const result = await taskService.updateTaskById(1, updatedTaskData);

      expect(result).toEqual(updatedTask);
      expect(mockTaskRepository.getTaskById).toHaveBeenCalledWith(1);
      expect(mockTaskRepository.updateTaskById).toHaveBeenCalledWith(
        1,
        updatedTask,
      );
    });

    it('should return null if task does not exist', async () => {
      mockTaskRepository.getTaskById.mockResolvedValue(null);

      const result = await taskService.updateTaskById(9999, {
        title: 'Updated Task',
      });

      expect(result).toBeNull();
      expect(mockTaskRepository.getTaskById).toHaveBeenCalledWith(9999);
    });

    it('should throw UserNotFoundError if assigned user does not exist', async () => {
      const existingTask: Task = {
        id: 1,
        title: 'Test Task',
        status: TaskStatus.PENDING,
        type: TaskType.TASK,
        priority: TaskPriority.MEDIUM,
      };

      const updatedTaskData: Partial<Task> = {
        assignedTo: 9999,
      };

      mockTaskRepository.getTaskById.mockResolvedValue(existingTask);
      mockUserRepository.userExists.mockResolvedValue(false);

      await expect(
        taskService.updateTaskById(1, updatedTaskData),
      ).rejects.toBeInstanceOf(UserNotFoundError);
    });
  });

  describe('deleteTaskById', () => {
    it('should delete a task by ID', async () => {
      const existingTask: Task = {
        id: 1,
        title: 'Test Task',
        status: TaskStatus.PENDING,
        type: TaskType.TASK,
        priority: TaskPriority.MEDIUM,
      };

      mockTaskRepository.getTaskById.mockResolvedValue(existingTask);
      mockTaskRepository.deleteTaskById.mockResolvedValue();

      const result = await taskService.deleteTaskById(1);

      expect(result).toBe(true);
      expect(mockTaskRepository.getTaskById).toHaveBeenCalledWith(1);
      expect(mockTaskRepository.deleteTaskById).toHaveBeenCalledWith(1);
    });

    it('should return false if task does not exist', async () => {
      mockTaskRepository.getTaskById.mockResolvedValue(null);

      const result = await taskService.deleteTaskById(9999);

      expect(result).toBe(false);
      expect(mockTaskRepository.getTaskById).toHaveBeenCalledWith(9999);
    });
  });
});
