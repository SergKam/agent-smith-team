import request from 'supertest';
import app from '../../../server';
import { cleanupDb, pool } from '../../../database/db';

beforeAll(async () => {
  await cleanupDb();
});

afterAll(async () => {
  await cleanupDb();
});

describe('POST /users', () => {
  it('should create a new user', async () => {
    const newUser = { name: 'Test User' };

    const response = await request(app)
      .post('/v1/users')
      .send(newUser)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toMatchObject({ name: newUser.name });
  });
});

describe('GET /users', () => {
  beforeEach(async () => {
    await pool.query('DELETE FROM users');
    await pool.query(`
      INSERT INTO users (name)
      VALUES ('User 1'), ('User 2')
    `);
  });

  it('should return all users', async () => {
    const response = await request(app).get('/v1/users').expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name', 'User 1');
    expect(response.body[1]).toHaveProperty('name', 'User 2');
  });

  it('should return an empty array when no users exist', async () => {
    await pool.query('DELETE FROM users');

    const response = await request(app).get('/v1/users').expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(0);
  });
});

describe('GET /users/:userId', () => {
  let userId: number;

  beforeEach(async () => {
    const [result] = await pool.query(`
      INSERT INTO users (name)
      VALUES ('Test User')
    `);
    userId = (result as any).insertId;
  });

  afterEach(async () => {
    await cleanupDb();
  });

  it('should return the user if it exists', async () => {
    const response = await request(app).get(`/v1/users/${userId}`).expect(200);

    expect(response.body).toHaveProperty('id', userId);
    expect(response.body).toHaveProperty('name', 'Test User');
  });

  it('should return 404 if the user does not exist', async () => {
    const response = await request(app).get('/v1/users/9999').expect(404);

    expect(response.text).toBe('User not found');
  });
});

describe('PUT /users/:userId', () => {
  let userId: number;

  beforeEach(async () => {
    await cleanupDb();
    const [result] = await pool.query(`
      INSERT INTO users (name)
      VALUES ('Test User')
    `);
    userId = (result as any).insertId;
  });

  afterEach(async () => {
    await cleanupDb();
  });

  it('should update the user if it exists', async () => {
    const updatedUser = { name: 'Updated User' };

    const response = await request(app)
      .put(`/v1/users/${userId}`)
      .send(updatedUser)
      .expect(200);

    expect(response.body).toHaveProperty('id', userId);
    expect(response.body).toMatchObject(updatedUser);
  });

  it('should return 404 if the user does not exist', async () => {
    const updatedUser = { name: 'Updated User' };

    const response = await request(app)
      .put('/v1/users/9999')
      .send(updatedUser)
      .expect(404);

    expect(response.text).toBe('User not found');
  });
});

describe('DELETE /users/:userId', () => {
  let userId: number;

  beforeEach(async () => {
    await cleanupDb();
    const [result] = await pool.query(`
      INSERT INTO users (name)
      VALUES ('Test User')
    `);
    userId = (result as any).insertId;
  });

  afterEach(async () => {
    await cleanupDb();
  });

  it('should delete the user if it exists', async () => {
    await request(app).delete(`/v1/users/${userId}`).expect(204);

    const response = await request(app).get(`/v1/users/${userId}`).expect(404);

    expect(response.text).toBe('User not found');
  });

  it('should return 404 if the user does not exist', async () => {
    const response = await request(app).delete('/v1/users/9999').expect(404);

    expect(response.text).toBe('User not found');
  });
});
