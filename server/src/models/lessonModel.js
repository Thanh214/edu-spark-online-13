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
exports.LessonModel = void 0;
const db_1 = require("../config/db");
exports.LessonModel = {
    // Lấy tất cả các lessons
    getAllLessons() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query('SELECT * FROM Lessons ORDER BY lesson_order');
            return rows;
        });
    },
    // Lấy lessons theo chapter ID
    getLessonsByChapterId(chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query('SELECT * FROM Lessons WHERE chapter_id = ? ORDER BY lesson_order', [chapterId]);
            return rows;
        });
    },
    // Lấy lesson theo ID
    getLessonById(lessonId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query('SELECT * FROM Lessons WHERE lesson_id = ?', [lessonId]);
            const lessons = rows;
            return lessons.length > 0 ? lessons[0] : null;
        });
    },
    // Tạo lesson mới
    createLesson(lessonData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield db_1.pool.query('INSERT INTO Lessons (chapter_id, title, content, lesson_order) VALUES (?, ?, ?, ?)', [
                lessonData.chapter_id,
                lessonData.title,
                lessonData.content || null,
                lessonData.lesson_order
            ]);
            const insertResult = result;
            return insertResult.insertId;
        });
    },
    // Cập nhật thông tin lesson
    updateLesson(lessonId, lessonData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Chuẩn bị các fields cần update
            const fieldsToUpdate = Object.assign({}, lessonData);
            // Tạo câu query động dựa trên các fields cần update
            const entries = Object.entries(fieldsToUpdate);
            if (entries.length === 0)
                return false;
            const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
            const values = entries.map(([_, value]) => value);
            const query = `UPDATE Lessons SET ${setClause} WHERE lesson_id = ?`;
            values.push(lessonId);
            const [result] = yield db_1.pool.query(query, values);
            const updateResult = result;
            return updateResult.affectedRows > 0;
        });
    },
    // Xóa lesson
    deleteLesson(lessonId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield db_1.pool.query('DELETE FROM Lessons WHERE lesson_id = ?', [lessonId]);
            const deleteResult = result;
            return deleteResult.affectedRows > 0;
        });
    },
    // Lấy lesson với tất cả pages
    getLessonWithPages(lessonId) {
        return __awaiter(this, void 0, void 0, function* () {
            const lesson = yield this.getLessonById(lessonId);
            if (!lesson)
                return null;
            // Lấy tất cả pages của lesson
            const [pages] = yield db_1.pool.query('SELECT * FROM Pages WHERE lesson_id = ? ORDER BY page_number', [lessonId]);
            // Lấy tất cả documents của lesson
            const [documents] = yield db_1.pool.query('SELECT * FROM Documents WHERE lesson_id = ?', [lessonId]);
            return Object.assign(Object.assign({}, lesson), { pages,
                documents });
        });
    },
    // Lấy thông tin lesson với chapter và course
    getLessonWithCourseInfo(lessonId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query(`SELECT l.*, c.chapter_id, c.title as chapter_title, co.course_id, co.title as course_title 
       FROM Lessons l
       JOIN Chapters c ON l.chapter_id = c.chapter_id
       JOIN Courses co ON c.course_id = co.course_id
       WHERE l.lesson_id = ?`, [lessonId]);
            const lessonInfo = rows;
            return lessonInfo.length > 0 ? lessonInfo[0] : null;
        });
    }
};
