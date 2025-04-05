
import { pool } from '../config/db';
import { Document, DocumentCreateDTO } from './types';

export const DocumentModel = {
  // Get all documents
  async getAllDocuments(): Promise<Document[]> {
    const [rows] = await pool.query('SELECT * FROM Documents');
    return rows as Document[];
  },

  // Get documents by lesson ID
  async getDocumentsByLessonId(lessonId: number): Promise<Document[]> {
    const [rows] = await pool.query(
      'SELECT * FROM Documents WHERE lesson_id = ?',
      [lessonId]
    );
    return rows as Document[];
  },

  // Get document by ID
  async getDocumentById(documentId: number): Promise<Document | null> {
    const [rows] = await pool.query(
      'SELECT * FROM Documents WHERE document_id = ?',
      [documentId]
    );
    const documents = rows as Document[];
    return documents.length > 0 ? documents[0] : null;
  },

  // Create a new document
  async createDocument(documentData: DocumentCreateDTO): Promise<number> {
    const [result] = await pool.query(
      'INSERT INTO Documents (lesson_id, title, file_path) VALUES (?, ?, ?)',
      [
        documentData.lesson_id,
        documentData.title,
        documentData.file_path
      ]
    );
    
    const insertResult = result as { insertId: number };
    return insertResult.insertId;
  },

  // Delete document
  async deleteDocument(documentId: number): Promise<boolean> {
    const [result] = await pool.query(
      'DELETE FROM Documents WHERE document_id = ?',
      [documentId]
    );
    const deleteResult = result as { affectedRows: number };
    return deleteResult.affectedRows > 0;
  }
};
