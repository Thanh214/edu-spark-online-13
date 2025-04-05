
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/contexts/AuthContext";
import { coursesAPI, enrollmentsAPI } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";

interface Course {
  course_id: number;
  title: string;
  description: string;
  thumbnail: string;
  created_at: string;
  updated_at: string;
}

interface Lesson {
  lesson_id: number;
  chapter_id: number;
  title: string;
  content: string | null;
  lesson_order: number;
  created_at: string;
}

interface Chapter {
  chapter_id: number;
  course_id: number;
  title: string;
  description: string | null;
  chapter_order: number;
  created_at: string;
  lessons: Lesson[];
}

interface CourseWithDetails extends Course {
  chapters: Chapter[];
}

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<CourseWithDetails | null>(null);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [enrollmentLoading, setEnrollmentLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId) return;
      
      try {
        setIsLoading(true);
        const courseIdNum = parseInt(courseId);
        
        // Get course details with chapters and lessons
        const courseData = await coursesAPI.getCourseWithDetails(courseIdNum);
        setCourse(courseData);
        
        // Check if user is enrolled (if authenticated)
        if (isAuthenticated) {
          try {
            const enrollments = await enrollmentsAPI.getUserEnrollments();
            const isUserEnrolled = enrollments.some(
              (enrollment: any) => enrollment.course_id === courseIdNum
            );
            setIsEnrolled(isUserEnrolled);
          } catch (enrollError) {
            console.error("Error checking enrollment:", enrollError);
          }
        }
        
        setError(null);
      } catch (err: any) {
        console.error("Error fetching course details:", err);
        setError(err.message || "Không thể tải thông tin khóa học");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourseDetails();
  }, [courseId, isAuthenticated, user]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (!courseId) return;
    
    try {
      setEnrollmentLoading(true);
      await enrollmentsAPI.enrollCourse(parseInt(courseId));
      setIsEnrolled(true);
      
      toast({
        title: "Thành công",
        description: "Bạn đã đăng ký khóa học thành công",
      });
    } catch (err: any) {
      toast({
        title: "Lỗi",
        description: err.message || "Không thể đăng ký khóa học",
        variant: "destructive",
      });
    } finally {
      setEnrollmentLoading(false);
    }
  };

  const handleContinueLearning = () => {
    if (!course || !course.chapters || course.chapters.length === 0) return;
    
    // Find the first chapter with lessons
    const firstChapterWithLessons = course.chapters.find(chapter => 
      chapter.lessons && chapter.lessons.length > 0
    );
    
    if (firstChapterWithLessons && firstChapterWithLessons.lessons.length > 0) {
      const firstLessonId = firstChapterWithLessons.lessons[0].lesson_id;
      navigate(`/learning/${courseId}/${firstLessonId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {/* Skeleton for course header */}
          <div className="bg-edu-primary text-white py-12 md:py-16">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <Skeleton className="h-10 w-3/4 mb-4 bg-white/20" />
                  <Skeleton className="h-20 w-full mb-6 bg-white/20" />
                  <div className="flex flex-wrap gap-4 mb-8">
                    <Skeleton className="h-16 w-20 bg-white/20" />
                    <Skeleton className="h-16 w-20 bg-white/20" />
                    <Skeleton className="h-16 w-20 bg-white/20" />
                  </div>
                  <Skeleton className="h-10 w-32 bg-white/20" />
                </div>
                <div className="hidden lg:block">
                  <Skeleton className="h-64 w-full rounded-xl bg-white/20" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Skeleton for course content */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="border rounded-lg p-4">
                    <Skeleton className="h-6 w-full mb-3" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-edu-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-2xl font-bold text-red-600 mb-4">Không Tìm Thấy Khóa Học</h1>
            <p className="text-gray-600 mb-6">{error || "Không tìm thấy khóa học mà bạn đang tìm kiếm."}</p>
            <Link to="/courses">
              <Button>Trở Về Trang Khóa Học</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate course stats
  const chaptersCount = course.chapters ? course.chapters.length : 0;
  const lessonsCount = course.chapters ? 
    course.chapters.reduce((sum, chapter) => sum + (chapter.lessons ? chapter.lessons.length : 0), 0) : 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Course Header */}
        <section className="bg-edu-primary text-white py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-lg mb-6">{course.description}</p>
                
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="bg-white/10 px-4 py-2 rounded-md">
                    <div className="text-2xl font-bold">{chaptersCount}</div>
                    <div className="text-sm">Chương</div>
                  </div>
                  <div className="bg-white/10 px-4 py-2 rounded-md">
                    <div className="text-2xl font-bold">{lessonsCount}</div>
                    <div className="text-sm">Bài học</div>
                  </div>
                  <div className="bg-white/10 px-4 py-2 rounded-md">
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-sm">Học viên</div>
                  </div>
                </div>
                
                {isEnrolled ? (
                  <Button 
                    size="lg"
                    className="bg-white text-edu-primary hover:bg-gray-100"
                    onClick={handleContinueLearning}
                  >
                    Tiếp Tục Học
                  </Button>
                ) : (
                  <Button 
                    size="lg"
                    className="bg-white text-edu-primary hover:bg-gray-100"
                    onClick={handleEnroll}
                    disabled={enrollmentLoading}
                  >
                    {enrollmentLoading ? "Đang xử lý..." : "Đăng Ký Ngay"}
                  </Button>
                )}
              </div>
              
              <div className="hidden lg:block">
                <img 
                  src={course.thumbnail ? `http://localhost:5000/${course.thumbnail}` : '/placeholder.svg'} 
                  alt={course.title} 
                  className="w-full h-auto rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Course Content */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-edu-dark">Nội Dung Khóa Học</h2>
            
            {!course.chapters || course.chapters.length === 0 ? (
              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <p className="text-gray-600">Nội dung của khóa học này đang được chuẩn bị.</p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {course.chapters.map((chapter) => (
                  <AccordionItem key={chapter.chapter_id} value={`chapter-${chapter.chapter_id}`}>
                    <AccordionTrigger className="text-lg font-medium py-4 hover:no-underline">
                      <div className="flex items-start">
                        <span className="text-left">{chapter.title}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          ({chapter.lessons ? chapter.lessons.length : 0} bài học)
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-4 py-2">
                        <p className="text-gray-600 mb-4">{chapter.description}</p>
                        
                        {chapter.lessons && chapter.lessons.length > 0 ? (
                          <div className="space-y-3">
                            {chapter.lessons.map((lesson, index) => (
                              <div key={lesson.lesson_id} className="flex items-center p-3 bg-gray-50 rounded-md">
                                <div className="w-8 h-8 rounded-full bg-edu-accent/50 flex items-center justify-center mr-3">
                                  {index + 1}
                                </div>
                                <div className="flex-grow">
                                  <h4 className="font-medium">{lesson.title}</h4>
                                </div>
                                {isEnrolled ? (
                                  <Link to={`/learning/${courseId}/${lesson.lesson_id}`}>
                                    <Button size="sm" variant="outline">Xem</Button>
                                  </Link>
                                ) : (
                                  <Button size="sm" variant="outline" disabled>Khóa</Button>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">Chưa có bài học nào trong chương này.</p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4 text-edu-dark">Sẵn sàng để bắt đầu học?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Tham gia cùng hàng nghìn học viên đang cải thiện kỹ năng và sự nghiệp của họ với EduSpark.
            </p>
            
            {isEnrolled ? (
              <Button 
                size="lg"
                onClick={handleContinueLearning}
              >
                Tiếp Tục Học
              </Button>
            ) : (
              <Button 
                size="lg"
                onClick={handleEnroll}
                disabled={enrollmentLoading}
              >
                {enrollmentLoading ? "Đang xử lý..." : "Đăng Ký Ngay"}
              </Button>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CourseDetails;
