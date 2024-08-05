import { TaskRepository } from "../repositories/TaskRepository";
import { getConnection } from "../../../database/db";
import { Task, TaskRelation } from "../models/Task";
import { TaskStatus } from "../models/TaskStatus";
import { TaskType } from "../models/TaskType";
import { TaskPriority } from "../models/TaskPriority";
import { TaskRelationType } from "../models/TaskRelationType";

jest.mock("../../../database/db");

const mockGetConnection = getConnection as jest.MockedFunction<
  typeof getConnection
>;

const mockConnection = {
  execute: jest.fn(),
  release: jest.fn(),
};

mockGetConnection.mockResolvedValue(mockConnection as any);

const taskRepository = new TaskRepository();

beforeEach(() => {
  jest.clearAllMocks();
});

describe("TaskRepository", () => {
  describe("createTask", () => {
    it("should create a new task", async () => {
      const task: Task = {
        title: "Test Task",
        status: TaskStatus.PENDING,
        type: TaskType.TASK,
        priority: TaskPriority.MEDIUM,
      };

      mockConnection.execute.mockResolvedValue([{ insertId: 1 }]);

      const result = await taskRepository.createTask(task);

      expect(result).toBe(1);
      expect(mockConnection.execute).toHaveBeenCalledWith(
        "INSERT INTO tasks (title, description, status, type, priority, assignedTo) VALUES (?, ?, ?, ?, ?, ?)",
        [
          task.title,
          task.description || null,
          task.status,
          task.type,
          task.priority,
          task.assignedTo || null,
        ]
      );
    });
  });

  describe("createTaskRelations", () => {
    it("should create task relations", async () => {
      const relations: TaskRelation[] = [
        { relatedTaskId: 2, relationType: TaskRelationType.CHILD },
      ];

      mockConnection.execute.mockResolvedValue([{}]);

      await taskRepository.createTaskRelations(1, relations);

      expect(mockConnection.execute).toHaveBeenCalledWith(
        "INSERT INTO task_relations (taskId, relatedTaskId, relationType) VALUES (?, ?, ?)",
        [1, 2, TaskRelationType.CHILD]
      );
    });
  });

  describe("getTaskById", () => {
    it("should return a task by ID", async () => {
      const task: Task = {
        id: 1,
        title: "Test Task",
        status: TaskStatus.PENDING,
        type: TaskType.TASK,
        priority: TaskPriority.MEDIUM,
      };

      mockConnection.execute.mockResolvedValue([[task]]);

      const result = await taskRepository.getTaskById(1);

      expect(result).toEqual(task);
      expect(mockConnection.execute).toHaveBeenCalledWith(
        "SELECT * FROM tasks WHERE id = ?",
        [1]
      );
    });

    it("should return null if task does not exist", async () => {
      mockConnection.execute.mockResolvedValue([[]]);

      const result = await taskRepository.getTaskById(9999);

      expect(result).toBeNull();
      expect(mockConnection.execute).toHaveBeenCalledWith(
        "SELECT * FROM tasks WHERE id = ?",
        [9999]
      );
    });
  });

  describe("getAllTasks", () => {
    it("should return all tasks", async () => {
      const tasks: Task[] = [
        {
          id: 1,
          title: "Test Task 1",
          status: TaskStatus.PENDING,
          type: TaskType.TASK,
          priority: TaskPriority.MEDIUM,
        },
        {
          id: 2,
          title: "Test Task 2",
          status: TaskStatus.IN_PROGRESS,
          type: TaskType.STORY,
          priority: TaskPriority.HIGH,
        },
      ];

      mockConnection.execute.mockResolvedValue([tasks]);

      const result = await taskRepository.getAllTasks();

      expect(result).toEqual(tasks);
      expect(mockConnection.execute).toHaveBeenCalledWith(
        "SELECT * FROM tasks"
      );
    });
  });

  describe("updateTaskById", () => {
    it("should update a task by ID", async () => {
      const taskData: Partial<Task> = {
        title: "Updated Task",
        status: TaskStatus.IN_PROGRESS,
      };

      mockConnection.execute.mockResolvedValue([{}]);

      await taskRepository.updateTaskById(1, taskData);

      expect(mockConnection.execute).toHaveBeenCalledWith(
        "UPDATE tasks SET title = ?, description = ?, status = ?, type = ?, priority = ?, assignedTo = ? WHERE id = ?",
        [
          taskData.title,
          taskData.description || null,
          taskData.status,
          taskData.type,
          taskData.priority,
          taskData.assignedTo || null,
          1,
        ]
      );
    });
  });

  describe("deleteTaskById", () => {
    it("should delete a task by ID", async () => {
      mockConnection.execute.mockResolvedValue([{}]);

      await taskRepository.deleteTaskById(1);

      expect(mockConnection.execute).toHaveBeenCalledWith(
        "DELETE FROM tasks WHERE id = ?",
        [1]
      );
    });
  });
});
