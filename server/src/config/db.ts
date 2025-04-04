import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Tạo pool connection để quản lý kết nối hiệu quả
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'edu_spark',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Kiểm tra kết nối
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection established successfully.');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

export { pool, testConnection }; 