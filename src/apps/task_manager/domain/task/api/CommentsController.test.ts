import request from 'supertest';
import { cleanupDb, pool } from '../../../database/db';
import { TaskStatus } from '../models/TaskStatus';
import { TaskType } from '../models/TaskType';
import { TaskPriority } from '../models/TaskPriority';
import app from '../../../server';

beforeAll(async () => {
  await cleanupDb();
});

afterAll(async () => {
  await cleanupDb();
});

describe('GET /tasks/:taskId/comments', () => {
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

    await pool.query(
      `
      INSERT INTO comments (taskId, userId, content)
      VALUES (?, ?, ?)
    `,
      [taskId, userId, 'This is a test comment'],
    );
  });

  afterEach(async () => {
    await cleanupDb();
  });

  it('should return comments for a specific task', async () => {
    const response = await request(app)
      .get(`/v1/tasks/${taskId}/comments`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty(
      'content',
      'This is a test comment',
    );
  });

  it('should return an empty array if no comments exist for the task', async () => {
    await pool.query('DELETE FROM comments');

    const response = await request(app)
      .get(`/v1/tasks/${taskId}/comments`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(0);
  });
});
