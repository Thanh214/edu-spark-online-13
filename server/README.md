# Edu-Spark API Server

Backend API cho ứng dụng học trực tuyến Edu-Spark sử dụng Express.js và MySQL.

## Cài đặt

1. Clone repository:
```bash
git clone repository_url
cd edu-spark-online/server
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Cấu hình môi trường:
- Tạo file `.env` từ file `.env.example`
- Cập nhật các thông tin kết nối database

4. Khởi tạo cơ sở dữ liệu:
```bash
npm run db:init
```

5. Chạy server:
```bash
# Chế độ development
npm run dev

# Chế độ production
npm run build
npm start
```

## Tài khoản mặc định

Sau khi khởi tạo cơ sở dữ liệu, một tài khoản admin mặc định sẽ được tạo:

- Email: admin@eduspark.com
- Mật khẩu: admin123456

## Cấu trúc API

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản mới
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin người dùng hiện tại (yêu cầu xác thực)

### Courses
- `GET /api/courses` - Lấy danh sách khóa học
- `GET /api/courses/:id` - Lấy thông tin chi tiết khóa học
- `GET /api/courses/:id/details` - Lấy thông tin khóa học kèm chương và bài học
- `POST /api/courses` - Tạo khóa học mới (Admin)
- `PUT /api/courses/:id` - Cập nhật khóa học (Admin)
- `DELETE /api/courses/:id` - Xóa khóa học (Admin)

### Enrollments
- `GET /api/enrollments` - Lấy danh sách ghi danh (Admin)
- `GET /api/enrollments/me` - Lấy khóa học đã đăng ký của người dùng hiện tại
- `GET /api/enrollments/:id` - Lấy thông tin ghi danh theo ID
- `POST /api/enrollments` - Đăng ký khóa học
- `PUT /api/enrollments/:id` - Cập nhật tiến độ học
- `DELETE /api/enrollments/:id` - Hủy đăng ký khóa học

## Cấu trúc dự án

```
server/
│
├── src/                      # Mã nguồn chính
│   ├── config/               # Cấu hình database và hệ thống
│   ├── controllers/          # Xử lý logic cho các route
│   ├── middleware/           # Middleware (auth, upload, error handling...)
│   ├── models/               # Mô hình dữ liệu và truy vấn
│   ├── routes/               # Định nghĩa các routes API
│   ├── utils/                # Các tiện ích
│   └── index.ts              # Entry point
│
├── uploads/                  # Thư mục chứa file upload
├── .env                      # Biến môi trường
├── package.json              # Dependencies và scripts
└── tsconfig.json             # Cấu hình TypeScript
```

## Công nghệ sử dụng

- Node.js
- Express.js
- MySQL (với mysql2)
- TypeScript
- JWT (JSON Web Token)
- bcryptjs
- multer (upload file)
- cors, helmet, morgan 