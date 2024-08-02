import request from "supertest";
import app from "../../../../server";
import { cleanupDb, pool } from "../../../../database/db";

beforeAll(async () => {
  await cleanupDb();
});

afterAll(async () => {
  await cleanupDb();
});

describe("DELETE /users/:userId", () => {
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

  it("should delete the user if it exists", async () => {
    await request(app).delete(`/v1/users/${userId}`).expect(204);

    const response = await request(app).get(`/v1/users/${userId}`).expect(404);

    expect(response.text).toBe("User not found");
  });

  it("should return 404 if the user does not exist", async () => {
    const response = await request(app).delete("/v1/users/9999").expect(404);

    expect(response.text).toBe("User not found");
  });
});
