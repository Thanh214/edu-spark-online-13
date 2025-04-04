
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, CheckCircle, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { enrollmentsAPI } from '@/api';
import { Enrollment } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { truncateText } from '@/lib/utils';

const Dashboard = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const data = await enrollmentsAPI.getUserEnrollments();
        setEnrollments(data);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
        setError('Không thể tải danh sách khóa học đã đăng ký.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-2">Xin chào, {user?.full_name}!</h1>
          <p className="text-gray-600">Chào mừng trở lại với hành trình học tập của bạn.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <BookOpen className="h-6 w-6 text-brand-blue" />
              </div>
              <h3 className="text-3xl font-bold">{enrollments.length}</h3>
              <p className="text-gray-500">Khóa học đã đăng ký</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold">2</h3>
              <p className="text-gray-500">Khóa học đã hoàn thành</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="bg-orange-100 p-3 rounded-full mb-4">
                <Clock className="h-6 w-6 text-brand-orange" />
              </div>
              <h3 className="text-3xl font-bold">12</h3>
              <p className="text-gray-500">Giờ học tập</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="bg-purple-100 p-3 rounded-full mb-4">
                <BarChart className="h-6 w-6 text-brand-purple" />
              </div>
              <h3 className="text-3xl font-bold">65%</h3>
              <p className="text-gray-500">Tiến độ trung bình</p>
            </CardContent>
          </Card>
        </div>

        {/* My Courses */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Khóa học của tôi</h2>
            <Link to="/courses">
              <Button variant="outline">Thêm khóa học mới</Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10 bg-red-50 rounded-lg">
              <p className="text-red-500 mb-4">{error}</p>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
              >
                Thử lại
              </Button>
            </div>
          ) : enrollments.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">Bạn chưa đăng ký khóa học nào</h3>
              <p className="text-gray-500 mb-6">Khám phá và đăng ký các khóa học phù hợp với bạn</p>
              <Link to="/courses">
                <Button>Khám phá khóa học</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => (
                <Card key={enrollment.enrollment_id} className="course-card overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={enrollment.course?.thumbnail || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"} 
                      alt={enrollment.course?.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm">
                      {enrollment.progress_percent}% hoàn thành
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg mb-2">{enrollment.course?.title}</h3>
                    <p className="text-gray-600 mb-4">
                      {truncateText(enrollment.course?.description || '', 80)}
                    </p>
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-brand-blue h-2.5 rounded-full" 
                          style={{ width: `${enrollment.progress_percent}%` }}
                        ></div>
                      </div>
                    </div>
                    <Link to={`/learn/${enrollment.course_id}`}>
                      <Button className="w-full">
                        {enrollment.progress_percent > 0 ? 'Tiếp tục học' : 'Bắt đầu học'}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
