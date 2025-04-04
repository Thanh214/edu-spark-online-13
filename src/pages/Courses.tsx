
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search } from "lucide-react";
import { coursesAPI } from "@/utils/api";
import { useToast } from "@/components/ui/use-toast";
import CourseCard from "@/components/CourseCard";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface Course {
  course_id: number;
  title: string;
  description: string;
  thumbnail: string;
  created_at: string;
  updated_at: string;
}

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const coursesData = await coursesAPI.getAllCourses();
        setCourses(coursesData);
        setError(null);
      } catch (error: any) {
        console.error("Error fetching courses:", error);
        setError(error.message || "Không thể tải danh sách khóa học");
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách khóa học. Vui lòng thử lại sau.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on search term
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasAnyCourses = courses.length > 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Page Header */}
        <motion.section 
          className="bg-edu-primary text-white py-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Tất Cả Khóa Học</h1>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Khám phá các khóa học đa dạng được thiết kế để giúp bạn nắm vững kỹ năng mới và phát triển sự nghiệp.
            </p>
            
            {(!isLoading && hasAnyCourses) && (
              <div className="max-w-md mx-auto relative">
                <Input
                  type="text"
                  placeholder="Tìm kiếm khóa học..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white text-gray-800"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            )}
          </div>
        </motion.section>
        
        {/* Course Listings */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-20 w-full mb-4" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Có lỗi xảy ra</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button onClick={() => window.location.reload()}>Thử Lại</Button>
              </div>
            ) : !hasAnyCourses ? (
              <motion.div 
                className="text-center py-12 bg-white rounded-lg shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-edu-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Chưa có khóa học nào</h2>
                <p className="text-gray-600 mb-6">Hệ thống đang được cập nhật. Các khóa học sẽ sớm được thêm vào.</p>
                <Link to="/">
                  <Button>Quay Lại Trang Chủ</Button>
                </Link>
              </motion.div>
            ) : filteredCourses.length === 0 ? (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Không tìm thấy khóa học</h2>
                <p className="text-gray-600 mb-6">Hãy thử điều chỉnh từ khóa tìm kiếm.</p>
                <Button onClick={() => setSearchTerm("")}>Xóa Tìm Kiếm</Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course, index) => (
                  <CourseCard 
                    key={course.course_id}
                    id={course.course_id.toString()}
                    title={course.title}
                    description={course.description}
                    thumbnail={course.thumbnail ? `http://localhost:5000/${course.thumbnail}` : '/placeholder.svg'}
                    instructor="Giảng viên"
                    lessonsCount={4}
                    enrolledCount={20}
                    duration="4 giờ"
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Courses;
