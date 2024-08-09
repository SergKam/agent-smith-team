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

import { createTask } from "./domain/task/api/actions/createTask";
import { getAllTasks } from "./domain/task/api/actions/getAllTasks";
import { getTaskById } from "./domain/task/api/actions/getTaskById";
import { updateTaskById } from "./domain/task/api/actions/updateTaskById";
import { deleteTaskById } from "./domain/task/api/actions/deleteTaskById";

import errorMiddleware from "./middleware/errorMiddleware";
import { getComments } from "./domain/task/api/actions/getComments";
import { addComment } from "./domain/task/api/actions/addComment";
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
    path.resolve(__dirname, "shared/api.yaml"),
    "utf8"
  )
) as OpenAPIV3.Document;

const operations = {
  getTasks: getAllTasks,
  createTask: createTask,
  getTaskById: getTaskById,
  updateTaskById: updateTaskById,
  deleteTaskById: deleteTaskById,
  getComments: getComments,
  addComment: addComment,
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
