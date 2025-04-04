import fs from 'fs';
import path from 'path';

// Hàm tạo hình ảnh placeholder dạng text
function createPlaceholderImage(text: string, filename: string): void {
  const imgDir = path.join(__dirname, '../../uploads/images');
  
  // Đảm bảo thư mục tồn tại
  if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir, { recursive: true });
  }
  
  // Tạo nội dung file SVG đơn giản với text
  const svgContent = `
<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#4f46e5" />
  <text x="50%" y="50%" font-family="Arial" font-size="40" fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>
</svg>
  `;
  
  // Ghi file
  fs.writeFileSync(path.join(imgDir, filename), svgContent);
  console.log(`Đã tạo hình ảnh placeholder: ${filename}`);
}

// Tạo các hình ảnh placeholder
function createPlaceholderImages(): void {
  try {
    // Tạo hình ảnh cho các khóa học
    createPlaceholderImage('JavaScript', 'javascript-basic.jpg');
    createPlaceholderImage('HTML & CSS', 'html-css.jpg');
    createPlaceholderImage('React.js', 'react-course.jpg');
    createPlaceholderImage('Node.js', 'nodejs.jpg');
    
    console.log('Đã tạo tất cả hình ảnh placeholder thành công!');
  } catch (error) {
    console.error('Lỗi khi tạo hình ảnh placeholder:', error);
  }
}

// Chạy hàm tạo hình ảnh nếu file được thực thi trực tiếp
if (require.main === module) {
  createPlaceholderImages();
}

export { createPlaceholderImages }; 