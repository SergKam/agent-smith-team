import request from 'supertest';
import app from '../server';
import pool from '../db';

beforeAll(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status ENUM('pending', 'in_progress', 'completed') NOT NULL,
      type ENUM('story', 'task', 'question', 'bug') NOT NULL,
      priority ENUM('low', 'medium', 'high', 'critical') NOT NULL,
      assignedTo INT,
      FOREIGN KEY (assignedTo) REFERENCES users(id)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS task_relations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      taskId INT,
      relatedTaskId INT,
      relationType VARCHAR(255),
      FOREIGN KEY (taskId) REFERENCES tasks(id),
      FOREIGN KEY (relatedTaskId) REFERENCES tasks(id)
    );
  `);
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
        .post('/v1/tasks')
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
        .post('/v1/tasks')
        .send(newTask)
        .expect(400);

    expect(response.body).toHaveProperty('error', 'Assigned user not found');
  });
});
