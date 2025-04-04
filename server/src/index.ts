import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import { testConnection } from './config/db';
import { corsWithOptions, corsForDevelopment } from './middleware/corsMiddleware';

// Import routes
import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import enrollmentRoutes from './routes/enrollmentRoutes';

// Import middlewares
import { notFound, errorHandler } from './middleware/errorHandler';

// Đọc biến môi trường từ file .env
dotenv.config();

// Khởi tạo Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Đặt giá trị mặc định cho NODE_ENV nếu chưa được thiết lập
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Kiểm tra kết nối database khi khởi động server
testConnection();

// Middleware CORS dựa trên môi trường
if (process.env.NODE_ENV === 'development') {
  app.use(corsForDevelopment);
  console.log('Sử dụng CORS cho môi trường development');
} else {
  app.use(corsWithOptions);
  console.log('Sử dụng CORS cho môi trường production');
}

console.log(`Ứng dụng đang chạy trong môi trường: ${process.env.NODE_ENV}`);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Thiết lập thư mục tĩnh cho uploads
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use(`/${uploadDir}`, express.static(path.join(__dirname, '..', uploadDir)));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

// Route mặc định
app.get('/', (req, res) => {
  res.json({
    message: 'Edu-Spark API Server',
    version: '1.0.0',
    environment: process.env.NODE_ENV
  });
});

// Error middlewares - Đúng thứ tự để xử lý lỗi
app.use(notFound);
app.use(errorHandler);

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT} trong môi trường ${process.env.NODE_ENV}`);
}); 