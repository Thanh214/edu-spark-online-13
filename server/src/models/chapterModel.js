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
exports.ChapterModel = void 0;
const db_1 = require("../config/db");
exports.ChapterModel = {
    // Lấy tất cả các chapters 
    getAllChapters() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query('SELECT * FROM Chapters ORDER BY chapter_order');
            return rows;
        });
    },
    // Lấy chapters theo course ID
    getChaptersByCourseId(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query('SELECT * FROM Chapters WHERE course_id = ? ORDER BY chapter_order', [courseId]);
            return rows;
        });
    },
    // Lấy chapter theo ID
    getChapterById(chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query('SELECT * FROM Chapters WHERE chapter_id = ?', [chapterId]);
            const chapters = rows;
            return chapters.length > 0 ? chapters[0] : null;
        });
    },
    // Tạo chapter mới
    createChapter(chapterData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield db_1.pool.query('INSERT INTO Chapters (course_id, title, description, chapter_order) VALUES (?, ?, ?, ?)', [
                chapterData.course_id,
                chapterData.title,
                chapterData.description || null,
                chapterData.chapter_order
            ]);
            const insertResult = result;
            return insertResult.insertId;
        });
    },
    // Cập nhật thông tin chapter
    updateChapter(chapterId, chapterData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Chuẩn bị các fields cần update
            const fieldsToUpdate = Object.assign({}, chapterData);
            // Tạo câu query động dựa trên các fields cần update
            const entries = Object.entries(fieldsToUpdate);
            if (entries.length === 0)
                return false;
            const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
            const values = entries.map(([_, value]) => value);
            const query = `UPDATE Chapters SET ${setClause} WHERE chapter_id = ?`;
            values.push(chapterId);
            const [result] = yield db_1.pool.query(query, values);
            const updateResult = result;
            return updateResult.affectedRows > 0;
        });
    },
    // Xóa chapter
    deleteChapter(chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield db_1.pool.query('DELETE FROM Chapters WHERE chapter_id = ?', [chapterId]);
            const deleteResult = result;
            return deleteResult.affectedRows > 0;
        });
    },
    // Lấy chapter với tất cả lessons
    getChapterWithLessons(chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chapter = yield this.getChapterById(chapterId);
            if (!chapter)
                return null;
            // Lấy tất cả lessons của chapter
            const [lessons] = yield db_1.pool.query('SELECT * FROM Lessons WHERE chapter_id = ? ORDER BY lesson_order', [chapterId]);
            return Object.assign(Object.assign({}, chapter), { lessons });
        });
    }
};
