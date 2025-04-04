"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Route đăng ký
router.post('/register', authController_1.AuthController.register);
// Route đăng nhập
router.post('/login', authController_1.AuthController.login);
// Route lấy thông tin user hiện tại (yêu cầu xác thực)
router.get('/me', auth_1.authenticateJWT, authController_1.AuthController.getCurrentUser);
exports.default = router;
