import request from "supertest";
import app from "../../../server";
import { cleanupDb, pool } from "../../../database/db";
import { TaskStatus } from "../models/TaskStatus";
import { TaskType } from "../models/TaskType";
import { TaskPriority } from "../models/TaskPriority";

beforeAll(async () => {
  await cleanupDb();
});

afterAll(async () => {
  await cleanupDb();
});

describe("GET /tasks/:taskId", () => {
  let taskId: number;

  beforeEach(async () => {
    const [result] = await pool.query(`
      INSERT INTO tasks (title, description, status, type, priority)
      VALUES ('Test Task', 'This is a test task', '${TaskStatus.PENDING}', '${TaskType.TASK}', '${TaskPriority.MEDIUM}')
    `);
    taskId = (result as any).insertId;
  });

  afterEach(async () => {
    await cleanupDb();
  });

  it("should return the task if it exists", async () => {
    const response = await request(app).get(`/v1/tasks/${taskId}`).expect(200);

    expect(response.body).toHaveProperty("id", taskId);
    expect(response.body).toHaveProperty("title", "Test Task");
  });

  it("should return 404 if the task does not exist", async () => {
    const response = await request(app).get("/v1/tasks/9999").expect(404);

    expect(response.text).toBe("Task not found");
  });
});

describe("PUT /tasks/:taskId", () => {
  let taskId: number;

  beforeEach(async () => {
    await cleanupDb();
    const [result] = await pool.query(`
      INSERT INTO tasks (title, description, status, type, priority)
      VALUES ('Test Task', 'This is a test task', '${TaskStatus.PENDING}', '${TaskType.TASK}', '${TaskPriority.MEDIUM}')
    `);
    taskId = (result as any).insertId;
  });

  afterEach(async () => {
    await cleanupDb();
  });

  it("should update the task if it exists", async () => {
    const updatedTask = {
      title: "Updated Task",
      description: "This is an updated test task",
      status: TaskStatus.IN_PROGRESS,
      type: TaskType.STORY,
      priority: TaskPriority.HIGH,
    };

    const response = await request(app)
      .put(`/v1/tasks/${taskId}`)
      .send(updatedTask)
      .expect(200);

    expect(response.body).toHaveProperty("id", taskId);
    expect(response.body).toMatchObject(updatedTask);
  });

  it("should return 404 if the task does not exist", async () => {
    const updatedTask = {
      title: "Updated Task",
      description: "This is an updated test task",
      status: TaskStatus.IN_PROGRESS,
      type: TaskType.STORY,
      priority: TaskPriority.HIGH,
    };

    const response = await request(app)
      .put("/v1/tasks/9999")
      .send(updatedTask)
      .expect(404);

    expect(response.text).toBe("Task not found");
  });

  it("should return 400 if assigned user does not exist", async () => {
    const updatedTask = {
      title: "Updated Task",
      description: "This is an updated test task",
      status: TaskStatus.IN_PROGRESS,
      type: TaskType.STORY,
      priority: TaskPriority.HIGH,
      assignedTo: 9999,
    };

    const response = await request(app)
      .put(`/v1/tasks/${taskId}`)
      .send(updatedTask)
      .expect(400);

    expect(response.body).toHaveProperty("error", "Assigned user not found");
  });
});

describe("DELETE /tasks/:taskId", () => {
  let taskId: number;

  beforeEach(async () => {
    await cleanupDb();
    const [result] = await pool.query(`
      INSERT INTO tasks (title, description, status, type, priority)
      VALUES ('Test Task', 'This is a test task', '${TaskStatus.PENDING}', '${TaskType.TASK}', '${TaskPriority.MEDIUM}')
    `);
    taskId = (result as any).insertId;
  });

  afterEach(async () => {
    await cleanupDb();
  });

  it("should delete the task if it exists", async () => {
    await request(app).delete(`/v1/tasks/${taskId}`).expect(204);

    const response = await request(app).get(`/v1/tasks/${taskId}`).expect(404);

    expect(response.text).toBe("Task not found");
  });

  it("should return 404 if the task does not exist", async () => {
    const response = await request(app).delete("/v1/tasks/9999").expect(404);

    expect(response.text).toBe("Task not found");
  });
});
