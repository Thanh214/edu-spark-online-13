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
exports.ExamModel = void 0;
const db_1 = require("../config/db");
exports.ExamModel = {
    // Lấy tất cả các exams
    getAllExams() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query('SELECT * FROM Exams');
            return rows;
        });
    },
    // Lấy exams theo course ID
    getExamsByCourseId(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query('SELECT * FROM Exams WHERE course_id = ?', [courseId]);
            return rows;
        });
    },
    // Lấy exams theo chapter ID
    getExamsByChapterId(chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query('SELECT * FROM Exams WHERE chapter_id = ?', [chapterId]);
            return rows;
        });
    },
    // Lấy exam theo ID
    getExamById(examId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query('SELECT * FROM Exams WHERE exam_id = ?', [examId]);
            const exams = rows;
            return exams.length > 0 ? exams[0] : null;
        });
    },
    // Tạo exam mới
    createExam(examData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield db_1.pool.query('INSERT INTO Exams (course_id, chapter_id, title, time_limit, total_questions, passing_score) VALUES (?, ?, ?, ?, ?, ?)', [
                examData.course_id || null,
                examData.chapter_id || null,
                examData.title || null,
                examData.time_limit || null,
                examData.total_questions || null,
                examData.passing_score || null
            ]);
            const insertResult = result;
            return insertResult.insertId;
        });
    },
    // Cập nhật thông tin exam
    updateExam(examId, examData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Chuẩn bị các fields cần update
            const fieldsToUpdate = Object.assign({}, examData);
            // Tạo câu query động dựa trên các fields cần update
            const entries = Object.entries(fieldsToUpdate);
            if (entries.length === 0)
                return false;
            const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
            const values = entries.map(([_, value]) => value);
            const query = `UPDATE Exams SET ${setClause} WHERE exam_id = ?`;
            values.push(examId);
            const [result] = yield db_1.pool.query(query, values);
            const updateResult = result;
            return updateResult.affectedRows > 0;
        });
    },
    // Xóa exam
    deleteExam(examId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield db_1.pool.query('DELETE FROM Exams WHERE exam_id = ?', [examId]);
            const deleteResult = result;
            return deleteResult.affectedRows > 0;
        });
    },
    // Lấy exam với tất cả questions
    getExamWithQuestions(examId) {
        return __awaiter(this, void 0, void 0, function* () {
            const exam = yield this.getExamById(examId);
            if (!exam)
                return null;
            // Lấy tất cả questions của exam
            const [questions] = yield db_1.pool.query('SELECT * FROM Questions WHERE exam_id = ?', [examId]);
            return Object.assign(Object.assign({}, exam), { questions });
        });
    },
    // Lấy tất cả questions của một exam
    getQuestionsByExamId(examId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query('SELECT * FROM Questions WHERE exam_id = ?', [examId]);
            return rows;
        });
    },
    // Lấy question theo ID
    getQuestionById(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query('SELECT * FROM Questions WHERE question_id = ?', [questionId]);
            const questions = rows;
            return questions.length > 0 ? questions[0] : null;
        });
    },
    // Tạo question mới
    createQuestion(questionData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield db_1.pool.query('INSERT INTO Questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)', [
                questionData.exam_id,
                questionData.question_text,
                questionData.option_a,
                questionData.option_b,
                questionData.option_c,
                questionData.option_d,
                questionData.correct_answer
            ]);
            const insertResult = result;
            return insertResult.insertId;
        });
    },
    // Cập nhật thông tin question
    updateQuestion(questionId, questionData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Chuẩn bị các fields cần update
            const fieldsToUpdate = Object.assign({}, questionData);
            // Tạo câu query động dựa trên các fields cần update
            const entries = Object.entries(fieldsToUpdate);
            if (entries.length === 0)
                return false;
            const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
            const values = entries.map(([_, value]) => value);
            const query = `UPDATE Questions SET ${setClause} WHERE question_id = ?`;
            values.push(questionId);
            const [result] = yield db_1.pool.query(query, values);
            const updateResult = result;
            return updateResult.affectedRows > 0;
        });
    },
    // Xóa question
    deleteQuestion(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield db_1.pool.query('DELETE FROM Questions WHERE question_id = ?', [questionId]);
            const deleteResult = result;
            return deleteResult.affectedRows > 0;
        });
    }
};
