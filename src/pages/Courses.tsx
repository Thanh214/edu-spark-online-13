
import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { mockCourses } from "@/utils/mockData";
import { Search } from "lucide-react";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter courses based on search term
  const filteredCourses = mockCourses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-edu-primary text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Tất Cả Khóa Học</h1>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Khám phá các khóa học đa dạng được thiết kế để giúp bạn nắm vững kỹ năng mới và phát triển sự nghiệp.
            </p>
            
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
          </div>
        </section>
        
        {/* Course Listings */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            {filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Không tìm thấy khóa học</h2>
                <p className="text-gray-600 mb-6">Hãy thử điều chỉnh từ khóa tìm kiếm.</p>
                <Button onClick={() => setSearchTerm("")}>Xóa Tìm Kiếm</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                  <div key={course.courseId} className="bg-white rounded-lg overflow-hidden shadow-md card-hover">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-edu-dark">{course.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-xs bg-edu-accent/30 text-edu-primary px-2 py-1 rounded-full">
                          {course.chaptersCount} chương
                        </span>
                        <span className="text-xs bg-edu-accent/30 text-edu-primary px-2 py-1 rounded-full">
                          {course.lessonsCount} bài học
                        </span>
                        <span className="text-xs bg-edu-accent/30 text-edu-primary px-2 py-1 rounded-full">
                          {course.enrolledCount} học viên
                        </span>
                      </div>
                      
                      <Link to={`/courses/${course.courseId}`}>
                        <Button className="w-full">Xem Khóa Học</Button>
                      </Link>
                    </div>
                  </div>
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
