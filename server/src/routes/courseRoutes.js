"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const courseController_1 = require("../controllers/courseController");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
// Routes công khai
router.get('/', courseController_1.CourseController.getAllCourses);
router.get('/:id', courseController_1.CourseController.getCourseById);
router.get('/:id/details', courseController_1.CourseController.getCourseWithDetails);
router.get('/:id/chapters', courseController_1.CourseController.getCourseChapters);
// Routes cần quyền admin
router.post('/', auth_1.authenticateJWT, auth_1.authorizeAdmin, upload_1.uploadImage.single('thumbnail'), courseController_1.CourseController.createCourse);
router.put('/:id', auth_1.authenticateJWT, auth_1.authorizeAdmin, upload_1.uploadImage.single('thumbnail'), courseController_1.CourseController.updateCourse);
router.delete('/:id', auth_1.authenticateJWT, auth_1.authorizeAdmin, courseController_1.CourseController.deleteCourse);
exports.default = router;
