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
exports.UserModel = void 0;
exports.hashPassword = hashPassword;
const db_1 = require("../config/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Hash password function
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcryptjs_1.default.genSalt(10);
        return bcryptjs_1.default.hash(password, salt);
    });
}
exports.UserModel = {
    // Lấy tất cả users (không bao gồm password)
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query('SELECT user_id, full_name, email, role, created_at, updated_at FROM Users');
            return rows;
        });
    },
    // Lấy user theo ID (không bao gồm password)
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query('SELECT user_id, full_name, email, role, created_at, updated_at FROM Users WHERE user_id = ?', [userId]);
            const users = rows;
            return users.length > 0 ? users[0] : null;
        });
    },
    // Lấy user theo email (bao gồm password để xác thực)
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query('SELECT * FROM Users WHERE email = ?', [email]);
            const users = rows;
            return users.length > 0 ? users[0] : null;
        });
    },
    // Tạo user mới
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Hash password trước khi lưu vào DB
            const hashedPassword = yield hashPassword(userData.password);
            const [result] = yield db_1.pool.query('INSERT INTO Users (full_name, email, password, role) VALUES (?, ?, ?, ?)', [userData.full_name, userData.email, hashedPassword, userData.role || 'user']);
            const insertResult = result;
            return insertResult.insertId;
        });
    },
    // Cập nhật thông tin user
    updateUser(userId, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Chuẩn bị các fields cần update
            const fieldsToUpdate = Object.assign({}, userData);
            // Nếu có password thì hash trước khi update
            if (userData.password) {
                fieldsToUpdate.password = yield hashPassword(userData.password);
            }
            // Tạo câu query động dựa trên các fields cần update
            const entries = Object.entries(fieldsToUpdate);
            if (entries.length === 0)
                return false;
            const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
            const values = entries.map(([_, value]) => value);
            const query = `UPDATE Users SET ${setClause} WHERE user_id = ?`;
            values.push(userId);
            const [result] = yield db_1.pool.query(query, values);
            const updateResult = result;
            return updateResult.affectedRows > 0;
        });
    },
    // Xóa user
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield db_1.pool.query('DELETE FROM Users WHERE user_id = ?', [userId]);
            const deleteResult = result;
            return deleteResult.affectedRows > 0;
        });
    },
    // Xác thực password
    verifyPassword(plainPassword, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcryptjs_1.default.compare(plainPassword, hashedPassword);
        });
    }
};
