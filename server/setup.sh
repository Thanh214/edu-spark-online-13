#!/bin/bash

# Kiểm tra xem npm đã được cài đặt chưa
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Kiểm tra xem đã có file .env chưa
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env || echo -e "PORT=5000\nNODE_ENV=development\n\n# Database Configuration\nDB_HOST=localhost\nDB_USER=root\nDB_PASSWORD=\nDB_NAME=edu_spark\nDB_PORT=3306\n\n# JWT\nJWT_SECRET=your_jwt_secret_key_here\nJWT_EXPIRES_IN=7d\n\n# File Upload\nUPLOAD_DIR=uploads" > .env
    echo "Please check and modify .env file if needed."
fi

# Cài đặt dependencies
echo "Installing dependencies..."
npm install

# Tạo thư mục uploads nếu chưa có
mkdir -p uploads/images uploads/documents

# Khởi tạo cơ sở dữ liệu
echo "Initializing database..."
npm run db:init

# Biên dịch TypeScript sang JavaScript
echo "Building application..."
npm run build

echo "Setup complete!"
echo "Run 'npm run dev' for development mode."
echo "Run 'npm start' for production mode." 