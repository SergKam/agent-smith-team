import 'dotenv/config';
import express from 'express';
import { initialize } from 'express-openapi';
import path from 'path';
import yaml from 'js-yaml';
import { OpenAPIV3 } from 'openapi-types';
import fs from 'fs';
import cors from 'cors';
import tasks from './domain/task/api/TasksController';
import taskId from './domain/task/api/TaskController';
import errorMiddleware from './middleware/errorMiddleware';
import taskIdComments from './domain/task/api/CommentsController';
import users from './domain/user/api/UserController';

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    exposedHeaders: 'Content-Range',
  }),
);
app.use(express.json());
const apiDoc = yaml.load(
  fs.readFileSync(
    path.resolve(__dirname, '..', '..', 'shared/api.yaml'),
    'utf8',
  ),
) as OpenAPIV3.Document;

const operations = {
  getTasks: tasks().get,
  createTask: tasks().post,
  getTaskById: taskId().get,
  updateTaskById: taskId().put,
  deleteTaskById: taskId().delete,
  getCommentsByTaskId: taskIdComments().get,
  addCommentToTask: taskIdComments().post,
  getUsers: users().get,
  createUser: users().post,
  getUserById: users().getById,
  updateUserById: users().put,
  deleteUserById: users().delete,
};

initialize({
  app,
  apiDoc,
  promiseMode: true,
  pathsIgnore: new RegExp('.(spec|test)$'),
  operations,
  errorMiddleware: errorMiddleware,
});
console.log('Express-OpenAPI initialized');

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
