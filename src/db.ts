import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'your-username',
    password: process.env.DB_PASSWORD || 'your-password',
    database: process.env.DB_NAME || 'your-database'
});

export default pool;
