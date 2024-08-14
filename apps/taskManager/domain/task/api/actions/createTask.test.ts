import request from "supertest";
import app from "../../../../server";
import { TaskStatus } from "../../models/TaskStatus";
import { TaskType } from "../../models/TaskType";
import { TaskPriority } from "../../models/TaskPriority";
import { cleanupDb } from "../../../../database/db";

beforeAll(async () => {
  await cleanupDb();
});

afterAll(async () => {
  await cleanupDb();
});

describe("POST /tasks", () => {
  it("should create a new task", async () => {
    const newTask = {
      title: "Test Task",
      description: "This is a test task",
      status: TaskStatus.PENDING,
      type: TaskType.TASK,
      priority: TaskPriority.MEDIUM,
    };

    const response = await request(app)
      .post("/v1/tasks")
      .send(newTask)
      .expect(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toMatchObject({
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
      type: newTask.type,
      priority: newTask.priority,
    });
  });

  it("should return 400 if assigned user does not exist", async () => {
    const newTask = {
      title: "Test Task",
      description: "This is a test task",
      status: TaskStatus.PENDING,
      type: TaskType.TASK,
      priority: TaskPriority.MEDIUM,
      assignedTo: 9999,
    };

    const response = await request(app)
      .post("/v1/tasks")
      .send(newTask)
      .expect(400);

    expect(response.body).toHaveProperty("error", "Assigned user not found");
  });
});
