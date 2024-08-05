import request from "supertest";

import { cleanupDb, pool } from "../../../../database/db";
import app from "../../../../server";

beforeAll(async () => {
  await cleanupDb();
});

afterAll(async () => {
  await cleanupDb();
});

describe("GET /users/:userId", () => {
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

  it("should return the user if it exists", async () => {
    const response = await request(app).get(`/v1/users/${userId}`).expect(200);

    expect(response.body).toHaveProperty("id", userId);
    expect(response.body).toHaveProperty("name", "Test User");
  });

  it("should return 404 if the user does not exist", async () => {
    const response = await request(app).get("/v1/users/9999").expect(404);

    expect(response.text).toBe("User not found");
  });
});
