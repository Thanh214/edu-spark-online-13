"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
dotenv_1.default.config();
// Cấu hình kết nối database
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || '3306')
};
// Mã SQL để tạo cơ sở dữ liệu và các bảng
const createDatabaseQuery = `
CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'edu_spark'} 
CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
`;
const createTablesQuery = `
-- Bảng Users
CREATE TABLE IF NOT EXISTS \`Users\` (
  \`user_id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`full_name\` VARCHAR(50) NOT NULL,
  \`password\` VARCHAR(255) NOT NULL,
  \`email\` VARCHAR(100) NOT NULL UNIQUE,
  \`role\` ENUM('admin','user') NOT NULL DEFAULT 'user',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`user_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bảng Courses
CREATE TABLE IF NOT EXISTS \`Courses\` (
  \`course_id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`title\` VARCHAR(200) NOT NULL,
  \`description\` TEXT DEFAULT NULL,
  \`thumbnail\` VARCHAR(255) DEFAULT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`course_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bảng Chapters
CREATE TABLE IF NOT EXISTS \`Chapters\` (
  \`chapter_id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`course_id\` INT(11) NOT NULL,
  \`title\` VARCHAR(200) NOT NULL,
  \`description\` TEXT DEFAULT NULL,
  \`chapter_order\` INT(11) NOT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`chapter_id\`),
  INDEX idx_course_id (\`course_id\`),
  CONSTRAINT fk_chapter_course FOREIGN KEY (\`course_id\`) REFERENCES \`Courses\`(\`course_id\`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bảng Lessons
CREATE TABLE IF NOT EXISTS \`Lessons\` (
  \`lesson_id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`chapter_id\` INT(11) NOT NULL,
  \`title\` VARCHAR(200) NOT NULL,
  \`content\` TEXT DEFAULT NULL,
  \`lesson_order\` INT(11) NOT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`lesson_id\`),
  INDEX idx_chapter_id (\`chapter_id\`),
  CONSTRAINT fk_lesson_chapter FOREIGN KEY (\`chapter_id\`) REFERENCES \`Chapters\`(\`chapter_id\`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bảng Pages
CREATE TABLE IF NOT EXISTS \`Pages\` (
  \`page_id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`lesson_id\` INT(11) NOT NULL,
  \`page_number\` INT(11) NOT NULL,
  \`content\` TEXT DEFAULT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`page_id\`),
  INDEX idx_lesson_id (\`lesson_id\`),
  CONSTRAINT fk_page_lesson FOREIGN KEY (\`lesson_id\`) REFERENCES \`Lessons\`(\`lesson_id\`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bảng Documents
CREATE TABLE IF NOT EXISTS \`Documents\` (
  \`document_id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`lesson_id\` INT(11) NOT NULL,
  \`title\` VARCHAR(200) NOT NULL,
  \`file_path\` VARCHAR(255) NOT NULL,
  \`uploaded_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`document_id\`),
  INDEX idx_document_lesson (\`lesson_id\`),
  CONSTRAINT fk_document_lesson FOREIGN KEY (\`lesson_id\`) REFERENCES \`Lessons\`(\`lesson_id\`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bảng Enrollments
CREATE TABLE IF NOT EXISTS \`Enrollments\` (
  \`enrollment_id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`user_id\` INT(11) NOT NULL,
  \`course_id\` INT(11) NOT NULL,
  \`current_lesson_id\` INT(11) DEFAULT NULL,
  \`progress_percent\` DECIMAL(5,2) DEFAULT 0.00,
  \`enrolled_date\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`enrollment_id\`),
  INDEX idx_enrollment_user (\`user_id\`),
  INDEX idx_enrollment_course (\`course_id\`),
  INDEX idx_enrollment_lesson (\`current_lesson_id\`),
  CONSTRAINT fk_enrollment_user FOREIGN KEY (\`user_id\`) REFERENCES \`Users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_enrollment_course FOREIGN KEY (\`course_id\`) REFERENCES \`Courses\`(\`course_id\`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_enrollment_lesson FOREIGN KEY (\`current_lesson_id\`) REFERENCES \`Lessons\`(\`lesson_id\`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bảng Exams
CREATE TABLE IF NOT EXISTS \`Exams\` (
  \`exam_id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`course_id\` INT(11) DEFAULT NULL,
  \`chapter_id\` INT(11) DEFAULT NULL,
  \`title\` VARCHAR(200) DEFAULT NULL,
  \`time_limit\` INT(11) DEFAULT NULL, -- thời gian làm bài tính theo phút
  \`total_questions\` INT(11) DEFAULT NULL,
  \`passing_score\` DECIMAL(5,2) DEFAULT NULL,
  PRIMARY KEY (\`exam_id\`),
  INDEX idx_exam_course (\`course_id\`),
  INDEX idx_exam_chapter (\`chapter_id\`),
  CONSTRAINT fk_exam_course FOREIGN KEY (\`course_id\`) REFERENCES \`Courses\`(\`course_id\`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_exam_chapter FOREIGN KEY (\`chapter_id\`) REFERENCES \`Chapters\`(\`chapter_id\`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bảng Questions
CREATE TABLE IF NOT EXISTS \`Questions\` (
  \`question_id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`exam_id\` INT(11) NOT NULL,
  \`question_text\` TEXT NOT NULL,
  \`option_a\` VARCHAR(255) NOT NULL,
  \`option_b\` VARCHAR(255) NOT NULL,
  \`option_c\` VARCHAR(255) NOT NULL,
  \`option_d\` VARCHAR(255) NOT NULL,
  \`correct_answer\` ENUM('A','B','C','D') NOT NULL,
  PRIMARY KEY (\`question_id\`),
  INDEX idx_question_exam (\`exam_id\`),
  CONSTRAINT fk_question_exam FOREIGN KEY (\`exam_id\`) REFERENCES \`Exams\`(\`exam_id\`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bảng Test_Scores
CREATE TABLE IF NOT EXISTS \`Test_Scores\` (
  \`score_id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`user_id\` INT(11) NOT NULL,
  \`exam_id\` INT(11) NOT NULL,
  \`score\` DECIMAL(5,2) NOT NULL,
  \`attempt_date\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`status\` ENUM('pass','fail') NOT NULL,
  PRIMARY KEY (\`score_id\`),
  INDEX idx_score_user (\`user_id\`),
  INDEX idx_score_exam (\`exam_id\`),
  CONSTRAINT fk_score_user FOREIGN KEY (\`user_id\`) REFERENCES \`Users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_score_exam FOREIGN KEY (\`exam_id\`) REFERENCES \`Exams\`(\`exam_id\`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
`;
// Dữ liệu mẫu cho user admin
const createAdminUserQuery = `
INSERT INTO Users (full_name, email, password, role)
VALUES (?, ?, ?, 'admin');
`;
// Hàm khởi tạo cơ sở dữ liệu
function initializeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        let connection;
        try {
            // Kết nối đến MySQL server (không chọn database)
            connection = yield promise_1.default.createConnection(Object.assign(Object.assign({}, dbConfig), { database: undefined }));
            // Tạo database nếu chưa tồn tại
            console.log('Tạo cơ sở dữ liệu...');
            yield connection.query(createDatabaseQuery);
            // Kết nối đến database vừa tạo
            yield connection.changeUser({
                database: process.env.DB_NAME || 'edu_spark'
            });
            // Tạo các bảng
            console.log('Tạo các bảng...');
            yield connection.query(createTablesQuery);
            // Kiểm tra xem đã có admin chưa
            const [adminUsers] = yield connection.query("SELECT * FROM Users WHERE role = 'admin' LIMIT 1");
            if (Array.isArray(adminUsers) && adminUsers.length === 0) {
                // Tạo user admin mặc định
                console.log('Tạo tài khoản admin mặc định...');
                const adminName = 'Admin';
                const adminEmail = 'admin@eduspark.com';
                const adminPassword = 'admin123456';
                // Hash mật khẩu trước khi lưu
                const hashedPassword = yield hashPassword(adminPassword);
                yield connection.execute(createAdminUserQuery, [
                    adminName,
                    adminEmail,
                    hashedPassword
                ]);
                console.log('Tài khoản admin mặc định đã được tạo:');
                console.log('Email:', adminEmail);
                console.log('Mật khẩu:', adminPassword);
            }
            else {
                console.log('Tài khoản admin đã tồn tại.');
            }
            console.log('Khởi tạo cơ sở dữ liệu hoàn tất!');
        }
        catch (error) {
            console.error('Lỗi khi khởi tạo cơ sở dữ liệu:', error);
        }
        finally {
            if (connection) {
                yield connection.end();
            }
        }
    });
}
// Chạy hàm khởi tạo
initializeDatabase();
// Hàm hash password
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcryptjs_1.default.genSalt(10);
        return bcryptjs_1.default.hash(password, salt);
    });
}
