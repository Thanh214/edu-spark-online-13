import { Request, Response } from 'express';
import { EnrollmentModel } from '../models/enrollmentModel';
import { CourseModel } from '../models/courseModel';
import { EnrollmentCreateDTO, EnrollmentUpdateDTO } from '../models/types';

export const EnrollmentController = {
  // Lấy tất cả ghi danh (Admin)
  async getAllEnrollments(req: Request, res: Response) {
    try {
      const enrollments = await EnrollmentModel.getAllEnrollments();
      
      res.status(200).json({
        success: true,
        count: enrollments.length,
        data: enrollments
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách ghi danh',
        error: error.message
      });
    }
  },
  
  // Lấy ghi danh theo ID
  async getEnrollmentById(req: Request, res: Response) {
    try {
      const enrollmentId = parseInt(req.params.id);
      
      if (isNaN(enrollmentId)) {
        return res.status(400).json({
          success: false,
          message: 'ID ghi danh không hợp lệ'
        });
      }
      
      const enrollment = await EnrollmentModel.getEnrollmentById(enrollmentId);
      
      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy thông tin ghi danh'
        });
      }
      
      res.status(200).json({
        success: true,
        data: enrollment
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin ghi danh',
        error: error.message
      });
    }
  },
  
  // Lấy chi tiết ghi danh có thông tin khóa học và người dùng
  async getEnrollmentDetails(req: Request, res: Response) {
    try {
      const enrollmentId = parseInt(req.params.id);
      
      if (isNaN(enrollmentId)) {
        return res.status(400).json({
          success: false,
          message: 'ID ghi danh không hợp lệ'
        });
      }
      
      const enrollmentDetails = await EnrollmentModel.getEnrollmentDetails(enrollmentId);
      
      if (!enrollmentDetails) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy thông tin ghi danh'
        });
      }
      
      res.status(200).json({
        success: true,
        data: enrollmentDetails
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin chi tiết ghi danh',
        error: error.message
      });
    }
  },
  
  // Lấy danh sách ghi danh của một người dùng
  async getEnrollmentsByUserId(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: 'ID người dùng không hợp lệ'
        });
      }
      
      // Nếu người dùng hiện tại không phải admin và không phải chính người dùng đó
      if (req.user?.role !== 'admin' && req.user?.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền truy cập thông tin ghi danh của người dùng khác'
        });
      }
      
      const enrollments = await EnrollmentModel.getUserEnrollmentsWithCourses(userId);
      
      res.status(200).json({
        success: true,
        count: enrollments.length,
        data: enrollments
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách ghi danh của người dùng',
        error: error.message
      });
    }
  },
  
  // Lấy danh sách ghi danh của một khóa học (Admin)
  async getEnrollmentsByCourseId(req: Request, res: Response) {
    try {
      const courseId = parseInt(req.params.courseId);
      
      if (isNaN(courseId)) {
        return res.status(400).json({
          success: false,
          message: 'ID khóa học không hợp lệ'
        });
      }
      
      const enrollments = await EnrollmentModel.getEnrollmentsByCourseId(courseId);
      
      res.status(200).json({
        success: true,
        count: enrollments.length,
        data: enrollments
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách ghi danh cho khóa học',
        error: error.message
      });
    }
  },
  
  // Tạo ghi danh mới (đăng ký khóa học)
  async createEnrollment(req: Request, res: Response) {
    try {
      const { courseId } = req.body;
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Bạn cần đăng nhập để đăng ký khóa học'
        });
      }
      
      if (!courseId) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp ID khóa học'
        });
      }
      
      // Kiểm tra xem khóa học có tồn tại không
      const course = await CourseModel.getCourseById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy khóa học'
        });
      }
      
      // Kiểm tra xem người dùng đã đăng ký khóa học này chưa
      const existingEnrollment = await EnrollmentModel.getEnrollmentByUserAndCourse(userId, courseId);
      if (existingEnrollment) {
        return res.status(400).json({
          success: false,
          message: 'Bạn đã đăng ký khóa học này rồi'
        });
      }
      
      // Tạo ghi danh mới
      const enrollmentData: EnrollmentCreateDTO = {
        user_id: userId,
        course_id: courseId,
        progress_percent: 0
      };
      
      const enrollmentId = await EnrollmentModel.createEnrollment(enrollmentData);
      const newEnrollment = await EnrollmentModel.getEnrollmentById(enrollmentId);
      
      res.status(201).json({
        success: true,
        message: 'Đăng ký khóa học thành công',
        data: newEnrollment
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi đăng ký khóa học',
        error: error.message
      });
    }
  },
  
  // Cập nhật tiến độ học
  async updateEnrollmentProgress(req: Request, res: Response) {
    try {
      const enrollmentId = parseInt(req.params.id);
      const { currentLessonId, progressPercent } = req.body;
      
      if (isNaN(enrollmentId)) {
        return res.status(400).json({
          success: false,
          message: 'ID ghi danh không hợp lệ'
        });
      }
      
      // Kiểm tra xem ghi danh có tồn tại không
      const existingEnrollment = await EnrollmentModel.getEnrollmentById(enrollmentId);
      if (!existingEnrollment) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy thông tin ghi danh'
        });
      }
      
      // Kiểm tra quyền truy cập - chỉ cho phép người dùng cập nhật tiến độ của chính mình hoặc admin
      if (req.user?.role !== 'admin' && req.user?.userId !== existingEnrollment.user_id) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền cập nhật tiến độ học của người khác'
        });
      }
      
      // Chuẩn bị dữ liệu cập nhật
      const enrollmentData: EnrollmentUpdateDTO = {};
      
      if (currentLessonId !== undefined) enrollmentData.current_lesson_id = currentLessonId;
      if (progressPercent !== undefined) enrollmentData.progress_percent = progressPercent;
      
      // Cập nhật ghi danh
      await EnrollmentModel.updateEnrollment(enrollmentId, enrollmentData);
      
      // Lấy thông tin ghi danh đã cập nhật
      const updatedEnrollment = await EnrollmentModel.getEnrollmentById(enrollmentId);
      
      res.status(200).json({
        success: true,
        message: 'Cập nhật tiến độ học thành công',
        data: updatedEnrollment
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật tiến độ học',
        error: error.message
      });
    }
  },
  
  // Hủy đăng ký khóa học
  async deleteEnrollment(req: Request, res: Response) {
    try {
      const enrollmentId = parseInt(req.params.id);
      
      if (isNaN(enrollmentId)) {
        return res.status(400).json({
          success: false,
          message: 'ID ghi danh không hợp lệ'
        });
      }
      
      // Kiểm tra xem ghi danh có tồn tại không
      const existingEnrollment = await EnrollmentModel.getEnrollmentById(enrollmentId);
      if (!existingEnrollment) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy thông tin ghi danh'
        });
      }
      
      // Kiểm tra quyền truy cập - chỉ cho phép người dùng hủy đăng ký của chính mình hoặc admin
      if (req.user?.role !== 'admin' && req.user?.userId !== existingEnrollment.user_id) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền hủy đăng ký khóa học của người khác'
        });
      }
      
      // Xóa ghi danh
      await EnrollmentModel.deleteEnrollment(enrollmentId);
      
      res.status(200).json({
        success: true,
        message: 'Hủy đăng ký khóa học thành công'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi hủy đăng ký khóa học',
        error: error.message
      });
    }
  }
}; 