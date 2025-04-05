
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';

interface CorsOptions {
  origin: string | string[] | boolean | ((origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void);
  methods?: string | string[];
  allowedHeaders?: string | string[];
  exposedHeaders?: string | string[];
  credentials?: boolean;
  maxAge?: number;
  preflightContinue?: boolean;
  optionsSuccessStatus?: number;
}

// Cấu hình CORS tùy chỉnh
const corsConfig = (): cors.CorsOptions => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173', 
    'http://127.0.0.1:5174',
    'https://edu-spark-online.example.com'
  ];

  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      // Luôn cho phép trong development hoặc không có origin
      if (!origin || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
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

// Middleware cho phép kiểm soát CORS tùy theo route
const corsWithOptions = cors(corsConfig());

// Middleware cho phép tất cả các yêu cầu CORS (cho development)
const corsForDevelopment = (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
};

// Export default corsOptions for use in index.ts
export default corsConfig();

// Also export individual functions if needed elsewhere
export { corsConfig, corsWithOptions, corsForDevelopment };
