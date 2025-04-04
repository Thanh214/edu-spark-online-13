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
exports.CourseController = void 0;
const courseModel_1 = require("../models/courseModel");
const chapterModel_1 = require("../models/chapterModel");
exports.CourseController = {
    // Lấy tất cả khóa học
    getAllCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield courseModel_1.CourseModel.getAllCourses();
                res.status(200).json({
                    success: true,
                    count: courses.length,
                    data: courses
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Lỗi khi lấy danh sách khóa học',
                    error: error.message
                });
            }
        });
    },
    // Lấy thông tin khóa học theo ID
    getCourseById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = parseInt(req.params.id);
                if (isNaN(courseId)) {
                    return res.status(400).json({
                        success: false,
                        message: 'ID khóa học không hợp lệ'
                    });
                }
                const course = yield courseModel_1.CourseModel.getCourseById(courseId);
                if (!course) {
                    return res.status(404).json({
                        success: false,
                        message: 'Không tìm thấy khóa học'
                    });
                }
                res.status(200).json({
                    success: true,
                    data: course
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Lỗi khi lấy thông tin khóa học',
                    error: error.message
                });
            }
        });
    },
    // Lấy thông tin chi tiết khóa học với chương và bài học
    getCourseWithDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = parseInt(req.params.id);
                if (isNaN(courseId)) {
                    return res.status(400).json({
                        success: false,
                        message: 'ID khóa học không hợp lệ'
                    });
                }
                const courseDetails = yield courseModel_1.CourseModel.getCourseWithDetails(courseId);
                if (!courseDetails) {
                    return res.status(404).json({
                        success: false,
                        message: 'Không tìm thấy khóa học'
                    });
                }
                res.status(200).json({
                    success: true,
                    data: courseDetails
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Lỗi khi lấy thông tin chi tiết khóa học',
                    error: error.message
                });
            }
        });
    },
    // Tạo khóa học mới (Admin)
    createCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, description } = req.body;
                // Kiểm tra trường bắt buộc
                if (!title) {
                    return res.status(400).json({
                        success: false,
                        message: 'Vui lòng cung cấp tiêu đề khóa học'
                    });
                }
                // Tạo DTO
                const courseData = {
                    title,
                    description: description || null
                };
                // Nếu có file hình ảnh
                if (req.file) {
                    courseData.thumbnail = req.file.path;
                }
                const courseId = yield courseModel_1.CourseModel.createCourse(courseData);
                const newCourse = yield courseModel_1.CourseModel.getCourseById(courseId);
                res.status(201).json({
                    success: true,
                    message: 'Tạo khóa học thành công',
                    data: newCourse
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Lỗi khi tạo khóa học',
                    error: error.message
                });
            }
        });
    },
    // Cập nhật khóa học (Admin)
    updateCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = parseInt(req.params.id);
                if (isNaN(courseId)) {
                    return res.status(400).json({
                        success: false,
                        message: 'ID khóa học không hợp lệ'
                    });
                }
                const { title, description } = req.body;
                // Kiểm tra xem khóa học có tồn tại không
                const existingCourse = yield courseModel_1.CourseModel.getCourseById(courseId);
                if (!existingCourse) {
                    return res.status(404).json({
                        success: false,
                        message: 'Không tìm thấy khóa học'
                    });
                }
                // Chuẩn bị dữ liệu cập nhật
                const courseData = {};
                if (title !== undefined)
                    courseData.title = title;
                if (description !== undefined)
                    courseData.description = description;
                // Nếu có file hình ảnh mới
                if (req.file) {
                    courseData.thumbnail = req.file.path;
                }
                // Cập nhật khóa học
                yield courseModel_1.CourseModel.updateCourse(courseId, courseData);
                // Lấy thông tin khóa học đã cập nhật
                const updatedCourse = yield courseModel_1.CourseModel.getCourseById(courseId);
                res.status(200).json({
                    success: true,
                    message: 'Cập nhật khóa học thành công',
                    data: updatedCourse
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Lỗi khi cập nhật khóa học',
                    error: error.message
                });
            }
        });
    },
    // Xóa khóa học (Admin)
    deleteCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = parseInt(req.params.id);
                if (isNaN(courseId)) {
                    return res.status(400).json({
                        success: false,
                        message: 'ID khóa học không hợp lệ'
                    });
                }
                // Kiểm tra xem khóa học có tồn tại không
                const existingCourse = yield courseModel_1.CourseModel.getCourseById(courseId);
                if (!existingCourse) {
                    return res.status(404).json({
                        success: false,
                        message: 'Không tìm thấy khóa học'
                    });
                }
                // Xóa khóa học
                yield courseModel_1.CourseModel.deleteCourse(courseId);
                res.status(200).json({
                    success: true,
                    message: 'Xóa khóa học thành công'
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Lỗi khi xóa khóa học',
                    error: error.message
                });
            }
        });
    },
    // Lấy các chương của khóa học
    getCourseChapters(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = parseInt(req.params.id);
                if (isNaN(courseId)) {
                    return res.status(400).json({
                        success: false,
                        message: 'ID khóa học không hợp lệ'
                    });
                }
                // Kiểm tra xem khóa học có tồn tại không
                const existingCourse = yield courseModel_1.CourseModel.getCourseById(courseId);
                if (!existingCourse) {
                    return res.status(404).json({
                        success: false,
                        message: 'Không tìm thấy khóa học'
                    });
                }
                // Lấy danh sách các chương của khóa học
                const chapters = yield chapterModel_1.ChapterModel.getChaptersByCourseId(courseId);
                res.status(200).json({
                    success: true,
                    count: chapters.length,
                    data: chapters
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Lỗi khi lấy danh sách chương của khóa học',
                    error: error.message
                });
            }
        });
    }
};
