
import { Request, Response } from 'express';
import { LessonModel } from '../models/lessonModel';
import { LessonCreateDTO, LessonUpdateDTO } from '../models/types';

export const LessonController = {
  // Lấy bài học theo ID
  async getLessonById(req: Request, res: Response): Promise<void> {
    try {
      const lessonId = parseInt(req.params.id);
      
      if (isNaN(lessonId)) {
        res.status(400).json({
          success: false,
          message: 'ID bài học không hợp lệ'
        });
        return;
      }
      
      const lesson = await LessonModel.getLessonById(lessonId);
      
      if (!lesson) {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy bài học'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: lesson
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin bài học',
        error: error.message
      });
    }
  },
  
  // Lấy bài học kèm theo pages
  async getLessonWithPages(req: Request, res: Response): Promise<void> {
    try {
      const lessonId = parseInt(req.params.id);
      
      if (isNaN(lessonId)) {
        res.status(400).json({
          success: false,
          message: 'ID bài học không hợp lệ'
        });
        return;
      }
      
      const lessonWithPages = await LessonModel.getLessonWithPages(lessonId);
      
      if (!lessonWithPages) {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy bài học'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: lessonWithPages
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin bài học và trang',
        error: error.message
      });
    }
  },
  
  // Lấy bài học theo chapter ID
  async getLessonsByChapterId(req: Request, res: Response): Promise<void> {
    try {
      const chapterId = parseInt(req.params.chapterId);
      
      if (isNaN(chapterId)) {
        res.status(400).json({
          success: false,
          message: 'ID chương không hợp lệ'
        });
        return;
      }
      
      const lessons = await LessonModel.getLessonsByChapterId(chapterId);
      
      res.status(200).json({
        success: true,
        count: lessons.length,
        data: lessons
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách bài học',
        error: error.message
      });
    }
  },
  
  // Tạo bài học mới
  async createLesson(req: Request, res: Response): Promise<void> {
    try {
      const { chapter_id, title, content, lesson_order } = req.body;
      
      // Kiểm tra các trường bắt buộc
      if (!chapter_id || !title || lesson_order === undefined) {
        res.status(400).json({
          success: false,
          message: 'Thiếu thông tin bắt buộc: chapter_id, title, lesson_order'
        });
        return;
      }
      
      const lessonData: LessonCreateDTO = {
        chapter_id: parseInt(chapter_id),
        title,
        content: content || null,
        lesson_order: parseInt(lesson_order)
      };
      
      const lessonId = await LessonModel.createLesson(lessonData);
      const newLesson = await LessonModel.getLessonById(lessonId);
      
      res.status(201).json({
        success: true,
        message: 'Tạo bài học thành công',
        data: newLesson
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo bài học',
        error: error.message
      });
    }
  },
  
  // Cập nhật bài học
  async updateLesson(req: Request, res: Response): Promise<void> {
    try {
      const lessonId = parseInt(req.params.id);
      
      if (isNaN(lessonId)) {
        res.status(400).json({
          success: false,
          message: 'ID bài học không hợp lệ'
        });
        return;
      }
      
      // Kiểm tra xem bài học có tồn tại không
      const existingLesson = await LessonModel.getLessonById(lessonId);
      if (!existingLesson) {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy bài học'
        });
        return;
      }
      
      const { title, content, lesson_order, chapter_id } = req.body;
      
      // Chuẩn bị dữ liệu cập nhật
      const lessonData: LessonUpdateDTO = {};
      
      if (title !== undefined) lessonData.title = title;
      if (content !== undefined) lessonData.content = content;
      if (lesson_order !== undefined) lessonData.lesson_order = parseInt(lesson_order);
      if (chapter_id !== undefined) lessonData.chapter_id = parseInt(chapter_id);
      
      // Cập nhật bài học
      await LessonModel.updateLesson(lessonId, lessonData);
      
      // Lấy thông tin bài học đã cập nhật
      const updatedLesson = await LessonModel.getLessonById(lessonId);
      
      res.status(200).json({
        success: true,
        message: 'Cập nhật bài học thành công',
        data: updatedLesson
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật bài học',
        error: error.message
      });
    }
  },
  
  // Xóa bài học
  async deleteLesson(req: Request, res: Response): Promise<void> {
    try {
      const lessonId = parseInt(req.params.id);
      
      if (isNaN(lessonId)) {
        res.status(400).json({
          success: false,
          message: 'ID bài học không hợp lệ'
        });
        return;
      }
      
      // Kiểm tra xem bài học có tồn tại không
      const existingLesson = await LessonModel.getLessonById(lessonId);
      if (!existingLesson) {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy bài học'
        });
        return;
      }
      
      // Xóa bài học
      await LessonModel.deleteLesson(lessonId);
      
      res.status(200).json({
        success: true,
        message: 'Xóa bài học thành công'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa bài học',
        error: error.message
      });
    }
  },
  
  // Upload document for a lesson
  async uploadDocument(req: Request, res: Response): Promise<void> {
    try {
      const lessonId = parseInt(req.params.id);
      const { title } = req.body;
      
      if (isNaN(lessonId)) {
        res.status(400).json({
          success: false,
          message: 'ID bài học không hợp lệ'
        });
        return;
      }
      
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'Không tìm thấy file'
        });
        return;
      }
      
      if (!title) {
        res.status(400).json({
          success: false, 
          message: 'Thiếu tiêu đề tài liệu'
        });
        return;
      }
      
      // Lưu document vào database
      // Giả định rằng chúng ta có một hàm để lưu trong model
      // Trong một ứng dụng thực tế, cần bổ sung model này
      
      res.status(201).json({
        success: true,
        message: 'Tải tài liệu thành công',
        data: {
          document_id: 1, // ID giả định
          lesson_id: lessonId,
          title: title,
          file_path: req.file.path
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tải lên tài liệu',
        error: error.message
      });
    }
  }
};
