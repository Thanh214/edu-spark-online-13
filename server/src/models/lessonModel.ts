import { pool } from '../config/db';
import { Lesson, LessonCreateDTO, LessonUpdateDTO } from './types';

export const LessonModel = {
  // Lấy tất cả các lessons
  async getAllLessons(): Promise<Lesson[]> {
    const [rows] = await pool.query('SELECT * FROM Lessons ORDER BY lesson_order');
    return rows as Lesson[];
  },

  // Lấy lessons theo chapter ID
  async getLessonsByChapterId(chapterId: number): Promise<Lesson[]> {
    const [rows] = await pool.query(
      'SELECT * FROM Lessons WHERE chapter_id = ? ORDER BY lesson_order',
      [chapterId]
    );
    return rows as Lesson[];
  },

  // Lấy lesson theo ID
  async getLessonById(lessonId: number): Promise<Lesson | null> {
    const [rows] = await pool.query(
      'SELECT * FROM Lessons WHERE lesson_id = ?',
      [lessonId]
    );
    const lessons = rows as Lesson[];
    return lessons.length > 0 ? lessons[0] : null;
  },

  // Tạo lesson mới
  async createLesson(lessonData: LessonCreateDTO): Promise<number> {
    const [result] = await pool.query(
      'INSERT INTO Lessons (chapter_id, title, content, lesson_order) VALUES (?, ?, ?, ?)',
      [
        lessonData.chapter_id, 
        lessonData.title, 
        lessonData.content || null, 
        lessonData.lesson_order
      ]
    );
    
    const insertResult = result as { insertId: number };
    return insertResult.insertId;
  },

  // Cập nhật thông tin lesson
  async updateLesson(lessonId: number, lessonData: LessonUpdateDTO): Promise<boolean> {
    // Chuẩn bị các fields cần update
    const fieldsToUpdate: Record<string, any> = { ...lessonData };
    
    // Tạo câu query động dựa trên các fields cần update
    const entries = Object.entries(fieldsToUpdate);
    if (entries.length === 0) return false;
    
    const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = entries.map(([_, value]) => value);
    
    const query = `UPDATE Lessons SET ${setClause} WHERE lesson_id = ?`;
    values.push(lessonId);
    
    const [result] = await pool.query(query, values);
    const updateResult = result as { affectedRows: number };
    return updateResult.affectedRows > 0;
  },

  // Xóa lesson
  async deleteLesson(lessonId: number): Promise<boolean> {
    const [result] = await pool.query(
      'DELETE FROM Lessons WHERE lesson_id = ?',
      [lessonId]
    );
    const deleteResult = result as { affectedRows: number };
    return deleteResult.affectedRows > 0;
  },

  // Lấy lesson với tất cả pages
  async getLessonWithPages(lessonId: number): Promise<any> {
    const lesson = await this.getLessonById(lessonId);
    if (!lesson) return null;

    // Lấy tất cả pages của lesson
    const [pages] = await pool.query(
      'SELECT * FROM Pages WHERE lesson_id = ? ORDER BY page_number',
      [lessonId]
    );

    // Lấy tất cả documents của lesson
    const [documents] = await pool.query(
      'SELECT * FROM Documents WHERE lesson_id = ?',
      [lessonId]
    );

    return {
      ...lesson,
      pages,
      documents
    };
  },

  // Lấy thông tin lesson với chapter và course
  async getLessonWithCourseInfo(lessonId: number): Promise<any> {
    const [rows] = await pool.query(
      `SELECT l.*, c.chapter_id, c.title as chapter_title, co.course_id, co.title as course_title 
       FROM Lessons l
       JOIN Chapters c ON l.chapter_id = c.chapter_id
       JOIN Courses co ON c.course_id = co.course_id
       WHERE l.lesson_id = ?`,
      [lessonId]
    );
    
    const lessonInfo = rows as any[];
    return lessonInfo.length > 0 ? lessonInfo[0] : null;
  }
}; 