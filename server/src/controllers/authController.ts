import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel';
import { UserCreateDTO } from '../models/types';

// Tạo JWT token
const generateToken = (userId: number, role: string): string => {
  const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
  return jwt.sign(
    { userId, role },
    secret,
    { expiresIn }
  );
};

export const AuthController = {
  // Đăng ký tài khoản mới
  async register(req: Request, res: Response) {
    try {
      const { full_name, email, password } = req.body;
      
      // Kiểm tra các trường bắt buộc
      if (!full_name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng điền đầy đủ thông tin'
        });
      }
      
      // Kiểm tra email đã tồn tại chưa
      const existingUser = await UserModel.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email đã được sử dụng'
        });
      }
      
      // Tạo user mới
      const userData: UserCreateDTO = {
        full_name,
        email,
        password
      };
      
      const userId = await UserModel.createUser(userData);
      
      // Tạo JWT token
      const token = generateToken(userId, 'user');
      
      // Lấy thông tin user vừa tạo
      const newUser = await UserModel.getUserById(userId);
      
      res.status(201).json({
        success: true,
        message: 'Đăng ký thành công',
        data: {
          user: newUser,
          token
        }
      });
    } catch (error: any) {
      console.error('Lỗi đăng ký:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi đăng ký tài khoản',
        error: error.message
      });
    }
  },
  
  // Đăng nhập
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      // Kiểm tra các trường bắt buộc
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp email và mật khẩu'
        });
      }
      
      // Tìm user theo email
      const user = await UserModel.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email hoặc mật khẩu không đúng'
        });
      }
      
      // Kiểm tra mật khẩu
      const isPasswordValid = await UserModel.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Email hoặc mật khẩu không đúng'
        });
      }
      
      // Tạo JWT token
      const token = generateToken(user.user_id, user.role);
      
      // Không trả về password
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công',
        data: {
          user: userWithoutPassword,
          token
        }
      });
    } catch (error: any) {
      console.error('Lỗi đăng nhập:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi đăng nhập',
        error: error.message
      });
    }
  },
  
  // Lấy thông tin user hiện tại
  async getCurrentUser(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Không tìm thấy thông tin người dùng'
        });
      }
      
      const userId = req.user.userId;
      const user = await UserModel.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng'
        });
      }
      
      res.status(200).json({
        success: true,
        data: {
          user
        }
      });
    } catch (error: any) {
      console.error('Lỗi lấy thông tin người dùng:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin người dùng',
        error: error.message
      });
    }
  }
}; 