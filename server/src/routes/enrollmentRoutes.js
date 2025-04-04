"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const enrollmentController_1 = require("../controllers/enrollmentController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Routes yêu cầu xác thực
router.post('/', auth_1.authenticateJWT, enrollmentController_1.EnrollmentController.createEnrollment);
router.get('/me', auth_1.authenticateJWT, (req, res) => {
    if (!req.user || !req.user.userId) {
        return res.status(401).json({
            success: false,
            message: 'Không tìm thấy thông tin người dùng'
        });
    }
    // Chuyển hướng đến controller với userId từ token
    enrollmentController_1.EnrollmentController.getEnrollmentsByUserId(req, res);
});
// Routes lấy chi tiết enrollment, cập nhật và xóa (yêu cầu là chủ sở hữu hoặc admin)
router.get('/:id', auth_1.authenticateJWT, enrollmentController_1.EnrollmentController.getEnrollmentById);
router.get('/:id/details', auth_1.authenticateJWT, enrollmentController_1.EnrollmentController.getEnrollmentDetails);
router.put('/:id', auth_1.authenticateJWT, enrollmentController_1.EnrollmentController.updateEnrollmentProgress);
router.delete('/:id', auth_1.authenticateJWT, enrollmentController_1.EnrollmentController.deleteEnrollment);
// Routes dành cho admin
router.get('/', auth_1.authenticateJWT, auth_1.authorizeAdmin, enrollmentController_1.EnrollmentController.getAllEnrollments);
router.get('/course/:courseId', auth_1.authenticateJWT, auth_1.authorizeAdmin, enrollmentController_1.EnrollmentController.getEnrollmentsByCourseId);
router.get('/user/:userId', auth_1.authenticateJWT, auth_1.authorizeAdmin, enrollmentController_1.EnrollmentController.getEnrollmentsByUserId);
exports.default = router;
