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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentModel = void 0;
const db_1 = require("../config/db");
exports.EnrollmentModel = {
    // Lấy tất cả enrollments
    getAllEnrollments() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query('SELECT * FROM Enrollments');
            return rows;
        });
    },
    // Lấy enrollments theo user ID
    getEnrollmentsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query('SELECT * FROM Enrollments WHERE user_id = ?', [userId]);
            return rows;
        });
    },
    // Lấy enrollments theo course ID
    getEnrollmentsByCourseId(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query('SELECT * FROM Enrollments WHERE course_id = ?', [courseId]);
            return rows;
        });
    },
    // Lấy enrollment theo ID
    getEnrollmentById(enrollmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query('SELECT * FROM Enrollments WHERE enrollment_id = ?', [enrollmentId]);
            const enrollments = rows;
            return enrollments.length > 0 ? enrollments[0] : null;
        });
    },
    // Lấy enrollment theo user ID và course ID
    getEnrollmentByUserAndCourse(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query('SELECT * FROM Enrollments WHERE user_id = ? AND course_id = ?', [userId, courseId]);
            const enrollments = rows;
            return enrollments.length > 0 ? enrollments[0] : null;
        });
    },
    // Tạo enrollment mới
    createEnrollment(enrollmentData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield db_1.pool.query('INSERT INTO Enrollments (user_id, course_id, current_lesson_id, progress_percent) VALUES (?, ?, ?, ?)', [
                enrollmentData.user_id,
                enrollmentData.course_id,
                enrollmentData.current_lesson_id || null,
                enrollmentData.progress_percent || 0
            ]);
            const insertResult = result;
            return insertResult.insertId;
        });
    },
    // Cập nhật thông tin enrollment
    updateEnrollment(enrollmentId, enrollmentData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Chuẩn bị các fields cần update
            const fieldsToUpdate = Object.assign({}, enrollmentData);
            // Tạo câu query động dựa trên các fields cần update
            const entries = Object.entries(fieldsToUpdate);
            if (entries.length === 0)
                return false;
            const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
            const values = entries.map(([_, value]) => value);
            const query = `UPDATE Enrollments SET ${setClause} WHERE enrollment_id = ?`;
            values.push(enrollmentId);
            const [result] = yield db_1.pool.query(query, values);
            const updateResult = result;
            return updateResult.affectedRows > 0;
        });
    },
    // Cập nhật progress cho enrollment theo user ID và course ID
    updateEnrollmentProgress(userId, courseId, currentLessonId, progressPercent) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield db_1.pool.query('UPDATE Enrollments SET current_lesson_id = ?, progress_percent = ? WHERE user_id = ? AND course_id = ?', [currentLessonId, progressPercent, userId, courseId]);
            const updateResult = result;
            return updateResult.affectedRows > 0;
        });
    },
    // Xóa enrollment
    deleteEnrollment(enrollmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield db_1.pool.query('DELETE FROM Enrollments WHERE enrollment_id = ?', [enrollmentId]);
            const deleteResult = result;
            return deleteResult.affectedRows > 0;
        });
    },
    // Lấy thông tin chi tiết enrollment với thông tin khóa học và user
    getEnrollmentDetails(enrollmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query(`SELECT e.*, c.title as course_title, c.description as course_description, 
          u.full_name, u.email, l.title as current_lesson_title
       FROM Enrollments e
       JOIN Courses c ON e.course_id = c.course_id
       JOIN Users u ON e.user_id = u.user_id
       LEFT JOIN Lessons l ON e.current_lesson_id = l.lesson_id
       WHERE e.enrollment_id = ?`, [enrollmentId]);
            const enrollmentDetails = rows;
            return enrollmentDetails.length > 0 ? enrollmentDetails[0] : null;
        });
    },
    // Lấy tất cả khóa học đã đăng ký của một user với thông tin chi tiết
    getUserEnrollmentsWithCourses(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query(`SELECT e.*, c.title as course_title, c.description as course_description, 
          c.thumbnail, l.title as current_lesson_title
       FROM Enrollments e
       JOIN Courses c ON e.course_id = c.course_id
       LEFT JOIN Lessons l ON e.current_lesson_id = l.lesson_id
       WHERE e.user_id = ?`, [userId]);
            return rows;
        });
    }
};
