require('dotenv').config({ path: '../../.env' });
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: process.env.DB_CONNECTION_LIMIT,
    queueLimit: process.env.DB_QUEUE_LIMIT
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Successfully connected to MySQL database.');
        connection.release();
    }
});

const promisePool = pool.promise();

module.exports = promisePool;