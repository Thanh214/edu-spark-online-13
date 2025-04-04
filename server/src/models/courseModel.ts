import { pool } from '../config/db';
import { Course, CourseCreateDTO, CourseUpdateDTO } from './types';

export const CourseModel = {
  // Lấy tất cả các khóa học
  async getAllCourses(): Promise<Course[]> {
    const [rows] = await pool.query('SELECT * FROM Courses');
    return rows as Course[];
  },

  // Lấy khóa học theo ID
  async getCourseById(courseId: number): Promise<Course | null> {
    const [rows] = await pool.query(
      'SELECT * FROM Courses WHERE course_id = ?',
      [courseId]
    );
    const courses = rows as Course[];
    return courses.length > 0 ? courses[0] : null;
  },

  // Tạo khóa học mới
  async createCourse(courseData: CourseCreateDTO): Promise<number> {
    const [result] = await pool.query(
      'INSERT INTO Courses (title, description, thumbnail) VALUES (?, ?, ?)',
      [courseData.title, courseData.description || null, courseData.thumbnail || null]
    );
    
    const insertResult = result as { insertId: number };
    return insertResult.insertId;
  },

  // Cập nhật thông tin khóa học
  async updateCourse(courseId: number, courseData: CourseUpdateDTO): Promise<boolean> {
    // Chuẩn bị các fields cần update
    const fieldsToUpdate: Record<string, any> = { ...courseData };
    
    // Tạo câu query động dựa trên các fields cần update
    const entries = Object.entries(fieldsToUpdate);
    if (entries.length === 0) return false;
    
    const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = entries.map(([_, value]) => value);
    
    const query = `UPDATE Courses SET ${setClause} WHERE course_id = ?`;
    values.push(courseId);
    
    const [result] = await pool.query(query, values);
    const updateResult = result as { affectedRows: number };
    return updateResult.affectedRows > 0;
  },

  // Xóa khóa học
  async deleteCourse(courseId: number): Promise<boolean> {
    const [result] = await pool.query(
      'DELETE FROM Courses WHERE course_id = ?',
      [courseId]
    );
    const deleteResult = result as { affectedRows: number };
    return deleteResult.affectedRows > 0;
  },

  // Lấy thông tin chi tiết khóa học bao gồm chapters và lessons
  async getCourseWithDetails(courseId: number): Promise<any> {
    const course = await this.getCourseById(courseId);
    if (!course) return null;

    // Lấy tất cả chapters của khóa học
    const [chapters] = await pool.query(
      'SELECT * FROM Chapters WHERE course_id = ? ORDER BY chapter_order',
      [courseId]
    );

    // Lấy lessons của từng chapter
    const chaptersWithLessons = await Promise.all((chapters as any[]).map(async (chapter) => {
      const [lessons] = await pool.query(
        'SELECT * FROM Lessons WHERE chapter_id = ? ORDER BY lesson_order',
        [chapter.chapter_id]
      );
      return {
        ...chapter,
        lessons
      };
    }));

    return {
      ...course,
      chapters: chaptersWithLessons
    };
  }
}; 