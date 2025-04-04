
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Award, Users, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { coursesAPI } from '@/api';
import { Course } from '@/types';
import { truncateText } from '@/lib/utils';

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses = await coursesAPI.getAllCourses();
        // Giả định 4 khóa học đầu tiên là khóa học nổi bật
        setFeaturedCourses(courses.slice(0, 4));
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-indigo text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Nâng cao kỹ năng của bạn với các khóa học trực tuyến chất lượng
              </h1>
              <p className="text-xl mb-8">
                EduSpark cung cấp các khóa học được giảng dạy bởi các chuyên gia hàng đầu. 
                Học mọi lúc, mọi nơi và phát triển các kỹ năng cần thiết cho tương lai.
              </p>
              <div className="flex space-x-4">
                <Link to="/courses">
                  <Button size="lg" variant="orange" className="font-semibold">
                    Khám phá khóa học
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline" className="bg-white text-brand-indigo font-semibold">
                    Đăng ký miễn phí
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                alt="Học trực tuyến" 
                className="rounded-lg shadow-2xl max-w-full h-auto"
                width={600}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Courses */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Khóa học nổi bật</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Các khóa học được đánh giá cao và thu hút nhiều học viên nhất trên nền tảng của chúng tôi
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredCourses.map((course) => (
                <Card key={course.course_id} className="course-card overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={course.thumbnail || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                    <p className="text-gray-600 mb-4 h-12 overflow-hidden">
                      {truncateText(course.description, 70)}
                    </p>
                    <Link to={`/courses/${course.course_id}`}>
                      <Button className="w-full">
                        Xem chi tiết
                        <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/courses">
              <Button variant="outline" size="lg">
                Xem tất cả khóa học
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Tại sao chọn EduSpark?</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Những lý do khiến chúng tôi trở thành lựa chọn hàng đầu cho việc học trực tuyến
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white shadow-lg rounded-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue text-white rounded-full mb-6">
                <BookOpen size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Nội dung chất lượng</h3>
              <p className="text-gray-600">
                Các khóa học được thiết kế và giảng dạy bởi các chuyên gia hàng đầu trong lĩnh vực
              </p>
            </div>

            <div className="text-center p-6 bg-white shadow-lg rounded-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-orange text-white rounded-full mb-6">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Chứng chỉ có giá trị</h3>
              <p className="text-gray-600">
                Nhận chứng chỉ được công nhận sau khi hoàn thành khóa học
              </p>
            </div>

            <div className="text-center p-6 bg-white shadow-lg rounded-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-purple text-white rounded-full mb-6">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Cộng đồng hỗ trợ</h3>
              <p className="text-gray-600">
                Tham gia cộng đồng học tập năng động và nhận hỗ trợ từ giảng viên
              </p>
            </div>

            <div className="text-center p-6 bg-white shadow-lg rounded-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-indigo text-white rounded-full mb-6">
                <Check size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Học linh hoạt</h3>
              <p className="text-gray-600">
                Học bất cứ lúc nào, bất cứ nơi đâu và theo tốc độ của riêng bạn
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-brand-indigo to-brand-purple text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Sẵn sàng bắt đầu hành trình học tập của bạn?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Tham gia cùng hàng nghìn học viên khác đang phát triển kỹ năng và xây dựng sự nghiệp của họ cùng EduSpark.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register">
              <Button variant="orange" size="lg" className="font-semibold">
                Đăng ký ngay
              </Button>
            </Link>
            <Link to="/courses">
              <Button variant="outline" size="lg" className="bg-white text-brand-indigo font-semibold">
                Khám phá khóa học
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
