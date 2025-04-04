import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';

// Đảm bảo thư mục upload tồn tại
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Định nghĩa storage cho file hình ảnh
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(uploadDir, 'images');
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// Định nghĩa storage cho file tài liệu
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(uploadDir, 'documents');
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// Kiểm tra loại file hình ảnh
const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && allowedTypes.test(ext.substring(1))) {
    return cb(null, true);
  }
  
  cb(new Error('Chỉ chấp nhận file hình ảnh với định dạng: jpeg, jpg, png, gif, webp, svg'));
};

// Kiểm tra loại file tài liệu
const documentFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedTypes = /pdf|doc|docx|ppt|pptx|xls|xlsx|txt|csv/;
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.test(ext.substring(1))) {
    return cb(null, true);
  }
  
  cb(new Error('Chỉ chấp nhận file tài liệu với định dạng: pdf, doc, docx, ppt, pptx, xls, xlsx, txt, csv'));
};

// Khởi tạo middleware upload hình ảnh
export const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFileFilter
});

// Khởi tạo middleware upload tài liệu
export const uploadDocument = multer({
  storage: documentStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: documentFileFilter
}); 