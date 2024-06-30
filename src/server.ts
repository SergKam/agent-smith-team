import express from 'express';
import { initialize } from 'express-openapi';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

initialize({
  app,
  apiDoc: path.resolve(__dirname, '../api.yaml'),
  paths: path.resolve(__dirname, 'api')
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
