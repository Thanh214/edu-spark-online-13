import { pool } from '../config/db';
import { User, UserCreateDTO, UserUpdateDTO } from './types';
import bcrypt from 'bcryptjs';

// Hash password function
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export const UserModel = {
  // Lấy tất cả users (không bao gồm password)
  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    const [rows] = await pool.query('SELECT user_id, full_name, email, role, created_at, updated_at FROM Users');
    return rows as Omit<User, 'password'>[];
  },

  // Lấy user theo ID (không bao gồm password)
  async getUserById(userId: number): Promise<Omit<User, 'password'> | null> {
    const [rows] = await pool.query(
      'SELECT user_id, full_name, email, role, created_at, updated_at FROM Users WHERE user_id = ?',
      [userId]
    );
    const users = rows as Omit<User, 'password'>[];
    return users.length > 0 ? users[0] : null;
  },

  // Lấy user theo email (bao gồm password để xác thực)
  async getUserByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.query(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );
    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
  },

  // Tạo user mới
  async createUser(userData: UserCreateDTO): Promise<number> {
    // Hash password trước khi lưu vào DB
    const hashedPassword = await hashPassword(userData.password);
    
    const [result] = await pool.query(
      'INSERT INTO Users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
      [userData.full_name, userData.email, hashedPassword, userData.role || 'user']
    );
    
    const insertResult = result as { insertId: number };
    return insertResult.insertId;
  },

  // Cập nhật thông tin user
  async updateUser(userId: number, userData: UserUpdateDTO): Promise<boolean> {
    // Chuẩn bị các fields cần update
    const fieldsToUpdate: Record<string, any> = { ...userData };
    
    // Nếu có password thì hash trước khi update
    if (userData.password) {
      fieldsToUpdate.password = await hashPassword(userData.password);
    }
    
    // Tạo câu query động dựa trên các fields cần update
    const entries = Object.entries(fieldsToUpdate);
    if (entries.length === 0) return false;
    
    const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = entries.map(([_, value]) => value);
    
    const query = `UPDATE Users SET ${setClause} WHERE user_id = ?`;
    values.push(userId);
    
    const [result] = await pool.query(query, values);
    const updateResult = result as { affectedRows: number };
    return updateResult.affectedRows > 0;
  },

  // Xóa user
  async deleteUser(userId: number): Promise<boolean> {
    const [result] = await pool.query(
      'DELETE FROM Users WHERE user_id = ?',
      [userId]
    );
    const deleteResult = result as { affectedRows: number };
    return deleteResult.affectedRows > 0;
  },

  // Xác thực password
  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}; 