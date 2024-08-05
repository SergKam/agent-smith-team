import "dotenv/config";
import express from "express";
import { initialize } from "express-openapi";
import { createUser } from "./domain/user/api/actions/createUser";
import { getAllUsers } from "./domain/user/api/actions/getAllUsers";
import { getUserById } from "./domain/user/api/actions/getUserById";
import { updateUserById } from "./domain/user/api/actions/updateUserById";
import { deleteUserById } from "./domain/user/api/actions/deleteUserById";
import path from "path";
import yaml from "js-yaml";
import { OpenAPIV3 } from "openapi-types";
import fs from "fs";
import cors from "cors";
import tasks from "./domain/task/api/TasksController";
import taskId from "./domain/task/api/TaskController";
import errorMiddleware from "./middleware/errorMiddleware";
import taskIdComments from "./domain/task/api/CommentsController";
import logger from "./middleware/logger";

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    exposedHeaders: "Content-Range",
  })
);
app.use(express.json());
app.use(logger.middleware);
const apiDoc = yaml.load(
  fs.readFileSync(
    path.resolve(__dirname, "..", "..", "shared/api.yaml"),
    "utf8"
  )
) as OpenAPIV3.Document;

const operations = {
  getTasks: tasks().get,
  createTask: tasks().post,
  getTaskById: taskId().get,
  updateTaskById: taskId().put,
  deleteTaskById: taskId().delete,
  getCommentsByTaskId: taskIdComments().get,
  addCommentToTask: taskIdComments().post,
  getUsers: getAllUsers,
  createUser: createUser,
  getUserById: getUserById,
  updateUserById: updateUserById,
  deleteUserById: deleteUserById,
};

initialize({
  app,
  apiDoc,
  promiseMode: true,
  pathsIgnore: new RegExp(".(spec|test)$"),
  operations,
  errorMiddleware,
  validateApiDoc: true,
  exposeApiDocs: true,
  docsPath: "/api-docs",
  logger,
});

logger.info("Express-OpenAPI initialized");
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
}

export default app;
