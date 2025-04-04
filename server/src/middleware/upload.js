"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDocument = exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Đảm bảo thư mục upload tồn tại
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// Định nghĩa storage cho file hình ảnh
const imageStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const dest = path_1.default.join(uploadDir, 'images');
        if (!fs_1.default.existsSync(dest)) {
            fs_1.default.mkdirSync(dest, { recursive: true });
        }
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});
// Định nghĩa storage cho file tài liệu
const documentStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const dest = path_1.default.join(uploadDir, 'documents');
        if (!fs_1.default.existsSync(dest)) {
            fs_1.default.mkdirSync(dest, { recursive: true });
        }
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});
// Kiểm tra loại file hình ảnh
const imageFileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && allowedTypes.test(ext.substring(1))) {
        return cb(null, true);
    }
    cb(new Error('Chỉ chấp nhận file hình ảnh với định dạng: jpeg, jpg, png, gif, webp, svg'));
};
// Kiểm tra loại file tài liệu
const documentFileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|ppt|pptx|xls|xlsx|txt|csv/;
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext.substring(1))) {
        return cb(null, true);
    }
    cb(new Error('Chỉ chấp nhận file tài liệu với định dạng: pdf, doc, docx, ppt, pptx, xls, xlsx, txt, csv'));
};
// Khởi tạo middleware upload hình ảnh
exports.uploadImage = (0, multer_1.default)({
    storage: imageStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: imageFileFilter
});
// Khởi tạo middleware upload tài liệu
exports.uploadDocument = (0, multer_1.default)({
    storage: documentStorage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    fileFilter: documentFileFilter
});
