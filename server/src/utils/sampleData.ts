import { pool } from '../config/db';
import fs from 'fs';
import path from 'path';
import { createPlaceholderImages } from './createPlaceholderImages';

// Hàm tạo dữ liệu mẫu
export async function seedSampleData() {
  try {
    // Kiểm tra xem đã có dữ liệu chưa
    const [existingCourses] = await pool.query('SELECT * FROM Courses LIMIT 1');
    if ((existingCourses as any[]).length > 0) {
      console.log('Dữ liệu khóa học đã tồn tại, bỏ qua việc thêm dữ liệu mẫu.');
      return true;
    }

    // Tạo thư mục nếu chưa tồn tại
    const uploadDir = path.join(__dirname, '../../uploads/images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Tạo hình ảnh placeholder
    createPlaceholderImages();

    // Tạo khóa học mẫu
    const coursesData = [
      {
        title: 'Lập trình JavaScript cơ bản',
        description: 'Khóa học giúp bạn nắm vững các kiến thức cơ bản về JavaScript, từ biến, hàm, đến DOM và sự kiện.',
        thumbnail: 'uploads/images/javascript-basic.jpg'
      },
      {
        title: 'HTML & CSS cho người mới bắt đầu',
        description: 'Tạo nền tảng vững chắc về lập trình web với HTML và CSS từ cơ bản đến nâng cao.',
        thumbnail: 'uploads/images/html-css.jpg'
      },
      {
        title: 'React.js Toàn diện',
        description: 'Học cách xây dựng ứng dụng web hiện đại với React.js, Redux và các công nghệ liên quan.',
        thumbnail: 'uploads/images/react-course.jpg'
      },
      {
        title: 'Node.js & Express Backend',
        description: 'Làm chủ công nghệ backend với Node.js và Express để xây dựng API và ứng dụng server-side.',
        thumbnail: 'uploads/images/nodejs.jpg'
      }
    ];

    // Thêm khóa học vào cơ sở dữ liệu
    for (const course of coursesData) {
      const [courseResult] = await pool.query(
        'INSERT INTO Courses (title, description, thumbnail) VALUES (?, ?, ?)',
        [course.title, course.description, course.thumbnail]
      );
      const courseId = (courseResult as any).insertId;

      // Tạo các chương cho khóa học
      const chapters = await createChaptersForCourse(courseId, course.title);
      
      // Tạo bài học cho mỗi chương
      for (const chapter of chapters) {
        await createLessonsForChapter(chapter.chapterId, chapter.title);
      }
    }

    console.log('Đã thêm dữ liệu mẫu thành công!');
    return true;
  } catch (error) {
    console.error('Lỗi khi thêm dữ liệu mẫu:', error);
    return false;
  }
}

// Hàm tạo các chương cho khóa học
async function createChaptersForCourse(courseId: number, courseTitle: string): Promise<{chapterId: number, title: string}[]> {
  const chaptersData = [];
  let chapterCount = 0;

  if (courseTitle.includes('JavaScript')) {
    chaptersData.push(
      { title: 'Giới thiệu về JavaScript', description: 'Lịch sử và vai trò của JavaScript trong phát triển web.' },
      { title: 'Biến, kiểu dữ liệu và toán tử', description: 'Các khái niệm cơ bản trong JavaScript.' },
      { title: 'Cấu trúc điều khiển và vòng lặp', description: 'If/else, switch, for, while và do-while.' },
      { title: 'Hàm trong JavaScript', description: 'Cách định nghĩa và sử dụng hàm, tham số và giá trị trả về.' }
    );
  } else if (courseTitle.includes('HTML & CSS')) {
    chaptersData.push(
      { title: 'Cơ bản về HTML5', description: 'Cấu trúc tài liệu HTML và các thẻ phổ biến.' },
      { title: 'CSS cơ bản', description: 'Selectors, properties và values trong CSS.' },
      { title: 'Layout với CSS', description: 'Flexbox, Grid và positioning.' },
      { title: 'Responsive Design', description: 'Media queries và mobile-first approach.' }
    );
  } else if (courseTitle.includes('React')) {
    chaptersData.push(
      { title: 'Giới thiệu về React', description: 'React là gì và tại sao nên học React.' },
      { title: 'Component và Props', description: 'Xây dựng UI với React Components.' },
      { title: 'State và Lifecycle', description: 'Quản lý trạng thái trong React.' },
      { title: 'Hooks trong React', description: 'useState, useEffect và các hooks khác.' }
    );
  } else if (courseTitle.includes('Node.js')) {
    chaptersData.push(
      { title: 'Giới thiệu về Node.js', description: 'Node.js là gì và cách hoạt động.' },
      { title: 'Express.js Framework', description: 'Xây dựng web server với Express.' },
      { title: 'REST API với Node.js', description: 'Thiết kế và xây dựng RESTful API.' },
      { title: 'Làm việc với Database', description: 'MongoDB, MySQL và các ORM phổ biến.' }
    );
  }

  const result = [];

  for (const chapter of chaptersData) {
    chapterCount++;
    const [chapterResult] = await pool.query(
      'INSERT INTO Chapters (course_id, title, description, chapter_order) VALUES (?, ?, ?, ?)',
      [courseId, chapter.title, chapter.description, chapterCount]
    );
    
    result.push({
      chapterId: (chapterResult as any).insertId,
      title: chapter.title
    });
  }

  return result;
}

// Hàm tạo bài học cho mỗi chương
async function createLessonsForChapter(chapterId: number, chapterTitle: string) {
  const lessonsData = [];
  
  if (chapterTitle.includes('Giới thiệu về JavaScript')) {
    lessonsData.push(
      { title: 'Lịch sử của JavaScript', content: 'JavaScript được tạo bởi Brendan Eich vào năm 1995...' },
      { title: 'JavaScript trong phát triển web', content: 'Vai trò của JavaScript trong stack công nghệ hiện đại...' },
      { title: 'Công cụ phát triển và môi trường', content: 'Thiết lập môi trường phát triển JavaScript...' }
    );
  } else if (chapterTitle.includes('Biến, kiểu dữ liệu')) {
    lessonsData.push(
      { title: 'Khai báo biến với var, let và const', content: 'Cách khai báo và sử dụng biến trong JavaScript...' },
      { title: 'Các kiểu dữ liệu cơ bản', content: 'Number, String, Boolean, null, undefined...' },
      { title: 'Toán tử và biểu thức', content: 'Toán tử số học, so sánh, logic và gán...' }
    );
  } else if (chapterTitle.includes('Cơ bản về HTML5')) {
    lessonsData.push(
      { title: 'Cấu trúc tài liệu HTML', content: 'Doctype, head, body và các thẻ cơ bản...' },
      { title: 'Các thẻ văn bản và heading', content: 'Sử dụng h1-h6, p, span và các thẻ định dạng văn bản...' },
      { title: 'Liên kết và hình ảnh', content: 'Thẻ a, img và cách nhúng tài nguyên...' }
    );
  } else {
    // Tạo dữ liệu mẫu chung cho các chương còn lại
    lessonsData.push(
      { title: `Bài 1: Giới thiệu ${chapterTitle}`, content: `Nội dung giới thiệu về ${chapterTitle}...` },
      { title: `Bài 2: Kiến thức cơ bản về ${chapterTitle}`, content: `Các khái niệm cơ bản trong ${chapterTitle}...` },
      { title: `Bài 3: Thực hành với ${chapterTitle}`, content: `Các bài tập và ví dụ thực hành về ${chapterTitle}...` }
    );
  }

  for (let i = 0; i < lessonsData.length; i++) {
    const lesson = lessonsData[i];
    await pool.query(
      'INSERT INTO Lessons (chapter_id, title, content, lesson_order) VALUES (?, ?, ?, ?)',
      [chapterId, lesson.title, lesson.content, i + 1]
    );
  }
}

// Nếu file được chạy trực tiếp 
if (require.main === module) {
  seedSampleData()
    .then(() => {
      console.log('Hoàn thành việc thêm dữ liệu mẫu');
      process.exit(0);
    })
    .catch(error => {
      console.error('Lỗi:', error);
      process.exit(1);
    });
} 