"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerErrorHandler = exports.errorHandler = exports.notFound = void 0;
const multer_1 = __importDefault(require("multer"));
// Middleware xử lý lỗi 404 (Not Found)
const notFound = (req, res, next) => {
    const error = new Error(`Không tìm thấy - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};
exports.notFound = notFound;
// Middleware xử lý lỗi chung
const errorHandler = (err, req, res, next) => {
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
exports.errorHandler = errorHandler;
// Middleware để xử lý lỗi từ Multer (upload file)
const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer_1.default.MulterError) {
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
exports.multerErrorHandler = multerErrorHandler;
