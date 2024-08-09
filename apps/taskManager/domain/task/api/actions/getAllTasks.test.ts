import request from "supertest";
import app from "../../../../server";
import { TaskStatus } from "../../models/TaskStatus";
import { TaskType } from "../../models/TaskType";
import { TaskPriority } from "../../models/TaskPriority";
import { pool } from "../../../../database/db";

beforeEach(async () => {
  await pool.query("DELETE FROM task_relations");
  await pool.query("DELETE FROM tasks");
  await pool.query(`
    INSERT INTO tasks (title, description, status, type, priority)
    VALUES 
      ('Task 1', 'Description 1', '${TaskStatus.PENDING}', '${TaskType.TASK}', '${TaskPriority.MEDIUM}'),
      ('Task 2', 'Description 2', '${TaskStatus.IN_PROGRESS}', '${TaskType.STORY}', '${TaskPriority.HIGH}')
  `);
});

describe("GET /tasks", () => {
  it("should return all tasks", async () => {
    const response = await request(app).get("/v1/tasks").expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("title", "Task 1");
    expect(response.body[1]).toHaveProperty("title", "Task 2");
  });

  it("should return an empty array when no tasks exist", async () => {
    await pool.query("DELETE FROM tasks");

    const response = await request(app).get("/v1/tasks").expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(0);
  });
});
