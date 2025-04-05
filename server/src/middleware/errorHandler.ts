
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

// Error interface mở rộng từ Error
interface ApiError extends Error {
  statusCode?: number;
  errors?: any[];
}

// Middleware xử lý lỗi 404 (Not Found)
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Không tìm thấy - ${req.originalUrl}`) as ApiError;
  error.statusCode = 404;
  next(error);
};

// Middleware xử lý lỗi chung
export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Nếu lỗi không có statusCode thì mặc định là 500 (Internal Server Error)
  const statusCode = err.statusCode || 500;
  
  // Chuẩn bị response
  const response = {
    success: false,
    message: err.message || 'Lỗi không xác định',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  };
  
  // Nếu có danh sách lỗi chi tiết (validation errors), thêm vào response
  if (err.errors) {
    Object.assign(response, { errors: err.errors });
  }
  
  // Log lỗi ra console trong môi trường development
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[ERROR] ${err.stack}`);
  }
  
  res.status(statusCode).json(response);
};

// Middleware để xử lý lỗi từ Multer (upload file)
export const multerErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    let message = 'Lỗi tải file';
    let statusCode = 400;
    
    // Xử lý các lỗi Multer cụ thể
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'File quá lớn';
        break;
      case 'LIMIT_FILE_COUNT':
        message = 'Vượt quá số lượng file cho phép';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'File không đúng tên field';
        break;
      default:
        message = err.message;
    }
    
    return res.status(statusCode).json({
      success: false,
      message
    });
  }
  
  // Nếu không phải lỗi Multer, chuyển tiếp cho errorHandler
  next(err);
}; 
