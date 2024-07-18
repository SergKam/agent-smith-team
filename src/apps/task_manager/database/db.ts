import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'your-username',
  password: process.env.DB_PASSWORD || 'your-password',
  database: process.env.DB_NAME || 'your-database',
  multipleStatements: true,
});

export const initDb = async () =>
  await pool.query(
    await fs.readFile(path.resolve(__dirname, 'schema.sql'), 'utf8'),
  );
let initialized = false;
export const getConnection = async (): Promise<mysql.PoolConnection> => {
  if (!initialized) {
    await initDb();
    initialized = true;
  }
  return pool.getConnection();
};

export const cleanupDb = async () => {
  const connection = await getConnection();
  await connection.query('delete from comments');
  await connection.query('delete from tasks');
  await connection.query('delete from task_relations');
  await connection.query('delete from users');
  connection.release();
};
