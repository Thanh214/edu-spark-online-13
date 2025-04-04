import { pool } from '../config/db';
import { Enrollment, EnrollmentCreateDTO, EnrollmentUpdateDTO } from './types';

export const EnrollmentModel = {
  // Lấy tất cả enrollments
  async getAllEnrollments(): Promise<Enrollment[]> {
    const [rows] = await pool.query('SELECT * FROM Enrollments');
    return rows as Enrollment[];
  },

  // Lấy enrollments theo user ID
  async getEnrollmentsByUserId(userId: number): Promise<Enrollment[]> {
    const [rows] = await pool.query(
      'SELECT * FROM Enrollments WHERE user_id = ?',
      [userId]
    );
    return rows as Enrollment[];
  },

  // Lấy enrollments theo course ID
  async getEnrollmentsByCourseId(courseId: number): Promise<Enrollment[]> {
    const [rows] = await pool.query(
      'SELECT * FROM Enrollments WHERE course_id = ?',
      [courseId]
    );
    return rows as Enrollment[];
  },

  // Lấy enrollment theo ID
  async getEnrollmentById(enrollmentId: number): Promise<Enrollment | null> {
    const [rows] = await pool.query(
      'SELECT * FROM Enrollments WHERE enrollment_id = ?',
      [enrollmentId]
    );
    const enrollments = rows as Enrollment[];
    return enrollments.length > 0 ? enrollments[0] : null;
  },

  // Lấy enrollment theo user ID và course ID
  async getEnrollmentByUserAndCourse(userId: number, courseId: number): Promise<Enrollment | null> {
    const [rows] = await pool.query(
      'SELECT * FROM Enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );
    const enrollments = rows as Enrollment[];
    return enrollments.length > 0 ? enrollments[0] : null;
  },

  // Tạo enrollment mới
  async createEnrollment(enrollmentData: EnrollmentCreateDTO): Promise<number> {
    const [result] = await pool.query(
      'INSERT INTO Enrollments (user_id, course_id, current_lesson_id, progress_percent) VALUES (?, ?, ?, ?)',
      [
        enrollmentData.user_id,
        enrollmentData.course_id,
        enrollmentData.current_lesson_id || null,
        enrollmentData.progress_percent || 0
      ]
    );
    
    const insertResult = result as { insertId: number };
    return insertResult.insertId;
  },

  // Cập nhật thông tin enrollment
  async updateEnrollment(enrollmentId: number, enrollmentData: EnrollmentUpdateDTO): Promise<boolean> {
    // Chuẩn bị các fields cần update
    const fieldsToUpdate: Record<string, any> = { ...enrollmentData };
    
    // Tạo câu query động dựa trên các fields cần update
    const entries = Object.entries(fieldsToUpdate);
    if (entries.length === 0) return false;
    
    const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = entries.map(([_, value]) => value);
    
    const query = `UPDATE Enrollments SET ${setClause} WHERE enrollment_id = ?`;
    values.push(enrollmentId);
    
    const [result] = await pool.query(query, values);
    const updateResult = result as { affectedRows: number };
    return updateResult.affectedRows > 0;
  },

  // Cập nhật progress cho enrollment theo user ID và course ID
  async updateEnrollmentProgress(userId: number, courseId: number, currentLessonId: number, progressPercent: number): Promise<boolean> {
    const [result] = await pool.query(
      'UPDATE Enrollments SET current_lesson_id = ?, progress_percent = ? WHERE user_id = ? AND course_id = ?',
      [currentLessonId, progressPercent, userId, courseId]
    );
    const updateResult = result as { affectedRows: number };
    return updateResult.affectedRows > 0;
  },

  // Xóa enrollment
  async deleteEnrollment(enrollmentId: number): Promise<boolean> {
    const [result] = await pool.query(
      'DELETE FROM Enrollments WHERE enrollment_id = ?',
      [enrollmentId]
    );
    const deleteResult = result as { affectedRows: number };
    return deleteResult.affectedRows > 0;
  },

  // Lấy thông tin chi tiết enrollment với thông tin khóa học và user
  async getEnrollmentDetails(enrollmentId: number): Promise<any> {
    const [rows] = await pool.query(
      `SELECT e.*, c.title as course_title, c.description as course_description, 
          u.full_name, u.email, l.title as current_lesson_title
       FROM Enrollments e
       JOIN Courses c ON e.course_id = c.course_id
       JOIN Users u ON e.user_id = u.user_id
       LEFT JOIN Lessons l ON e.current_lesson_id = l.lesson_id
       WHERE e.enrollment_id = ?`,
      [enrollmentId]
    );
    
    const enrollmentDetails = rows as any[];
    return enrollmentDetails.length > 0 ? enrollmentDetails[0] : null;
  },

  // Lấy tất cả khóa học đã đăng ký của một user với thông tin chi tiết
  async getUserEnrollmentsWithCourses(userId: number): Promise<any[]> {
    const [rows] = await pool.query(
      `SELECT e.*, c.title as course_title, c.description as course_description, 
          c.thumbnail, l.title as current_lesson_title
       FROM Enrollments e
       JOIN Courses c ON e.course_id = c.course_id
       LEFT JOIN Lessons l ON e.current_lesson_id = l.lesson_id
       WHERE e.user_id = ?`,
      [userId]
    );
    
    return rows as any[];
  }
}; 