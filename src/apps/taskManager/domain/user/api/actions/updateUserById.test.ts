import request from "supertest";
import app from "../../../../server";
import { cleanupDb, pool } from "../../../../database/db";

beforeAll(async () => {
  await cleanupDb();
});

afterAll(async () => {
  await cleanupDb();
});

describe("PUT /users/:userId", () => {
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

  it("should update the user if it exists", async () => {
    const updatedUser = { name: "Updated User" };

    const response = await request(app)
      .put(`/v1/users/${userId}`)
      .send(updatedUser)
      .expect(200);

    expect(response.body).toHaveProperty("id", userId);
    expect(response.body).toMatchObject(updatedUser);
  });

  it("should return 404 if the user does not exist", async () => {
    const updatedUser = { name: "Updated User" };

    const response = await request(app)
      .put("/v1/users/9999")
      .send(updatedUser)
      .expect(404);

    expect(response.text).toBe("User not found");
  });
});
