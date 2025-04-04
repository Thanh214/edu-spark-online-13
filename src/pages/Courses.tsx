
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { coursesAPI } from '@/api';
import { Course } from '@/types';
import { truncateText } from '@/lib/utils';

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await coursesAPI.getAllCourses();
        setCourses(data);
        setFilteredCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Không thể tải danh sách khóa học. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setFilteredCourses(courses);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = courses.filter(
      course => course.title.toLowerCase().includes(query) || 
               course.description.toLowerCase().includes(query)
    );
    
    setFilteredCourses(filtered);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Khám phá khóa học</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tìm kiếm và ghi danh vào các khóa học chất lượng cao để phát triển kỹ năng và đạt được mục tiêu của bạn
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm khóa học..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Search size={18} className="text-gray-400" />
                </div>
                <Button 
                  type="submit" 
                  className="absolute right-0 top-0 bottom-0 rounded-l-none"
                >
                  Tìm kiếm
                </Button>
              </div>
            </form>
            
            <div className="md:w-48">
              <Button variant="outline" className="w-full flex items-center justify-center">
                <Filter size={16} className="mr-2" />
                Bộ lọc
              </Button>
            </div>
          </div>
        </div>

        {/* Courses List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">
            <p>{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Thử lại
            </Button>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">Không tìm thấy khóa học</h3>
            <p className="text-gray-500">Vui lòng thử lại với từ khóa khác</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <Link to={`/courses/${course.course_id}`} key={course.course_id}>
                <Card className="course-card h-full flex flex-col overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={course.thumbnail || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                    <p className="text-gray-600 mb-4 flex-grow">
                      {truncateText(course.description, 100)}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t">
                      <div className="flex items-center text-sm text-gray-500">
                        <BookOpen size={16} className="mr-1" />
                        <span>10 bài học</span>
                      </div>
                      <Button variant="link" className="p-0">Xem chi tiết</Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Courses;
