import express from 'express';
import { CourseController } from '../controllers/courseController';
import { authenticateJWT, authorizeAdmin } from '../middleware/auth';
import { uploadImage } from '../middleware/upload';

const router = express.Router();

// Routes công khai
router.get('/', CourseController.getAllCourses);
router.get('/:id', CourseController.getCourseById);
router.get('/:id/details', CourseController.getCourseWithDetails);
router.get('/:id/chapters', CourseController.getCourseChapters);

// Routes cần quyền admin
router.post(
  '/', 
  authenticateJWT, 
  authorizeAdmin, 
  uploadImage.single('thumbnail'), 
  CourseController.createCourse
);

router.put(
  '/:id', 
  authenticateJWT, 
  authorizeAdmin, 
  uploadImage.single('thumbnail'), 
  CourseController.updateCourse
);

router.delete(
  '/:id', 
  authenticateJWT, 
  authorizeAdmin, 
  CourseController.deleteCourse
);

export default router; 