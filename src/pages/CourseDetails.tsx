
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, BookOpen, FileText, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { coursesAPI, enrollmentsAPI } from '@/api';
import { Course, Chapter } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!id) return;
      
      try {
        const courseData = await coursesAPI.getCourseDetails(Number(id));
        setCourse(courseData);
      } catch (error) {
        console.error('Error fetching course details:', error);
        setError('Không thể tải thông tin khóa học. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }

    if (!id) return;

    setEnrolling(true);
    try {
      await enrollmentsAPI.enrollCourse(Number(id));
      navigate('/dashboard');
    } catch (error) {
      console.error('Error enrolling in course:', error);
      setError('Không thể đăng ký khóa học. Vui lòng thử lại sau.');
    } finally {
      setEnrolling(false);
    }
  };

  // Tính tổng số bài học
  const totalLessons = course?.chapters?.reduce(
    (acc, chapter) => acc + (chapter.lessons?.length || 0),
    0
  ) || 0;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error || !course) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl text-red-500 mb-4">Đã xảy ra lỗi</h2>
          <p className="mb-6">{error || 'Không tìm thấy khóa học'}</p>
          <Button onClick={() => navigate(-1)}>Quay lại</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Course Header */}
      <div className="bg-gradient-to-r from-brand-indigo to-brand-blue text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
              <Clock size={16} className="mr-2" />
              <span>8 tuần</span>
            </div>
            <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
              <BookOpen size={16} className="mr-2" />
              <span>{totalLessons} bài học</span>
            </div>
            <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
              <FileText size={16} className="mr-2" />
              <span>{course.chapters?.length || 0} chương</span>
            </div>
          </div>
          <p className="text-lg max-w-3xl">{course.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Nội dung khóa học</h2>
            <div className="space-y-6">
              {course.chapters && course.chapters.map((chapter: Chapter) => (
                <div key={chapter.chapter_id} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 p-4">
                    <h3 className="text-lg font-semibold">
                      Chương {chapter.chapter_order}: {chapter.title}
                    </h3>
                    {chapter.description && <p className="text-gray-600 mt-1">{chapter.description}</p>}
                  </div>
                  <div className="divide-y">
                    {chapter.lessons?.map((lesson, index) => (
                      <div key={lesson.lesson_id} className="p-4 flex justify-between items-center lesson-card">
                        <div className="flex items-center">
                          <span className="mr-3 text-gray-500">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span>{lesson.title}</span>
                        </div>
                        <Button variant="ghost" size="sm" disabled>
                          <Clock size={14} className="mr-1" />
                          <span>10 phút</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border rounded-lg p-6 shadow-lg">
              <div className="mb-6">
                <img
                  src={course.thumbnail || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Miễn phí</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700">
                    <Award size={18} className="mr-3 text-brand-blue" />
                    <span>Chứng chỉ hoàn thành</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Clock size={18} className="mr-3 text-brand-blue" />
                    <span>Truy cập trọn đời</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <BookOpen size={18} className="mr-3 text-brand-blue" />
                    <span>{totalLessons} bài học</span>
                  </li>
                </ul>
              </div>
              <Button
                variant="gradient"
                className="w-full"
                onClick={handleEnroll}
                disabled={enrolling}
              >
                {enrolling ? 'Đang xử lý...' : 'Đăng ký khóa học'}
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CourseDetails;
