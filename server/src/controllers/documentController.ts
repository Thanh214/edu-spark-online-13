
import { Request, Response } from 'express';
import { DocumentModel } from '../models/documentModel';

export const DocumentController = {
  // Lấy tài liệu theo ID
  async getDocumentById(req: Request, res: Response): Promise<void> {
    try {
      const documentId = parseInt(req.params.id);
      
      if (isNaN(documentId)) {
        res.status(400).json({
          success: false,
          message: 'ID tài liệu không hợp lệ'
        });
        return;
      }
      
      const document = await DocumentModel.getDocumentById(documentId);
      
      if (!document) {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy tài liệu'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: document
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin tài liệu',
        error: error.message
      });
    }
  },
  
  // Lấy tài liệu theo lesson ID
  async getDocumentsByLessonId(req: Request, res: Response): Promise<void> {
    try {
      const lessonId = parseInt(req.params.lessonId);
      
      if (isNaN(lessonId)) {
        res.status(400).json({
          success: false,
          message: 'ID bài học không hợp lệ'
        });
        return;
      }
      
      const documents = await DocumentModel.getDocumentsByLessonId(lessonId);
      
      res.status(200).json({
        success: true,
        count: documents.length,
        data: documents
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách tài liệu',
        error: error.message
      });
    }
  },
  
  // Tạo tài liệu mới
  async createDocument(req: Request, res: Response): Promise<void> {
    try {
      const { lesson_id, title, file_path, file_type } = req.body;
      
      // Kiểm tra các trường bắt buộc
      if (!lesson_id || !title || !file_path) {
        res.status(400).json({
          success: false,
          message: 'Thiếu thông tin bắt buộc: lesson_id, title, file_path'
        });
        return;
      }
      
      const documentData = {
        lesson_id: parseInt(lesson_id),
        title,
        file_path,
        file_type: file_type || null
      };
      
      const documentId = await DocumentModel.createDocument(documentData);
      const newDocument = await DocumentModel.getDocumentById(documentId);
      
      res.status(201).json({
        success: true,
        message: 'Tạo tài liệu thành công',
        data: newDocument
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo tài liệu',
        error: error.message
      });
    }
  },
  
  // Xóa tài liệu
  async deleteDocument(req: Request, res: Response): Promise<void> {
    try {
      const documentId = parseInt(req.params.id);
      
      if (isNaN(documentId)) {
        res.status(400).json({
          success: false,
          message: 'ID tài liệu không hợp lệ'
        });
        return;
      }
      
      // Kiểm tra xem tài liệu có tồn tại không
      const existingDocument = await DocumentModel.getDocumentById(documentId);
      if (!existingDocument) {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy tài liệu'
        });
        return;
      }
      
      // Xóa tài liệu
      await DocumentModel.deleteDocument(documentId);
      
      res.status(200).json({
        success: true,
        message: 'Xóa tài liệu thành công'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa tài liệu',
        error: error.message
      });
    }
  }
};
