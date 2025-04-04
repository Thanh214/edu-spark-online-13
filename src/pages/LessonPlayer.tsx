
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Menu, ChevronLeft, ChevronRight, Book, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { coursesAPI, enrollmentsAPI } from '@/api';
import { Course, Chapter, Lesson } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const LessonPlayer = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId?: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId) return;
      
      try {
        const courseData = await coursesAPI.getCourseDetails(Number(courseId));
        setCourse(courseData);

        // Find current lesson and chapter
        if (lessonId) {
          let foundLesson: Lesson | null = null;
          let foundChapter: Chapter | null = null;

          for (const chapter of courseData.chapters || []) {
            const lesson = chapter.lessons?.find(
              l => l.lesson_id === Number(lessonId)
            );
            if (lesson) {
              foundLesson = lesson;
              foundChapter = chapter;
              break;
            }
          }

          setCurrentLesson(foundLesson);
          setCurrentChapter(foundChapter);
        } else if (courseData.chapters && courseData.chapters.length > 0) {
          // Default to first lesson if no lesson ID provided
          const firstChapter = courseData.chapters[0];
          if (firstChapter.lessons && firstChapter.lessons.length > 0) {
            setCurrentChapter(firstChapter);
            setCurrentLesson(firstChapter.lessons[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
        setError('Không thể tải thông tin khóa học. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, lessonId]);

  const handleLessonChange = (lesson: Lesson, chapter: Chapter) => {
    setCurrentLesson(lesson);
    setCurrentChapter(chapter);
    navigate(`/learn/${courseId}/${lesson.lesson_id}`);
    
    // Update progress (simplified)
    if (user && courseId) {
      try {
        // In a real app, you'd get the enrollment ID and calculate proper progress
        // enrollmentsAPI.updateProgress(enrollmentId, lesson.lesson_id, progress);
        console.log('Progress would be updated here');
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  const getNextLesson = (): { lesson: Lesson; chapter: Chapter } | null => {
    if (!course || !currentChapter || !currentLesson) return null;
    
    const chapters = course.chapters || [];
    const currentChapterIndex = chapters.findIndex(c => c.chapter_id === currentChapter.chapter_id);
    
    if (currentChapterIndex === -1) return null;
    
    const lessons = currentChapter.lessons || [];
    const currentLessonIndex = lessons.findIndex(l => l.lesson_id === currentLesson.lesson_id);
    
    if (currentLessonIndex === -1) return null;
    
    // If there's a next lesson in the current chapter
    if (currentLessonIndex < lessons.length - 1) {
      return { 
        lesson: lessons[currentLessonIndex + 1],
        chapter: currentChapter
      };
    }
    
    // If there's a next chapter with lessons
    if (currentChapterIndex < chapters.length - 1) {
      const nextChapter = chapters[currentChapterIndex + 1];
      if (nextChapter.lessons && nextChapter.lessons.length > 0) {
        return {
          lesson: nextChapter.lessons[0],
          chapter: nextChapter
        };
      }
    }
    
    return null;
  };

  const getPreviousLesson = (): { lesson: Lesson; chapter: Chapter } | null => {
    if (!course || !currentChapter || !currentLesson) return null;
    
    const chapters = course.chapters || [];
    const currentChapterIndex = chapters.findIndex(c => c.chapter_id === currentChapter.chapter_id);
    
    if (currentChapterIndex === -1) return null;
    
    const lessons = currentChapter.lessons || [];
    const currentLessonIndex = lessons.findIndex(l => l.lesson_id === currentLesson.lesson_id);
    
    if (currentLessonIndex === -1) return null;
    
    // If there's a previous lesson in the current chapter
    if (currentLessonIndex > 0) {
      return { 
        lesson: lessons[currentLessonIndex - 1],
        chapter: currentChapter
      };
    }
    
    // If there's a previous chapter with lessons
    if (currentChapterIndex > 0) {
      const prevChapter = chapters[currentChapterIndex - 1];
      if (prevChapter.lessons && prevChapter.lessons.length > 0) {
        return {
          lesson: prevChapter.lessons[prevChapter.lessons.length - 1],
          chapter: prevChapter
        };
      }
    }
    
    return null;
  };

  const nextLesson = getNextLesson();
  const prevLesson = getPreviousLesson();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl text-red-500 mb-4">Đã xảy ra lỗi</h2>
        <p className="mb-6">{error || 'Không tìm thấy khóa học'}</p>
        <Button onClick={() => navigate('/dashboard')}>Quay lại Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div 
        className={`bg-white border-r overflow-auto ${
          sidebarOpen ? 'w-80' : 'w-0'
        } transition-all duration-300 flex-shrink-0`}
      >
        <div className="p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="font-bold text-lg truncate">{course.title}</h2>
        </div>
        <div className="p-4">
          {course.chapters?.map((chapter) => (
            <div key={chapter.chapter_id} className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">
                Chương {chapter.chapter_order}: {chapter.title}
              </h3>
              <ul className="space-y-2 pl-4">
                {chapter.lessons?.map((lesson) => (
                  <li 
                    key={lesson.lesson_id} 
                    className={`cursor-pointer p-2 rounded flex items-center ${
                      currentLesson?.lesson_id === lesson.lesson_id
                        ? 'bg-blue-100 text-brand-blue'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleLessonChange(lesson, chapter)}
                  >
                    {currentLesson?.lesson_id === lesson.lesson_id ? (
                      <Book size={16} className="mr-2" />
                    ) : (
                      <FileText size={16} className="mr-2" />
                    )}
                    <span className="text-sm">{lesson.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-grow overflow-auto">
        {/* Top Navigation */}
        <div className="bg-white p-4 border-b flex items-center justify-between">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={20} />
          </Button>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              Thoát
            </Button>
            {currentLesson && (
              <div className="flex items-center text-sm">
                <CheckCircle size={16} className="mr-1 text-green-500" />
                <span>Đánh dấu hoàn thành</span>
              </div>
            )}
          </div>
        </div>

        {/* Lesson Content */}
        <div className="flex-grow p-6 overflow-auto">
          {currentLesson ? (
            <div>
              <h1 className="text-3xl font-bold mb-2">{currentLesson.title}</h1>
              <p className="text-gray-500 mb-6">
                {currentChapter?.title} • Bài {currentLesson.lesson_order}
              </p>
              
              {currentLesson.content ? (
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <p className="text-gray-500">Chưa có nội dung cho bài học này.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Vui lòng chọn một bài học để bắt đầu.</p>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        {currentLesson && (
          <div className="bg-white p-4 border-t flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => prevLesson && handleLessonChange(prevLesson.lesson, prevLesson.chapter)}
              disabled={!prevLesson}
              className="flex items-center"
            >
              <ChevronLeft size={16} className="mr-2" />
              Bài trước
            </Button>
            
            <Button
              onClick={() => nextLesson && handleLessonChange(nextLesson.lesson, nextLesson.chapter)}
              disabled={!nextLesson}
              className="flex items-center"
            >
              Bài tiếp theo
              <ChevronRight size={16} className="ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPlayer;
