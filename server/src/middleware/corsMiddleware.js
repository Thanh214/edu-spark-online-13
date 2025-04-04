"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsForDevelopment = exports.corsWithOptions = exports.corsConfig = void 0;
const cors_1 = __importDefault(require("cors"));
// Cấu hình CORS tùy chỉnh
const corsConfig = () => {
    const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        'https://edu-spark-online.example.com'
    ];
    const corsOptions = {
        origin: (origin, callback) => {
            // Luôn cho phép trong development hoặc không có origin
            if (!origin || process.env.NODE_ENV !== 'production') {
                return callback(null, true);
            }
            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        exposedHeaders: ['Content-Length', 'X-Total-Count'],
        credentials: true,
        maxAge: 86400, // 24 giờ
    };
    return corsOptions;
};
exports.corsConfig = corsConfig;
// Middleware cho phép kiểm soát CORS tùy theo route
exports.corsWithOptions = (0, cors_1.default)((0, exports.corsConfig)());
// Middleware cho phép tất cả các yêu cầu CORS (cho development)
const corsForDevelopment = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    }
    else {
        next();
    }
};
exports.corsForDevelopment = corsForDevelopment;
