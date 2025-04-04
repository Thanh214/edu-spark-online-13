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
exports.CourseModel = void 0;
const db_1 = require("../config/db");
exports.CourseModel = {
    // Lấy tất cả các khóa học
    getAllCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query('SELECT * FROM Courses');
            return rows;
        });
    },
    // Lấy khóa học theo ID
    getCourseById(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query('SELECT * FROM Courses WHERE course_id = ?', [courseId]);
            const courses = rows;
            return courses.length > 0 ? courses[0] : null;
        });
    },
    // Tạo khóa học mới
    createCourse(courseData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield db_1.pool.query('INSERT INTO Courses (title, description, thumbnail) VALUES (?, ?, ?)', [courseData.title, courseData.description || null, courseData.thumbnail || null]);
            const insertResult = result;
            return insertResult.insertId;
        });
    },
    // Cập nhật thông tin khóa học
    updateCourse(courseId, courseData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Chuẩn bị các fields cần update
            const fieldsToUpdate = Object.assign({}, courseData);
            // Tạo câu query động dựa trên các fields cần update
            const entries = Object.entries(fieldsToUpdate);
            if (entries.length === 0)
                return false;
            const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
            const values = entries.map(([_, value]) => value);
            const query = `UPDATE Courses SET ${setClause} WHERE course_id = ?`;
            values.push(courseId);
            const [result] = yield db_1.pool.query(query, values);
            const updateResult = result;
            return updateResult.affectedRows > 0;
        });
    },
    // Xóa khóa học
    deleteCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield db_1.pool.query('DELETE FROM Courses WHERE course_id = ?', [courseId]);
            const deleteResult = result;
            return deleteResult.affectedRows > 0;
        });
    },
    // Lấy thông tin chi tiết khóa học bao gồm chapters và lessons
    getCourseWithDetails(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.getCourseById(courseId);
            if (!course)
                return null;
            // Lấy tất cả chapters của khóa học
            const [chapters] = yield db_1.pool.query('SELECT * FROM Chapters WHERE course_id = ? ORDER BY chapter_order', [courseId]);
            // Lấy lessons của từng chapter
            const chaptersWithLessons = yield Promise.all(chapters.map((chapter) => __awaiter(this, void 0, void 0, function* () {
                const [lessons] = yield db_1.pool.query('SELECT * FROM Lessons WHERE chapter_id = ? ORDER BY lesson_order', [chapter.chapter_id]);
                return Object.assign(Object.assign({}, chapter), { lessons });
            })));
            return Object.assign(Object.assign({}, course), { chapters: chaptersWithLessons });
        });
    }
};
