"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentController = void 0;
const enrollmentModel_1 = require("../models/enrollmentModel");
const courseModel_1 = require("../models/courseModel");
exports.EnrollmentController = {
    // Lấy tất cả ghi danh (Admin)
    getAllEnrollments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const enrollments = yield enrollmentModel_1.EnrollmentModel.getAllEnrollments();
                res.status(200).json({
                    success: true,
                    count: enrollments.length,
                    data: enrollments
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Lỗi khi lấy danh sách ghi danh',
                    error: error.message
                });
            }
        });
    },
    // Lấy ghi danh theo ID
    getEnrollmentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const enrollmentId = parseInt(req.params.id);
                if (isNaN(enrollmentId)) {
                    return res.status(400).json({
                        success: false,
                        message: 'ID ghi danh không hợp lệ'
                    });
                }
                const enrollment = yield enrollmentModel_1.EnrollmentModel.getEnrollmentById(enrollmentId);
                if (!enrollment) {
                    return res.status(404).json({
                        success: false,
                        message: 'Không tìm thấy thông tin ghi danh'
                    });
                }
                res.status(200).json({
                    success: true,
                    data: enrollment
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Lỗi khi lấy thông tin ghi danh',
                    error: error.message
                });
            }
        });
    },
    // Lấy chi tiết ghi danh có thông tin khóa học và người dùng
    getEnrollmentDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const enrollmentId = parseInt(req.params.id);
                if (isNaN(enrollmentId)) {
                    return res.status(400).json({
                        success: false,
                        message: 'ID ghi danh không hợp lệ'
                    });
                }
                const enrollmentDetails = yield enrollmentModel_1.EnrollmentModel.getEnrollmentDetails(enrollmentId);
                if (!enrollmentDetails) {
                    return res.status(404).json({
                        success: false,
                        message: 'Không tìm thấy thông tin ghi danh'
                    });
                }
                res.status(200).json({
                    success: true,
                    data: enrollmentDetails
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Lỗi khi lấy thông tin chi tiết ghi danh',
                    error: error.message
                });
            }
        });
    },
    // Lấy danh sách ghi danh của một người dùng
    getEnrollmentsByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const userId = parseInt(req.params.userId);
                if (isNaN(userId)) {
                    return res.status(400).json({
                        success: false,
                        message: 'ID người dùng không hợp lệ'
                    });
                }
                // Nếu người dùng hiện tại không phải admin và không phải chính người dùng đó
                if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin' && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId) !== userId) {
                    return res.status(403).json({
                        success: false,
                        message: 'Không có quyền truy cập thông tin ghi danh của người dùng khác'
                    });
                }
                const enrollments = yield enrollmentModel_1.EnrollmentModel.getUserEnrollmentsWithCourses(userId);
                res.status(200).json({
                    success: true,
                    count: enrollments.length,
                    data: enrollments
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Lỗi khi lấy danh sách ghi danh của người dùng',
                    error: error.message
                });
            }
        });
    },
    // Lấy danh sách ghi danh của một khóa học (Admin)
    getEnrollmentsByCourseId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = parseInt(req.params.courseId);
                if (isNaN(courseId)) {
                    return res.status(400).json({
                        success: false,
                        message: 'ID khóa học không hợp lệ'
                    });
                }
                const enrollments = yield enrollmentModel_1.EnrollmentModel.getEnrollmentsByCourseId(courseId);
                res.status(200).json({
                    success: true,
                    count: enrollments.length,
                    data: enrollments
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Lỗi khi lấy danh sách ghi danh cho khóa học',
                    error: error.message
                });
            }
        });
    },
    // Tạo ghi danh mới (đăng ký khóa học)
    createEnrollment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { courseId } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res.status(401).json({
                        success: false,
                        message: 'Bạn cần đăng nhập để đăng ký khóa học'
                    });
                }
                if (!courseId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Vui lòng cung cấp ID khóa học'
                    });
                }
                // Kiểm tra xem khóa học có tồn tại không
                const course = yield courseModel_1.CourseModel.getCourseById(courseId);
                if (!course) {
                    return res.status(404).json({
                        success: false,
                        message: 'Không tìm thấy khóa học'
                    });
                }
                // Kiểm tra xem người dùng đã đăng ký khóa học này chưa
                const existingEnrollment = yield enrollmentModel_1.EnrollmentModel.getEnrollmentByUserAndCourse(userId, courseId);
                if (existingEnrollment) {
                    return res.status(400).json({
                        success: false,
                        message: 'Bạn đã đăng ký khóa học này rồi'
                    });
                }
                // Tạo ghi danh mới
                const enrollmentData = {
                    user_id: userId,
                    course_id: courseId,
                    progress_percent: 0
                };
                const enrollmentId = yield enrollmentModel_1.EnrollmentModel.createEnrollment(enrollmentData);
                const newEnrollment = yield enrollmentModel_1.EnrollmentModel.getEnrollmentById(enrollmentId);
                res.status(201).json({
                    success: true,
                    message: 'Đăng ký khóa học thành công',
                    data: newEnrollment
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Lỗi khi đăng ký khóa học',
                    error: error.message
                });
            }
        });
    },
    // Cập nhật tiến độ học
    updateEnrollmentProgress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const enrollmentId = parseInt(req.params.id);
                const { currentLessonId, progressPercent } = req.body;
                if (isNaN(enrollmentId)) {
                    return res.status(400).json({
                        success: false,
                        message: 'ID ghi danh không hợp lệ'
                    });
                }
                // Kiểm tra xem ghi danh có tồn tại không
                const existingEnrollment = yield enrollmentModel_1.EnrollmentModel.getEnrollmentById(enrollmentId);
                if (!existingEnrollment) {
                    return res.status(404).json({
                        success: false,
                        message: 'Không tìm thấy thông tin ghi danh'
                    });
                }
                // Kiểm tra quyền truy cập - chỉ cho phép người dùng cập nhật tiến độ của chính mình hoặc admin
                if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin' && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId) !== existingEnrollment.user_id) {
                    return res.status(403).json({
                        success: false,
                        message: 'Không có quyền cập nhật tiến độ học của người khác'
                    });
                }
                // Chuẩn bị dữ liệu cập nhật
                const enrollmentData = {};
                if (currentLessonId !== undefined)
                    enrollmentData.current_lesson_id = currentLessonId;
                if (progressPercent !== undefined)
                    enrollmentData.progress_percent = progressPercent;
                // Cập nhật ghi danh
                yield enrollmentModel_1.EnrollmentModel.updateEnrollment(enrollmentId, enrollmentData);
                // Lấy thông tin ghi danh đã cập nhật
                const updatedEnrollment = yield enrollmentModel_1.EnrollmentModel.getEnrollmentById(enrollmentId);
                res.status(200).json({
                    success: true,
                    message: 'Cập nhật tiến độ học thành công',
                    data: updatedEnrollment
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Lỗi khi cập nhật tiến độ học',
                    error: error.message
                });
            }
        });
    },
    // Hủy đăng ký khóa học
    deleteEnrollment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const enrollmentId = parseInt(req.params.id);
                if (isNaN(enrollmentId)) {
                    return res.status(400).json({
                        success: false,
                        message: 'ID ghi danh không hợp lệ'
                    });
                }
                // Kiểm tra xem ghi danh có tồn tại không
                const existingEnrollment = yield enrollmentModel_1.EnrollmentModel.getEnrollmentById(enrollmentId);
                if (!existingEnrollment) {
                    return res.status(404).json({
                        success: false,
                        message: 'Không tìm thấy thông tin ghi danh'
                    });
                }
                // Kiểm tra quyền truy cập - chỉ cho phép người dùng hủy đăng ký của chính mình hoặc admin
                if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin' && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId) !== existingEnrollment.user_id) {
                    return res.status(403).json({
                        success: false,
                        message: 'Không có quyền hủy đăng ký khóa học của người khác'
                    });
                }
                // Xóa ghi danh
                yield enrollmentModel_1.EnrollmentModel.deleteEnrollment(enrollmentId);
                res.status(200).json({
                    success: true,
                    message: 'Hủy đăng ký khóa học thành công'
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Lỗi khi hủy đăng ký khóa học',
                    error: error.message
                });
            }
        });
    }
};
