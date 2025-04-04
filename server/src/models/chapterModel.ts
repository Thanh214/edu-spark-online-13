import { pool } from '../config/db';
import { Chapter, ChapterCreateDTO, ChapterUpdateDTO } from './types';

export const ChapterModel = {
  // Lấy tất cả các chapters 
  async getAllChapters(): Promise<Chapter[]> {
    const [rows] = await pool.query('SELECT * FROM Chapters ORDER BY chapter_order');
    return rows as Chapter[];
  },

  // Lấy chapters theo course ID
  async getChaptersByCourseId(courseId: number): Promise<Chapter[]> {
    const [rows] = await pool.query(
      'SELECT * FROM Chapters WHERE course_id = ? ORDER BY chapter_order',
      [courseId]
    );
    return rows as Chapter[];
  },

  // Lấy chapter theo ID
  async getChapterById(chapterId: number): Promise<Chapter | null> {
    const [rows] = await pool.query(
      'SELECT * FROM Chapters WHERE chapter_id = ?',
      [chapterId]
    );
    const chapters = rows as Chapter[];
    return chapters.length > 0 ? chapters[0] : null;
  },

  // Tạo chapter mới
  async createChapter(chapterData: ChapterCreateDTO): Promise<number> {
    const [result] = await pool.query(
      'INSERT INTO Chapters (course_id, title, description, chapter_order) VALUES (?, ?, ?, ?)',
      [
        chapterData.course_id, 
        chapterData.title, 
        chapterData.description || null, 
        chapterData.chapter_order
      ]
    );
    
    const insertResult = result as { insertId: number };
    return insertResult.insertId;
  },

  // Cập nhật thông tin chapter
  async updateChapter(chapterId: number, chapterData: ChapterUpdateDTO): Promise<boolean> {
    // Chuẩn bị các fields cần update
    const fieldsToUpdate: Record<string, any> = { ...chapterData };
    
    // Tạo câu query động dựa trên các fields cần update
    const entries = Object.entries(fieldsToUpdate);
    if (entries.length === 0) return false;
    
    const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = entries.map(([_, value]) => value);
    
    const query = `UPDATE Chapters SET ${setClause} WHERE chapter_id = ?`;
    values.push(chapterId);
    
    const [result] = await pool.query(query, values);
    const updateResult = result as { affectedRows: number };
    return updateResult.affectedRows > 0;
  },

  // Xóa chapter
  async deleteChapter(chapterId: number): Promise<boolean> {
    const [result] = await pool.query(
      'DELETE FROM Chapters WHERE chapter_id = ?',
      [chapterId]
    );
    const deleteResult = result as { affectedRows: number };
    return deleteResult.affectedRows > 0;
  },

  // Lấy chapter với tất cả lessons
  async getChapterWithLessons(chapterId: number): Promise<any> {
    const chapter = await this.getChapterById(chapterId);
    if (!chapter) return null;

    // Lấy tất cả lessons của chapter
    const [lessons] = await pool.query(
      'SELECT * FROM Lessons WHERE chapter_id = ? ORDER BY lesson_order',
      [chapterId]
    );

    return {
      ...chapter,
      lessons
    };
  }
}; 