import request from "supertest";
import app from "../../../../server";
import { cleanupDb, pool } from "../../../../database/db";

beforeAll(async () => {
  await cleanupDb();
});

afterAll(async () => {
  await cleanupDb();
});

describe("POST /users", () => {
  it("should create a new user", async () => {
    const newUser = { name: "Test User" };

    const response = await request(app)
      .post("/v1/users")
      .send(newUser)
      .expect(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toMatchObject({ name: newUser.name });
  });

  it("should return 400 if name is missing", async () => {
    const response = await request(app).post("/v1/users").send({}).expect(400);

    expect(response.body).toHaveProperty(
      "errors[0].message",
      "must have required property 'name'"
    );
  });

  it("should return 400 if name is empty", async () => {
    const response = await request(app)
      .post("/v1/users")
      .send({ name: " " })
      .expect(400);

    expect(response.body).toHaveProperty("error", "Name cannot be empty");
  });

  it("should return 400 if request body is invalid", async () => {
    const response = await request(app)
      .post("/v1/users")
      .send("invalid body")
      .expect(415);
  });
});
