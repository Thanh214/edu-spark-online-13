
import express from 'express';
import { authenticateJWT, authorizeAdmin } from '../middleware/auth';
import { DocumentController } from '../controllers/documentController';

const router = express.Router();

// Routes cần xác thực
router.get('/:id', authenticateJWT, DocumentController.getDocumentById);
router.get('/lesson/:lessonId', authenticateJWT, DocumentController.getDocumentsByLessonId);

// Routes cần quyền admin
router.post('/', 
  authenticateJWT, 
  authorizeAdmin, 
  DocumentController.createDocument
);

router.delete('/:id', 
  authenticateJWT, 
  authorizeAdmin, 
  DocumentController.deleteDocument
);

export default router;
