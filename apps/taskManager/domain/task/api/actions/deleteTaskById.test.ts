import request from "supertest";
import app from "../../../../server";
import { TaskStatus } from "../../models/TaskStatus";
import { TaskType } from "../../models/TaskType";
import { TaskPriority } from "../../models/TaskPriority";
import { cleanupDb, pool } from "../../../../database/db";

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

describe("DELETE /tasks/:taskId", () => {
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
