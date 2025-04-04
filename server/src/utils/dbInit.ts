import fs from 'fs';
import path from 'path';
import { pool } from '../config/db';
import { hashPassword } from '../models/userModel';

// Function để chạy script SQL từ file
async function executeSqlFromFile(filePath: string): Promise<void> {
  try {
    // Đọc file SQL
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Chia SQL thành các câu lệnh riêng biệt
    const statements = sql.split(';').filter(statement => statement.trim() !== '');
    
    // Thực hiện từng câu lệnh
    for (const statement of statements) {
      if (statement.trim()) {
        await pool.query(statement);
        console.log('Thực hiện câu lệnh SQL thành công');
      }
    }
    
    console.log('Đã thực hiện tất cả các câu lệnh SQL từ file');
  } catch (error) {
    console.error('Lỗi khi thực hiện SQL từ file:', error);
    throw error;
  }
}

// Function để khởi tạo tài khoản admin
async function createAdminUser(): Promise<void> {
  try {
    // Kiểm tra xem đã có admin chưa
    const [rows] = await pool.query('SELECT * FROM Users WHERE role = ?', ['admin']);
    const users = rows as any[];
    
    // Nếu chưa có admin, tạo tài khoản admin mặc định
    if (users.length === 0) {
      const adminPassword = await hashPassword('admin123');
      
      await pool.query(
        'INSERT INTO Users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Administrator', 'admin@eduspark.com', adminPassword, 'admin']
      );
      
      console.log('Đã tạo tài khoản admin mặc định');
    } else {
      console.log('Tài khoản admin đã tồn tại');
    }
  } catch (error) {
    console.error('Lỗi khi tạo tài khoản admin:', error);
    throw error;
  }
}

// Function chính để khởi tạo cơ sở dữ liệu
export async function initializeDatabase(): Promise<void> {
  try {
    console.log('Bắt đầu khởi tạo cơ sở dữ liệu...');
    
    // Đường dẫn đến file SQL
    const sqlFilePath = path.join(__dirname, '../../database.sql');
    
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`File SQL không tồn tại tại đường dẫn: ${sqlFilePath}`);
    }
    
    // Thực hiện các câu lệnh SQL để tạo bảng
    await executeSqlFromFile(sqlFilePath);
    
    // Tạo tài khoản admin mặc định
    await createAdminUser();
    
    console.log('Khởi tạo cơ sở dữ liệu thành công');
  } catch (error) {
    console.error('Lỗi khi khởi tạo cơ sở dữ liệu:', error);
    throw error;
  }
}

// Nếu file được chạy trực tiếp
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Hoàn tất khởi tạo cơ sở dữ liệu');
      process.exit(0);
    })
    .catch(error => {
      console.error('Khởi tạo cơ sở dữ liệu thất bại:', error);
      process.exit(1);
    });
} 