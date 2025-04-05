
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel';

// Mở rộng interface Request để thêm thuộc tính user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        role: string;
      };
    }
  }
}

// Middleware kiểm tra xác thực JWT
export const authenticateJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({ 
        success: false, 
        message: 'Không có token xác thực' 
      });
      return;
    }

    // Lấy token từ header "Bearer TOKEN"
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
    
    const decoded = jwt.verify(token, secret) as { userId: number; role: string };
    
    // Thêm thông tin user vào request
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token không hợp lệ hoặc đã hết hạn' 
    });
    return;
  }
};

// Middleware kiểm tra quyền admin
export const authorizeAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ 
      success: false, 
      message: 'Không có quyền truy cập. Yêu cầu quyền admin.' 
    });
    return;
  }
  
  next();
};

// Middleware xác minh người dùng sở hữu tài nguyên
export const verifyResourceOwnership = (
  getResourceOwnerIdFn: (resourceId: number) => Promise<number | null>
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Bỏ qua kiểm tra nếu người dùng là admin
      if (req.user?.role === 'admin') {
        next();
        return;
      }

      // Lấy ID của tài nguyên từ params
      const resourceId = parseInt(req.params.id);
      if (isNaN(resourceId)) {
        res.status(400).json({ success: false, message: 'ID không hợp lệ' });
        return;
      }

      // Lấy ID người dùng sở hữu tài nguyên
      const ownerId = await getResourceOwnerIdFn(resourceId);
      
      if (ownerId === null) {
        res.status(404).json({ success: false, message: 'Không tìm thấy tài nguyên' });
        return;
      }

      // Kiểm tra nếu người dùng hiện tại là chủ sở hữu
      if (req.user?.userId !== ownerId) {
        res.status(403).json({ 
          success: false, 
          message: 'Không có quyền truy cập vào tài nguyên này' 
        });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server khi xác minh quyền sở hữu' 
      });
      return;
    }
  };
}; 
