import express from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

// Đăng ký người dùng mới
router.post('/register', AuthController.register);

// Đăng nhập
router.post('/login', AuthController.login);

// Lấy thông tin người dùng hiện tại - cần xác thực JWT
router.get('/me', authenticateJWT, AuthController.getCurrentUser);

export default router; 