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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../models/userModel");
// Tạo JWT token
const generateToken = (userId, role) => {
    const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    return jsonwebtoken_1.default.sign({ userId, role }, secret, { expiresIn });
};
exports.AuthController = {
    // Đăng ký tài khoản mới
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { full_name, email, password } = req.body;
                // Kiểm tra các trường bắt buộc
                if (!full_name || !email || !password) {
                    return res.status(400).json({
                        success: false,
                        message: 'Vui lòng điền đầy đủ thông tin'
                    });
                }
                // Kiểm tra email đã tồn tại chưa
                const existingUser = yield userModel_1.UserModel.getUserByEmail(email);
                if (existingUser) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email đã được sử dụng'
                    });
                }
                // Tạo user mới
                const userData = {
                    full_name,
                    email,
                    password
                };
                const userId = yield userModel_1.UserModel.createUser(userData);
                // Tạo JWT token
                const token = generateToken(userId, 'user');
                // Lấy thông tin user vừa tạo
                const newUser = yield userModel_1.UserModel.getUserById(userId);
                res.status(201).json({
                    success: true,
                    message: 'Đăng ký thành công',
                    data: {
                        user: newUser,
                        token
                    }
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Lỗi khi đăng ký tài khoản',
                    error: error.message
                });
            }
        });
    },
    // Đăng nhập
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                // Kiểm tra các trường bắt buộc
                if (!email || !password) {
                    return res.status(400).json({
                        success: false,
                        message: 'Vui lòng cung cấp email và mật khẩu'
                    });
                }
                // Tìm user theo email
                const user = yield userModel_1.UserModel.getUserByEmail(email);
                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: 'Email hoặc mật khẩu không đúng'
                    });
                }
                // Kiểm tra mật khẩu
                const isPasswordValid = yield userModel_1.UserModel.verifyPassword(password, user.password);
                if (!isPasswordValid) {
                    return res.status(401).json({
                        success: false,
                        message: 'Email hoặc mật khẩu không đúng'
                    });
                }
                // Tạo JWT token
                const token = generateToken(user.user_id, user.role);
                // Không trả về password
                const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
                res.status(200).json({
                    success: true,
                    message: 'Đăng nhập thành công',
                    data: {
                        user: userWithoutPassword,
                        token
                    }
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Lỗi khi đăng nhập',
                    error: error.message
                });
            }
        });
    },
    // Lấy thông tin user hiện tại
    getCurrentUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({
                        success: false,
                        message: 'Không tìm thấy thông tin người dùng'
                    });
                }
                const userId = req.user.userId;
                const user = yield userModel_1.UserModel.getUserById(userId);
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: 'Không tìm thấy người dùng'
                    });
                }
                res.status(200).json({
                    success: true,
                    data: {
                        user
                    }
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Lỗi khi lấy thông tin người dùng',
                    error: error.message
                });
            }
        });
    }
};
