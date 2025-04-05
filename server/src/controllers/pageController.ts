
import { Request, Response } from 'express';
import { PageModel } from '../models/pageModel';
import { PageCreateDTO, PageUpdateDTO } from '../models/types';

export const PageController = {
  // Lấy trang theo ID
  async getPageById(req: Request, res: Response) {
    try {
      const pageId = parseInt(req.params.id);
      
      if (isNaN(pageId)) {
        return res.status(400).json({
          success: false,
          message: 'ID trang không hợp lệ'
        });
      }
      
      const page = await PageModel.getPageById(pageId);
      
      if (!page) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy trang'
        });
      }
      
      res.status(200).json({
        success: true,
        data: page
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin trang',
        error: error.message
      });
    }
  },
  
  // Lấy trang theo lesson ID
  async getPagesByLessonId(req: Request, res: Response) {
    try {
      const lessonId = parseInt(req.params.lessonId);
      
      if (isNaN(lessonId)) {
        return res.status(400).json({
          success: false,
          message: 'ID bài học không hợp lệ'
        });
      }
      
      const pages = await PageModel.getPagesByLessonId(lessonId);
      
      res.status(200).json({
        success: true,
        count: pages.length,
        data: pages
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách trang',
        error: error.message
      });
    }
  },
  
  // Tạo trang mới
  async createPage(req: Request, res: Response) {
    try {
      const { lesson_id, page_number, content } = req.body;
      
      // Kiểm tra các trường bắt buộc
      if (!lesson_id || page_number === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin bắt buộc: lesson_id, page_number'
        });
      }
      
      const pageData: PageCreateDTO = {
        lesson_id: parseInt(lesson_id),
        page_number: parseInt(page_number),
        content: content || null
      };
      
      const pageId = await PageModel.createPage(pageData);
      const newPage = await PageModel.getPageById(pageId);
      
      res.status(201).json({
        success: true,
        message: 'Tạo trang thành công',
        data: newPage
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo trang',
        error: error.message
      });
    }
  },
  
  // Cập nhật trang
  async updatePage(req: Request, res: Response) {
    try {
      const pageId = parseInt(req.params.id);
      
      if (isNaN(pageId)) {
        return res.status(400).json({
          success: false,
          message: 'ID trang không hợp lệ'
        });
      }
      
      // Kiểm tra xem trang có tồn tại không
      const existingPage = await PageModel.getPageById(pageId);
      if (!existingPage) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy trang'
        });
      }
      
      const { page_number, content, lesson_id } = req.body;
      
      // Chuẩn bị dữ liệu cập nhật
      const pageData: PageUpdateDTO = {};
      
      if (page_number !== undefined) pageData.page_number = parseInt(page_number);
      if (content !== undefined) pageData.content = content;
      if (lesson_id !== undefined) pageData.lesson_id = parseInt(lesson_id);
      
      // Cập nhật trang
      await PageModel.updatePage(pageId, pageData);
      
      // Lấy thông tin trang đã cập nhật
      const updatedPage = await PageModel.getPageById(pageId);
      
      res.status(200).json({
        success: true,
        message: 'Cập nhật trang thành công',
        data: updatedPage
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật trang',
        error: error.message
      });
    }
  },
  
  // Xóa trang
  async deletePage(req: Request, res: Response) {
    try {
      const pageId = parseInt(req.params.id);
      
      if (isNaN(pageId)) {
        return res.status(400).json({
          success: false,
          message: 'ID trang không hợp lệ'
        });
      }
      
      // Kiểm tra xem trang có tồn tại không
      const existingPage = await PageModel.getPageById(pageId);
      if (!existingPage) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy trang'
        });
      }
      
      // Xóa trang
      await PageModel.deletePage(pageId);
      
      res.status(200).json({
        success: true,
        message: 'Xóa trang thành công'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa trang',
        error: error.message
      });
    }
  }
};
