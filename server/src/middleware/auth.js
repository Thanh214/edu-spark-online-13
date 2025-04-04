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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyResourceOwnership = exports.authorizeAdmin = exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware kiểm tra xác thực JWT
const authenticateJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Không có token xác thực'
            });
        }
        // Lấy token từ header "Bearer TOKEN"
        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // Thêm thông tin user vào request
        req.user = {
            userId: decoded.userId,
            role: decoded.role
        };
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token không hợp lệ hoặc đã hết hạn'
        });
    }
});
exports.authenticateJWT = authenticateJWT;
// Middleware kiểm tra quyền admin
const authorizeAdmin = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Không có quyền truy cập. Yêu cầu quyền admin.'
        });
    }
    next();
};
exports.authorizeAdmin = authorizeAdmin;
// Middleware xác minh người dùng sở hữu tài nguyên
const verifyResourceOwnership = (getResourceOwnerIdFn) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            // Bỏ qua kiểm tra nếu người dùng là admin
            if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin') {
                return next();
            }
            // Lấy ID của tài nguyên từ params
            const resourceId = parseInt(req.params.id);
            if (isNaN(resourceId)) {
                return res.status(400).json({ success: false, message: 'ID không hợp lệ' });
            }
            // Lấy ID người dùng sở hữu tài nguyên
            const ownerId = yield getResourceOwnerIdFn(resourceId);
            if (ownerId === null) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy tài nguyên' });
            }
            // Kiểm tra nếu người dùng hiện tại là chủ sở hữu
            if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId) !== ownerId) {
                return res.status(403).json({
                    success: false,
                    message: 'Không có quyền truy cập vào tài nguyên này'
                });
            }
            next();
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Lỗi server khi xác minh quyền sở hữu'
            });
        }
    });
};
exports.verifyResourceOwnership = verifyResourceOwnership;
