import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { getEnrollmentsByUserId, mockCourses } from "@/utils/mockData";
import { Enrollment, Course } from "@/utils/mockData";

const Dashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!user) return;
    
    // Fetch enrollments for current user
    const fetchEnrollments = () => {
      setIsLoading(true);
      
      // Get enrollments (will be empty array if no mock data)
      const userEnrollments = getEnrollmentsByUserId(user.userId);
      setEnrollments(userEnrollments);
      
      // Generate recommended courses (excluding enrolled ones)
      // Will be empty if no mock courses exist
      const enrolledCourseIds = userEnrollments.map(e => e.courseId);
      const recommended = mockCourses
        .filter(course => !enrolledCourseIds.includes(course.courseId))
        .slice(0, 3);
      
      setRecommendedCourses(recommended);
      setIsLoading(false);
    };
    
    fetchEnrollments();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-xl text-gray-600">Đang tải dữ liệu...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-edu-dark mb-2">Chào mừng, {user?.fullName}</h1>
            <p className="text-gray-600">Theo dõi tiến độ học tập của bạn</p>
          </div>
          
          {/* My Courses Section */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-edu-dark">Khóa Học Của Tôi</h2>
              <Link to="/courses">
                <Button variant="outline">Xem Tất Cả Khóa Học</Button>
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-edu-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-xl font-semibold mb-4 text-edu-dark">Bạn chưa đăng ký khóa học nào</h3>
              <p className="text-gray-600 mb-6">
                Bắt đầu hành trình học tập bằng cách khám phá danh mục khóa học của chúng tôi.
              </p>
              <Link to="/courses">
                <Button>Khám Phá Khóa Học</Button>
              </Link>
            </div>
          </section>
          
          {/* Recommended Courses Section - only show if there are actual courses */}
          {recommendedCourses.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-edu-dark mb-6">Gợi Ý Cho Bạn</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedCourses.map((course) => (
                  <div key={course.courseId} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 text-edu-dark">{course.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-xs bg-edu-accent/30 text-edu-primary px-2 py-1 rounded-full">
                          {course.lessonsCount} bài học
                        </span>
                        <span className="text-xs bg-edu-accent/30 text-edu-primary px-2 py-1 rounded-full">
                          {course.enrolledCount} học viên
                        </span>
                      </div>
                      
                      <Link to={`/courses/${course.courseId}`}>
                        <Button variant="outline" className="w-full">Xem Khóa Học</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
