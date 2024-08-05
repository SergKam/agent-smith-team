import request from "supertest";
import app from "../../../../server";
import { cleanupDb, pool } from "../../../../database/db";

beforeAll(async () => {
  await cleanupDb();
});

afterAll(async () => {
  await cleanupDb();
});

describe("GET /users", () => {
  beforeEach(async () => {
    await pool.query("DELETE FROM users");
    await pool.query(`
      INSERT INTO users (name)
      VALUES ('User 1'), ('User 2')
    `);
  });

  it("should return all users", async () => {
    const response = await request(app).get("/v1/users").expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name", "User 1");
    expect(response.body[1]).toHaveProperty("name", "User 2");
  });

  it("should return an empty array when no users exist", async () => {
    await pool.query("DELETE FROM users");

    const response = await request(app).get("/v1/users").expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(0);
  });
});
