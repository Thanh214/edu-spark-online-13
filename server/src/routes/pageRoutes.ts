
import express from 'express';
import { authenticateJWT, authorizeAdmin } from '../middleware/auth';
import { PageController } from '../controllers/pageController';

const router = express.Router();

// Routes cần xác thực
router.get('/:id', authenticateJWT, PageController.getPageById);
router.get('/lesson/:lessonId', authenticateJWT, PageController.getPagesByLessonId);

// Routes cần quyền admin
router.post('/', 
  authenticateJWT, 
  authorizeAdmin, 
  PageController.createPage
);

router.put('/:id', 
  authenticateJWT, 
  authorizeAdmin, 
  PageController.updatePage
);

router.delete('/:id', 
  authenticateJWT, 
  authorizeAdmin, 
  PageController.deletePage
);

export default router;
