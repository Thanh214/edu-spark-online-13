
import { Request, Response } from 'express';
import { DocumentModel } from '../models/documentModel';
import path from 'path';
import fs from 'fs';

export const DocumentController = {
  // Lấy tài liệu theo ID
  async getDocumentById(req: Request, res: Response) {
    try {
      const documentId = parseInt(req.params.id);
      if (isNaN(documentId)) {
        return res.status(400).json({
          success: false,
          message: 'ID tài liệu không hợp lệ'
        });
      }

      const document = await DocumentModel.getDocumentById(documentId);
      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy tài liệu'
        });
      }

      return res.status(200).json({
        success: true,
        data: document
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server: ' + error.message
      });
    }
  },

  // Lấy tài liệu theo bài học ID
  async getDocumentsByLessonId(req: Request, res: Response) {
    try {
      const lessonId = parseInt(req.params.lessonId);
      if (isNaN(lessonId)) {
        return res.status(400).json({
          success: false,
          message: 'ID bài học không hợp lệ'
        });
      }

      const documents = await DocumentModel.getDocumentsByLessonId(lessonId);
      return res.status(200).json({
        success: true,
        data: documents
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server: ' + error.message
      });
    }
  },

  // Tạo tài liệu mới
  async createDocument(req: Request, res: Response) {
    try {
      const { lesson_id, title } = req.body;
      const file = req.file;

      if (!lesson_id || !title || !file) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin tài liệu hoặc file'
        });
      }

      const documentData = {
        lesson_id: parseInt(lesson_id),
        title,
        file_path: file.path
      };

      const documentId = await DocumentModel.createDocument(documentData);
      const newDocument = await DocumentModel.getDocumentById(documentId);

      return res.status(201).json({
        success: true,
        message: 'Tài liệu đã được tạo thành công',
        data: newDocument
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server: ' + error.message
      });
    }
  },

  // Xóa tài liệu
  async deleteDocument(req: Request, res: Response) {
    try {
      const documentId = parseInt(req.params.id);
      if (isNaN(documentId)) {
        return res.status(400).json({
          success: false,
          message: 'ID tài liệu không hợp lệ'
        });
      }

      // Lấy thông tin tài liệu để lấy đường dẫn file
      const document = await DocumentModel.getDocumentById(documentId);
      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy tài liệu'
        });
      }

      // Xóa file nếu tồn tại
      if (document.file_path) {
        const filePath = path.join(__dirname, '../..', document.file_path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      // Xóa tài liệu trong database
      const success = await DocumentModel.deleteDocument(documentId);
      if (!success) {
        return res.status(500).json({
          success: false,
          message: 'Không thể xóa tài liệu'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Tài liệu đã được xóa thành công'
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server: ' + error.message
      });
    }
  }
};
