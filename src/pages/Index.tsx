import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { mockCourses } from "@/utils/mockData";

const Index = () => {
  // Featured courses - just showing the first 3
  const featuredCourses = mockCourses.slice(0, 3);
  const hasFeaturedCourses = featuredCourses.length > 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="hero-gradient text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Thay Đổi Tương Lai Của Bạn Cùng EduSpark
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-slide-up">
              Khám phá tiềm năng của bạn với các khóa học trực tuyến do chuyên gia hướng dẫn. Học theo tốc độ của riêng bạn và đạt được mục tiêu của mình.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/courses">
                <Button size="lg" className="bg-white text-edu-primary hover:bg-gray-100">
                  Khám Phá Khóa Học
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-edu-primary">
                  Tham Gia Miễn Phí
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Featured Courses */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2 text-edu-dark">Khóa Học Nổi Bật</h2>
              <p className="text-lg text-gray-600">Khám phá các lộ trình học tập phổ biến nhất của chúng tôi</p>
            </div>
            
            {hasFeaturedCourses ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredCourses.map((course) => (
                  <div key={course.courseId} className="bg-white rounded-lg overflow-hidden shadow-md card-hover">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-edu-dark">{course.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          {course.lessonsCount} bài học • {course.enrolledCount} học viên
                        </div>
                        <Link to={`/courses/${course.courseId}`}>
                          <Button size="sm">Xem Khóa Học</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-edu-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="text-xl font-semibold mb-2 text-edu-dark">Chưa có khóa học nào</h3>
                <p className="text-gray-600 mb-6">Các khóa học đang được phát triển. Vui lòng quay lại sau.</p>
                <Link to="/register">
                  <Button>Đăng Ký Nhận Thông Báo</Button>
                </Link>
              </div>
            )}
            
            {hasFeaturedCourses && (
              <div className="text-center mt-12">
                <Link to="/courses">
                  <Button variant="outline" size="lg">Xem Tất Cả Khóa Học</Button>
                </Link>
              </div>
            )}
          </div>
        </section>
        
        {/* Why Choose Us */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2 text-edu-dark">Tại Sao Chọn EduSpark</h2>
              <p className="text-lg text-gray-600">Những lợi ích khiến nền tảng của chúng tôi khác biệt</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="bg-edu-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-edu-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-edu-dark">Giảng Viên Chuyên Nghiệp</h3>
                <p className="text-gray-600">Học từ các chuyên gia hàng đầu với nhiều năm kinh nghiệm thực tế.</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="bg-edu-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-edu-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-edu-dark">Học Tập Linh Hoạt</h3>
                <p className="text-gray-600">Học theo tốc độ của riêng bạn với quyền truy cập trọn đời vào tài liệu khóa học.</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="bg-edu-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-edu-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-edu-dark">Chứng Chỉ Được Công Nhận</h3>
                <p className="text-gray-600">Nhận chứng chỉ được công nhận sau khi hoàn thành khóa học thành công.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
