import request from "supertest";
import app from "../../../../server";
import { TaskStatus } from "../../models/TaskStatus";
import { TaskType } from "../../models/TaskType";
import { TaskPriority } from "../../models/TaskPriority";
import { pool } from "../../../../database/db";

let taskId: number;

beforeEach(async () => {
  const [result] = await pool.query(`
    INSERT INTO tasks (title, description, status, type, priority)
    VALUES ('Test Task', 'This is a test task', '${TaskStatus.PENDING}', '${TaskType.TASK}', '${TaskPriority.MEDIUM}')
  `);
  taskId = (result as any).insertId;
});

afterEach(async () => {
  await pool.query("DELETE FROM comments");
  await pool.query("DELETE FROM task_relations");
  await pool.query("DELETE FROM tasks");
});

describe("GET /tasks/:taskId", () => {
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
