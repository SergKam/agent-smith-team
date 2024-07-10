import dotenv from 'dotenv';
dotenv.config();

import express, {json} from 'express';
import { initialize } from 'express-openapi';
import path from 'path';
import yaml from "js-yaml";
import { OpenAPIV3 } from 'openapi-types';
import fs from "fs";
import tasks from './api/tasks';
import taskId from './api/tasks/{taskId}';
import errorMiddleware from './middleware/errorMiddleware';
import taskIdComments from './api/tasks/{taskId}/comments';
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
const apiDoc = yaml.load(fs.readFileSync(path.resolve(__dirname,'..', '..', 'shared/api.yaml'),'utf8')) as  OpenAPIV3.Document;

initialize({
  app,
  apiDoc,
  promiseMode: true,
  pathsIgnore: new RegExp('\.(spec|test)$'),
  operations: {
    getTasks:tasks().get,
    createTask:tasks().post,
    getTaskById:taskId().get,
    updateTaskById:taskId().put,
    deleteTaskById:taskId().delete,
    getCommentsByTaskId:tasks().get,
    addCommentToTask:taskIdComments().post,
  },
  errorMiddleware: errorMiddleware
});
console.log('Express-OpenAPI initialized');

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
