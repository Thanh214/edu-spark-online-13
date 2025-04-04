import { pool } from '../config/db';
import { Exam, ExamCreateDTO, ExamUpdateDTO, Question, QuestionCreateDTO, QuestionUpdateDTO } from './types';

export const ExamModel = {
  // Lấy tất cả các exams
  async getAllExams(): Promise<Exam[]> {
    const [rows] = await pool.query('SELECT * FROM Exams');
    return rows as Exam[];
  },

  // Lấy exams theo course ID
  async getExamsByCourseId(courseId: number): Promise<Exam[]> {
    const [rows] = await pool.query(
      'SELECT * FROM Exams WHERE course_id = ?',
      [courseId]
    );
    return rows as Exam[];
  },

  // Lấy exams theo chapter ID
  async getExamsByChapterId(chapterId: number): Promise<Exam[]> {
    const [rows] = await pool.query(
      'SELECT * FROM Exams WHERE chapter_id = ?',
      [chapterId]
    );
    return rows as Exam[];
  },

  // Lấy exam theo ID
  async getExamById(examId: number): Promise<Exam | null> {
    const [rows] = await pool.query(
      'SELECT * FROM Exams WHERE exam_id = ?',
      [examId]
    );
    const exams = rows as Exam[];
    return exams.length > 0 ? exams[0] : null;
  },

  // Tạo exam mới
  async createExam(examData: ExamCreateDTO): Promise<number> {
    const [result] = await pool.query(
      'INSERT INTO Exams (course_id, chapter_id, title, time_limit, total_questions, passing_score) VALUES (?, ?, ?, ?, ?, ?)',
      [
        examData.course_id || null, 
        examData.chapter_id || null, 
        examData.title || null, 
        examData.time_limit || null,
        examData.total_questions || null,
        examData.passing_score || null
      ]
    );
    
    const insertResult = result as { insertId: number };
    return insertResult.insertId;
  },

  // Cập nhật thông tin exam
  async updateExam(examId: number, examData: ExamUpdateDTO): Promise<boolean> {
    // Chuẩn bị các fields cần update
    const fieldsToUpdate: Record<string, any> = { ...examData };
    
    // Tạo câu query động dựa trên các fields cần update
    const entries = Object.entries(fieldsToUpdate);
    if (entries.length === 0) return false;
    
    const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = entries.map(([_, value]) => value);
    
    const query = `UPDATE Exams SET ${setClause} WHERE exam_id = ?`;
    values.push(examId);
    
    const [result] = await pool.query(query, values);
    const updateResult = result as { affectedRows: number };
    return updateResult.affectedRows > 0;
  },

  // Xóa exam
  async deleteExam(examId: number): Promise<boolean> {
    const [result] = await pool.query(
      'DELETE FROM Exams WHERE exam_id = ?',
      [examId]
    );
    const deleteResult = result as { affectedRows: number };
    return deleteResult.affectedRows > 0;
  },

  // Lấy exam với tất cả questions
  async getExamWithQuestions(examId: number): Promise<any> {
    const exam = await this.getExamById(examId);
    if (!exam) return null;

    // Lấy tất cả questions của exam
    const [questions] = await pool.query(
      'SELECT * FROM Questions WHERE exam_id = ?',
      [examId]
    );

    return {
      ...exam,
      questions
    };
  },

  // Lấy tất cả questions của một exam
  async getQuestionsByExamId(examId: number): Promise<Question[]> {
    const [rows] = await pool.query(
      'SELECT * FROM Questions WHERE exam_id = ?',
      [examId]
    );
    return rows as Question[];
  },

  // Lấy question theo ID
  async getQuestionById(questionId: number): Promise<Question | null> {
    const [rows] = await pool.query(
      'SELECT * FROM Questions WHERE question_id = ?',
      [questionId]
    );
    const questions = rows as Question[];
    return questions.length > 0 ? questions[0] : null;
  },

  // Tạo question mới
  async createQuestion(questionData: QuestionCreateDTO): Promise<number> {
    const [result] = await pool.query(
      'INSERT INTO Questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        questionData.exam_id,
        questionData.question_text,
        questionData.option_a,
        questionData.option_b,
        questionData.option_c,
        questionData.option_d,
        questionData.correct_answer
      ]
    );
    
    const insertResult = result as { insertId: number };
    return insertResult.insertId;
  },

  // Cập nhật thông tin question
  async updateQuestion(questionId: number, questionData: QuestionUpdateDTO): Promise<boolean> {
    // Chuẩn bị các fields cần update
    const fieldsToUpdate: Record<string, any> = { ...questionData };
    
    // Tạo câu query động dựa trên các fields cần update
    const entries = Object.entries(fieldsToUpdate);
    if (entries.length === 0) return false;
    
    const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = entries.map(([_, value]) => value);
    
    const query = `UPDATE Questions SET ${setClause} WHERE question_id = ?`;
    values.push(questionId);
    
    const [result] = await pool.query(query, values);
    const updateResult = result as { affectedRows: number };
    return updateResult.affectedRows > 0;
  },

  // Xóa question
  async deleteQuestion(questionId: number): Promise<boolean> {
    const [result] = await pool.query(
      'DELETE FROM Questions WHERE question_id = ?',
      [questionId]
    );
    const deleteResult = result as { affectedRows: number };
    return deleteResult.affectedRows > 0;
  }
}; 