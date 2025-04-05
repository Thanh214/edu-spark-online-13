
import { pool } from '../config/db';
import { Page, PageCreateDTO, PageUpdateDTO } from './types';

export const PageModel = {
  // Lấy tất cả các pages
  async getAllPages(): Promise<Page[]> {
    const [rows] = await pool.query('SELECT * FROM Pages ORDER BY page_number');
    return rows as Page[];
  },

  // Lấy pages theo lesson ID
  async getPagesByLessonId(lessonId: number): Promise<Page[]> {
    const [rows] = await pool.query(
      'SELECT * FROM Pages WHERE lesson_id = ? ORDER BY page_number',
      [lessonId]
    );
    return rows as Page[];
  },

  // Lấy page theo ID
  async getPageById(pageId: number): Promise<Page | null> {
    const [rows] = await pool.query(
      'SELECT * FROM Pages WHERE page_id = ?',
      [pageId]
    );
    const pages = rows as Page[];
    return pages.length > 0 ? pages[0] : null;
  },

  // Tạo page mới
  async createPage(pageData: PageCreateDTO): Promise<number> {
    const [result] = await pool.query(
      'INSERT INTO Pages (lesson_id, page_number, content) VALUES (?, ?, ?)',
      [
        pageData.lesson_id, 
        pageData.page_number, 
        pageData.content || null
      ]
    );
    
    const insertResult = result as { insertId: number };
    return insertResult.insertId;
  },

  // Cập nhật thông tin page
  async updatePage(pageId: number, pageData: PageUpdateDTO): Promise<boolean> {
    // Chuẩn bị các fields cần update
    const fieldsToUpdate: Record<string, any> = { ...pageData };
    
    // Tạo câu query động dựa trên các fields cần update
    const entries = Object.entries(fieldsToUpdate);
    if (entries.length === 0) return false;
    
    const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = entries.map(([_, value]) => value);
    
    const query = `UPDATE Pages SET ${setClause} WHERE page_id = ?`;
    values.push(pageId);
    
    const [result] = await pool.query(query, values);
    const updateResult = result as { affectedRows: number };
    return updateResult.affectedRows > 0;
  },

  // Xóa page
  async deletePage(pageId: number): Promise<boolean> {
    const [result] = await pool.query(
      'DELETE FROM Pages WHERE page_id = ?',
      [pageId]
    );
    const deleteResult = result as { affectedRows: number };
    return deleteResult.affectedRows > 0;
  }
};
