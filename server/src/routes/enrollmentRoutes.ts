import express from 'express';
import { EnrollmentController } from '../controllers/enrollmentController';
import { authenticateJWT, authorizeAdmin } from '../middleware/auth';

const router = express.Router();

// Routes yêu cầu xác thực
router.post('/', authenticateJWT, EnrollmentController.createEnrollment);
router.get('/me', authenticateJWT, (req, res) => {
  if (!req.user || !req.user.userId) {
    return res.status(401).json({
      success: false,
      message: 'Không tìm thấy thông tin người dùng'
    });
  }
  // Chuyển hướng đến controller với userId từ token
  EnrollmentController.getEnrollmentsByUserId(req, res);
});

// Routes lấy chi tiết enrollment, cập nhật và xóa (yêu cầu là chủ sở hữu hoặc admin)
router.get('/:id', authenticateJWT, EnrollmentController.getEnrollmentById);
router.get('/:id/details', authenticateJWT, EnrollmentController.getEnrollmentDetails);
router.put('/:id', authenticateJWT, EnrollmentController.updateEnrollmentProgress);
router.delete('/:id', authenticateJWT, EnrollmentController.deleteEnrollment);

// Routes dành cho admin
router.get('/', authenticateJWT, authorizeAdmin, EnrollmentController.getAllEnrollments);
router.get('/course/:courseId', authenticateJWT, authorizeAdmin, EnrollmentController.getEnrollmentsByCourseId);
router.get('/user/:userId', authenticateJWT, authorizeAdmin, EnrollmentController.getEnrollmentsByUserId);

export default router; 