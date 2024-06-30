import request from 'supertest';
import app from '../../server';
import pool from '../../db';

beforeAll(async () => {
  await pool.query();

  await pool.query();

  await pool.query();
});

afterAll(async () => {
  await pool.query('DROP TABLE IF EXISTS task_relations;');
  await pool.query('DROP TABLE IF EXISTS tasks;');
  await pool.query('DROP TABLE IF EXISTS users;');
  await pool.end();
});

describe('POST /tasks', () => {
  it('should create a new task', async () => {
    const newTask = {
      title: 'Test Task',
      description: 'This is a test task',
      status: 'pending',
      type: 'task',
      priority: 'medium'
    };

    const response = await request(app)
      .post('/tasks')
      .send(newTask)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toMatchObject({
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
      type: newTask.type,
      priority: newTask.priority
    });
  });

  it('should return 400 if assigned user does not exist', async () => {
    const newTask = {
      title: 'Test Task',
      description: 'This is a test task',
      status: 'pending',
      type: 'task',
      priority: 'medium',
      assignedTo: 9999
    };

    const response = await request(app)
      .post('/tasks')
      .send(newTask)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Assigned user not found');
  });
});
