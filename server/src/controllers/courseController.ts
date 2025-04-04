import { Request, Response } from 'express';
import { CourseModel } from '../models/courseModel';
import { ChapterModel } from '../models/chapterModel';
import { CourseCreateDTO, CourseUpdateDTO } from '../models/types';

export const CourseController = {
  // Lấy tất cả khóa học
  async getAllCourses(req: Request, res: Response) {
    try {
      const courses = await CourseModel.getAllCourses();
      
      res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách khóa học',
        error: error.message
      });
    }
  },
  
  // Lấy thông tin khóa học theo ID
  async getCourseById(req: Request, res: Response) {
    try {
      const courseId = parseInt(req.params.id);
      
      if (isNaN(courseId)) {
        return res.status(400).json({
          success: false,
          message: 'ID khóa học không hợp lệ'
        });
      }
      
      const course = await CourseModel.getCourseById(courseId);
      
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy khóa học'
        });
      }
      
      res.status(200).json({
        success: true,
        data: course
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin khóa học',
        error: error.message
      });
    }
  },
  
  // Lấy thông tin chi tiết khóa học với chương và bài học
  async getCourseWithDetails(req: Request, res: Response) {
    try {
      const courseId = parseInt(req.params.id);
      
      if (isNaN(courseId)) {
        return res.status(400).json({
          success: false,
          message: 'ID khóa học không hợp lệ'
        });
      }
      
      const courseDetails = await CourseModel.getCourseWithDetails(courseId);
      
      if (!courseDetails) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy khóa học'
        });
      }
      
      res.status(200).json({
        success: true,
        data: courseDetails
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin chi tiết khóa học',
        error: error.message
      });
    }
  },
  
  // Tạo khóa học mới (Admin)
  async createCourse(req: Request, res: Response) {
    try {
      const { title, description } = req.body;
      
      // Kiểm tra trường bắt buộc
      if (!title) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp tiêu đề khóa học'
        });
      }
      
      // Tạo DTO
      const courseData: CourseCreateDTO = {
        title,
        description: description || null
      };
      
      // Nếu có file hình ảnh
      if (req.file) {
        courseData.thumbnail = req.file.path;
      }
      
      const courseId = await CourseModel.createCourse(courseData);
      const newCourse = await CourseModel.getCourseById(courseId);
      
      res.status(201).json({
        success: true,
        message: 'Tạo khóa học thành công',
        data: newCourse
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo khóa học',
        error: error.message
      });
    }
  },
  
  // Cập nhật khóa học (Admin)
  async updateCourse(req: Request, res: Response) {
    try {
      const courseId = parseInt(req.params.id);
      
      if (isNaN(courseId)) {
        return res.status(400).json({
          success: false,
          message: 'ID khóa học không hợp lệ'
        });
      }
      
      const { title, description } = req.body;
      
      // Kiểm tra xem khóa học có tồn tại không
      const existingCourse = await CourseModel.getCourseById(courseId);
      if (!existingCourse) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy khóa học'
        });
      }
      
      // Chuẩn bị dữ liệu cập nhật
      const courseData: CourseUpdateDTO = {};
      
      if (title !== undefined) courseData.title = title;
      if (description !== undefined) courseData.description = description;
      
      // Nếu có file hình ảnh mới
      if (req.file) {
        courseData.thumbnail = req.file.path;
      }
      
      // Cập nhật khóa học
      await CourseModel.updateCourse(courseId, courseData);
      
      // Lấy thông tin khóa học đã cập nhật
      const updatedCourse = await CourseModel.getCourseById(courseId);
      
      res.status(200).json({
        success: true,
        message: 'Cập nhật khóa học thành công',
        data: updatedCourse
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật khóa học',
        error: error.message
      });
    }
  },
  
  // Xóa khóa học (Admin)
  async deleteCourse(req: Request, res: Response) {
    try {
      const courseId = parseInt(req.params.id);
      
      if (isNaN(courseId)) {
        return res.status(400).json({
          success: false,
          message: 'ID khóa học không hợp lệ'
        });
      }
      
      // Kiểm tra xem khóa học có tồn tại không
      const existingCourse = await CourseModel.getCourseById(courseId);
      if (!existingCourse) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy khóa học'
        });
      }
      
      // Xóa khóa học
      await CourseModel.deleteCourse(courseId);
      
      res.status(200).json({
        success: true,
        message: 'Xóa khóa học thành công'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa khóa học',
        error: error.message
      });
    }
  },
  
  // Lấy các chương của khóa học
  async getCourseChapters(req: Request, res: Response) {
    try {
      const courseId = parseInt(req.params.id);
      
      if (isNaN(courseId)) {
        return res.status(400).json({
          success: false,
          message: 'ID khóa học không hợp lệ'
        });
      }
      
      // Kiểm tra xem khóa học có tồn tại không
      const existingCourse = await CourseModel.getCourseById(courseId);
      if (!existingCourse) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy khóa học'
        });
      }
      
      // Lấy danh sách các chương của khóa học
      const chapters = await ChapterModel.getChaptersByCourseId(courseId);
      
      res.status(200).json({
        success: true,
        count: chapters.length,
        data: chapters
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách chương của khóa học',
        error: error.message
      });
    }
  }
}; 