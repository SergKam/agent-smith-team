import request from "supertest";
import { cleanupDb, pool } from "../../../../database/db";
import app from "../../../../server";
import { TaskStatus } from "../../models/TaskStatus";
import { TaskType } from "../../models/TaskType";
import { TaskPriority } from "../../models/TaskPriority";

beforeAll(async () => {
  await cleanupDb();
});

afterAll(async () => {
  await cleanupDb();
});

describe("POST /comments", () => {
  let taskId: number;
  let userId: number;

  beforeEach(async () => {
    await cleanupDb();
    const [userResult] = await pool.query(`
      INSERT INTO users (name)
      VALUES ('Test User')
    `);
    userId = (userResult as any).insertId;

    const [taskResult] = await pool.query(`
      INSERT INTO tasks (title, description, status, type, priority)
      VALUES ('Test Task', 'This is a test task', '${TaskStatus.PENDING}', '${TaskType.TASK}', '${TaskPriority.MEDIUM}')
    `);
    taskId = (taskResult as any).insertId;
  });

  afterEach(async () => {
    await cleanupDb();
  });

  it("should add a comment to a task", async () => {
    const commentData = {
      taskId,
      userId,
      content: "This is a new test comment",
    };

    const response = await request(app)
      .post("/v1/comments")
      .send(commentData)
      .expect(201);

    expect(response.body).toHaveProperty("content", "This is a new test comment");
    expect(response.body).toHaveProperty("taskId", taskId);
    expect(response.body).toHaveProperty("userId", userId);
  });

  it("should return 400 if required fields are missing", async () => {
    const commentData = {
      userId,
      content: "This is a new test comment",
    };

    await request(app)
      .post("/v1/comments")
      .send(commentData)
      .expect(400);
  });
});
