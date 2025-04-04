"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const db_1 = require("./config/db");
const corsMiddleware_1 = require("./middleware/corsMiddleware");
// Import routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const courseRoutes_1 = __importDefault(require("./routes/courseRoutes"));
const enrollmentRoutes_1 = __importDefault(require("./routes/enrollmentRoutes"));
// Import middlewares
const errorHandler_1 = require("./middleware/errorHandler");
// Đọc biến môi trường từ file .env
dotenv_1.default.config();
// Khởi tạo Express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Đặt giá trị mặc định cho NODE_ENV nếu chưa được thiết lập
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
// Kiểm tra kết nối database khi khởi động server
(0, db_1.testConnection)();
// Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(corsMiddleware_1.corsForDevelopment);
    console.log('Sử dụng CORS cho môi trường development');
}
else {
    app.use(corsMiddleware_1.corsWithOptions);
    console.log('Sử dụng CORS cho môi trường production');
}
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
// Thiết lập thư mục tĩnh cho uploads
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use(`/${uploadDir}`, express_1.default.static(path_1.default.join(__dirname, '..', uploadDir)));
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/courses', courseRoutes_1.default);
app.use('/api/enrollments', enrollmentRoutes_1.default);
// Route mặc định
app.get('/', (req, res) => {
    res.json({
        message: 'Edu-Spark API Server',
        version: '1.0.0'
    });
});
// Error middlewares - Đúng thứ tự để xử lý lỗi
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorHandler);
// Khởi động server
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT} trong môi trường ${process.env.NODE_ENV}`);
});
