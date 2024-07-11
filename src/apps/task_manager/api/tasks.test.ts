import request from 'supertest';
import app from '../server';
import { cleanupDb, pool } from '../database/db';

beforeAll(async () => {
  await cleanupDb();
});

afterAll(async () => {
  await cleanupDb();
});

describe('POST /tasks', () => {
  it('should create a new task', async () => {
    const newTask = {
      title: 'Test Task',
      description: 'This is a test task',
      status: 'pending',
      type: 'task',
      priority: 'medium',
    };

    const response = await request(app)
      .post('/v1/tasks')
      .send(newTask)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toMatchObject({
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
      type: newTask.type,
      priority: newTask.priority,
    });
  });

  it('should return 400 if assigned user does not exist', async () => {
    const newTask = {
      title: 'Test Task',
      description: 'This is a test task',
      status: 'pending',
      type: 'task',
      priority: 'medium',
      assignedTo: 9999,
    };

    const response = await request(app)
      .post('/v1/tasks')
      .send(newTask)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Assigned user not found');
  });
});

describe('GET /tasks', () => {
  beforeEach(async () => {
    // Clear the tasks table and insert some test data
    await pool.query('DELETE FROM task_relations');
    await pool.query('DELETE FROM tasks');
    await pool.query(`
      INSERT INTO tasks (title, description, status, type, priority)
      VALUES 
        ('Task 1', 'Description 1', 'pending', 'task', 'medium'),
        ('Task 2', 'Description 2', 'in_progress', 'story', 'high')
    `);
  });

  it('should return all tasks', async () => {
    const response = await request(app).get('/v1/tasks').expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('title', 'Task 1');
    expect(response.body[1]).toHaveProperty('title', 'Task 2');
  });

  it('should return an empty array when no tasks exist', async () => {
    await pool.query('DELETE FROM tasks');

    const response = await request(app).get('/v1/tasks').expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(0);
  });
});

describe('GET /tasks/:taskId', () => {
  let taskId: number;

  beforeEach(async () => {
    const [result] = await pool.query(`
      INSERT INTO tasks (title, description, status, type, priority)
      VALUES ('Test Task', 'This is a test task', 'pending', 'task', 'medium')
    `);
    taskId = (result as any).insertId;
  });

  afterEach(async () => {
    await pool.query('DELETE FROM comments');
    await pool.query('DELETE FROM task_relations');
    await pool.query('DELETE FROM tasks');
  });

  it('should return the task if it exists', async () => {
    const response = await request(app).get(`/v1/tasks/${taskId}`).expect(200);

    expect(response.body).toHaveProperty('id', taskId);
    expect(response.body).toHaveProperty('title', 'Test Task');
  });

  it('should return 404 if the task does not exist', async () => {
    const response = await request(app).get('/v1/tasks/9999').expect(404);

    expect(response.text).toBe('Task not found');
  });
});

describe('PUT /tasks/:taskId', () => {
  let taskId: number;

  beforeEach(async () => {
    await cleanupDb();
    const [result] = await pool.query(`
      INSERT INTO tasks (title, description, status, type, priority)
      VALUES ('Test Task', 'This is a test task', 'pending', 'task', 'medium')
    `);
    taskId = (result as any).insertId;
  });

  afterEach(async () => {
    await cleanupDb();
  });

  it('should update the task if it exists', async () => {
    const updatedTask = {
      title: 'Updated Task',
      description: 'This is an updated test task',
      status: 'in_progress',
      type: 'story',
      priority: 'high',
    };

    const response = await request(app)
      .put(`/v1/tasks/${taskId}`)
      .send(updatedTask)
      .expect(200);

    expect(response.body).toHaveProperty('id', taskId);
    expect(response.body).toMatchObject(updatedTask);
  });

  it('should return 404 if the task does not exist', async () => {
    const updatedTask = {
      title: 'Updated Task',
      description: 'This is an updated test task',
      status: 'in_progress',
      type: 'story',
      priority: 'high',
    };

    const response = await request(app)
      .put('/v1/tasks/9999')
      .send(updatedTask)
      .expect(404);

    expect(response.text).toBe('Task not found');
  });

  it('should return 400 if assigned user does not exist', async () => {
    const updatedTask = {
      title: 'Updated Task',
      description: 'This is an updated test task',
      status: 'in_progress',
      type: 'story',
      priority: 'high',
      assignedTo: 9999,
    };

    const response = await request(app)
      .put(`/v1/tasks/${taskId}`)
      .send(updatedTask)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Assigned user not found');
  });
});

describe('DELETE /tasks/:taskId', () => {
  let taskId: number;

  beforeEach(async () => {
    await cleanupDb();
    const [result] = await pool.query(`
      INSERT INTO tasks (title, description, status, type, priority)
      VALUES ('Test Task', 'This is a test task', 'pending', 'task', 'medium')
    `);
    taskId = (result as any).insertId;
  });

  afterEach(async () => {
    await cleanupDb();
  });

  it('should delete the task if it exists', async () => {
    await request(app).delete(`/v1/tasks/${taskId}`).expect(204);

    const response = await request(app).get(`/v1/tasks/${taskId}`).expect(404);

    expect(response.text).toBe('Task not found');
  });

  it('should return 404 if the task does not exist', async () => {
    const response = await request(app).delete('/v1/tasks/9999').expect(404);

    expect(response.text).toBe('Task not found');
  });
});

describe('POST /tasks/:taskId/comments', () => {
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
      VALUES ('Test Task', 'This is a test task', 'pending', 'task', 'medium')
    `);
    taskId = (taskResult as any).insertId;
  });

  afterEach(async () => {
    await cleanupDb();
  });

  it('should add a comment to a task', async () => {
    const newComment = {
      content: 'This is a test comment',
      userId: userId,
    };

    const response = await request(app)
      .post(`/v1/tasks/${taskId}/comments`)
      .send(newComment)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toMatchObject({
      content: newComment.content,
      userId: newComment.userId,
      taskId: taskId,
    });
  });
});
