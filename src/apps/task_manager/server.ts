import dotenv from 'dotenv';
import express from 'express';
import { initialize } from 'express-openapi';
import path from 'path';
import yaml from 'js-yaml';
import { OpenAPIV3 } from 'openapi-types';
import fs from 'fs';
import tasks from './api/tasks';
import taskId from './api/tasks/{taskId}';
import errorMiddleware from './middleware/errorMiddleware';
import taskIdComments from './api/tasks/{taskId}/comments';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
const apiDoc = yaml.load(fs.readFileSync(path.resolve(__dirname, '..', '..', 'shared/api.yaml'), 'utf8')) as OpenAPIV3.Document;

const operations = {
  getTasks: tasks().get,
  createTask: tasks().post,
  getTaskById: taskId().get,
  updateTaskById: taskId().put,
  deleteTaskById: taskId().delete,
  getCommentsByTaskId: taskIdComments().get,
  addCommentToTask: taskIdComments().post,
};

initialize({
  app,
  apiDoc,
  promiseMode: true,
  pathsIgnore: new RegExp('\.(spec|test)$'),
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
