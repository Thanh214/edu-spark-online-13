
import express from 'express';
import { authenticateJWT, authorizeAdmin } from '../middleware/auth';
import { LessonController } from '../controllers/lessonController';
import { uploadDocument } from '../middleware/upload';

const router = express.Router();

// Routes cần xác thực
router.get('/:id', authenticateJWT, LessonController.getLessonById);
router.get('/:id/pages', authenticateJWT, LessonController.getLessonWithPages);
router.get('/chapter/:chapterId', authenticateJWT, LessonController.getLessonsByChapterId);

// Routes cần quyền admin
router.post('/', 
  authenticateJWT, 
  authorizeAdmin, 
  LessonController.createLesson
);

router.put('/:id', 
  authenticateJWT, 
  authorizeAdmin, 
  LessonController.updateLesson
);

router.delete('/:id', 
  authenticateJWT, 
  authorizeAdmin, 
  LessonController.deleteLesson
);

// Upload document
router.post('/:id/documents', 
  authenticateJWT,
  authorizeAdmin,
  uploadDocument.single('file'),
  LessonController.uploadDocument
);

export default router;
