
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { coursesAPI, enrollmentsAPI } from "@/utils/api";
import { ChevronLeft, ChevronRight, Menu, X, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Document {
  document_id: number;
  lesson_id: number;
  title: string;
  file_path: string;
  uploaded_at: string;
}

interface Page {
  page_id: number;
  lesson_id: number;
  page_number: number;
  content: string | null;
  created_at: string;
}

interface Lesson {
  lesson_id: number;
  chapter_id: number;
  title: string;
  content: string | null;
  lesson_order: number;
  created_at: string;
  pages?: Page[];
  documents?: Document[];
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

interface Course {
  course_id: number;
  title: string;
  description: string;
  thumbnail: string;
  created_at: string;
  updated_at: string;
}

interface Exam {
  exam_id: number;
  course_id: number | null;
  chapter_id: number | null;
  title: string;
  time_limit: number | null;
  total_questions: number | null;
  passing_score: number | null;
}

const LearningPage = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [relatedExams, setRelatedExams] = useState<Exam[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId || !lessonId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const courseIdNum = parseInt(courseId);
        const lessonIdNum = parseInt(lessonId);
        
        // Get course details
        const courseData = await coursesAPI.getCourseById(courseIdNum);
        setCourse(courseData);
        
        // Get chapters for this course
        const chaptersData = await coursesAPI.getChapters(courseIdNum);
        setChapters(chaptersData);
        
        // Get current lesson with pages
        const lessonData = await coursesAPI.getLessonWithPages(lessonIdNum);
        if (lessonData) {
          setCurrentLesson(lessonData);
          
          // Set first page as current if available
          if (lessonData.pages && lessonData.pages.length > 0) {
            // Sort pages by page_number
            const sortedPages = [...lessonData.pages].sort((a, b) => a.page_number - b.page_number);
            setCurrentPage(sortedPages[0]);
            setCurrentPageIndex(0);
          } else {
            setCurrentPage(null);
          }
          
          // Update progress for this lesson
          try {
            await enrollmentsAPI.updateProgress(lessonIdNum, true);
          } catch (progressError) {
            console.error("Error updating lesson progress:", progressError);
          }
        }
        
        // TODO: Fetch related exams once the API is available
        setRelatedExams([]);
        
      } catch (err: any) {
        console.error("Error loading lesson:", err);
        setError(err.message || "Không thể tải nội dung bài học");
        toast({
          title: "Lỗi",
          description: "Không thể tải nội dung bài học. Vui lòng thử lại sau.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [courseId, lessonId]);

  // Find next and previous lessons
  const findNextAndPreviousLessons = () => {
    if (!chapters.length || !currentLesson) return { next: null, prev: null };
    
    let allLessons: Lesson[] = [];
    chapters.forEach(chapter => {
      if (chapter.lessons) {
        allLessons = [...allLessons, ...chapter.lessons];
      }
    });
    
    // Sort lessons by chapter order and lesson order
    allLessons.sort((a, b) => {
      const chapterA = chapters.find(ch => ch.chapter_id === a.chapter_id);
      const chapterB = chapters.find(ch => ch.chapter_id === b.chapter_id);
      
      if (!chapterA || !chapterB) return 0;
      
      if (chapterA.chapter_order !== chapterB.chapter_order) {
        return chapterA.chapter_order - chapterB.chapter_order;
      }
      
      return a.lesson_order - b.lesson_order;
    });
    
    const currentIndex = allLessons.findIndex(lesson => lesson.lesson_id === currentLesson.lesson_id);
    
    return {
      next: currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null,
      prev: currentIndex > 0 ? allLessons[currentIndex - 1] : null
    };
  };

  const { next: nextLesson, prev: prevLesson } = findNextAndPreviousLessons();

  const handleNextPage = () => {
    if (!currentLesson?.pages || currentPageIndex >= currentLesson.pages.length - 1) {
      // If no more pages, go to next lesson
      if (nextLesson) {
        navigate(`/learning/${courseId}/${nextLesson.lesson_id}`);
      }
      return;
    }
    
    // Sort pages by page_number before accessing next page
    const sortedPages = [...currentLesson.pages].sort((a, b) => a.page_number - b.page_number);
    setCurrentPage(sortedPages[currentPageIndex + 1]);
    setCurrentPageIndex(currentPageIndex + 1);
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0 && currentLesson?.pages) {
      // Sort pages by page_number before accessing previous page
      const sortedPages = [...currentLesson.pages].sort((a, b) => a.page_number - b.page_number);
      setCurrentPage(sortedPages[currentPageIndex - 1]);
      setCurrentPageIndex(currentPageIndex - 1);
    } else {
      // If on first page, go to previous lesson
      if (prevLesson) {
        navigate(`/learning/${courseId}/${prevLesson.lesson_id}`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-xl text-gray-600">Đang tải nội dung bài học...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !course || !currentLesson) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-edu-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-2xl font-bold text-red-600 mb-4">Không Tìm Thấy Bài Học</h1>
            <p className="text-gray-600 mb-6">{error || "Bài học bạn đang tìm kiếm không tồn tại."}</p>
            <Link to="/courses">
              <Button>Quay Lại Danh Sách Khóa Học</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const hasPages = currentLesson.pages && currentLesson.pages.length > 0;

  if (!hasPages && !currentLesson.content) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-edu-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h1 className="text-2xl font-bold text-amber-600 mb-4">Bài Học Chưa Có Nội Dung</h1>
            <p className="text-gray-600 mb-6">Bài học này hiện chưa có nội dung nào.</p>
            <p className="text-gray-600 mb-6">Nội dung đang được chuẩn bị và sẽ được cập nhật sớm.</p>
            <div className="flex justify-center space-x-4">
              {prevLesson && (
                <Link to={`/learning/${courseId}/${prevLesson.lesson_id}`}>
                  <Button variant="outline">Bài Học Trước</Button>
                </Link>
              )}
              {nextLesson && (
                <Link to={`/learning/${courseId}/${nextLesson.lesson_id}`}>
                  <Button>Bài Học Tiếp Theo</Button>
                </Link>
              )}
              {!prevLesson && !nextLesson && (
                <Link to="/courses">
                  <Button>Quay Lại Danh Sách Khóa Học</Button>
                </Link>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow flex flex-col md:flex-row">
        {/* Sidebar - Desktop */}
        <div className={`hidden md:flex flex-col w-80 bg-white border-r border-gray-200 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto`}>
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-bold truncate">{course.title}</h2>
          </div>
          
          <div className="flex-grow overflow-y-auto">
            <Accordion type="multiple" defaultValue={chapters.map(ch => `chapter-${ch.chapter_id}`)}>
              {chapters.map((chapter) => (
                <AccordionItem key={chapter.chapter_id} value={`chapter-${chapter.chapter_id}`}>
                  <AccordionTrigger className="px-4">
                    {chapter.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-1 pl-4">
                      {chapter.lessons && chapter.lessons.map((lesson) => (
                        <Link 
                          key={lesson.lesson_id}
                          to={`/learning/${courseId}/${lesson.lesson_id}`}
                          className={`block px-4 py-2 text-sm rounded-md ${
                            lesson.lesson_id === currentLesson.lesson_id 
                              ? 'bg-edu-primary text-white' 
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {lesson.title}
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            {/* Exams section */}
            {relatedExams.length > 0 && (
              <div className="mt-4">
                <div className="px-4 py-2 font-semibold text-sm text-gray-600 uppercase">Bài Kiểm Tra</div>
                <div className="space-y-1 pl-4">
                  {relatedExams.map((exam) => (
                    <Link
                      key={exam.exam_id}
                      to={`/exam/${exam.exam_id}`}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                    >
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-500" />
                        {exam.title}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Sidebar Toggle */}
        <button
          className="md:hidden fixed bottom-6 left-6 z-20 bg-edu-primary text-white p-3 rounded-full shadow-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-10 bg-white">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-bold truncate">{course.title}</h2>
                <button onClick={() => setSidebarOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-grow overflow-y-auto">
                <Accordion type="multiple" defaultValue={chapters.map(ch => `chapter-${ch.chapter_id}`)}>
                  {chapters.map((chapter) => (
                    <AccordionItem key={chapter.chapter_id} value={`chapter-${chapter.chapter_id}`}>
                      <AccordionTrigger className="px-4">
                        {chapter.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1 pl-4">
                          {chapter.lessons && chapter.lessons.map((lesson) => (
                            <Link 
                              key={lesson.lesson_id}
                              to={`/learning/${courseId}/${lesson.lesson_id}`}
                              className={`block px-4 py-2 text-sm rounded-md ${
                                lesson.lesson_id === currentLesson.lesson_id 
                                  ? 'bg-edu-primary text-white' 
                                  : 'hover:bg-gray-100'
                              }`}
                              onClick={() => setSidebarOpen(false)}
                            >
                              {lesson.title}
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                
                {/* Related Exams */}
                {relatedExams.length > 0 && (
                  <div className="p-4 border-t border-gray-200">
                    <h3 className="font-semibold mb-2">Bài Kiểm Tra</h3>
                    <div className="space-y-2">
                      {relatedExams.map((exam) => (
                        <Link 
                          key={exam.exam_id}
                          to={`/exam/${exam.exam_id}`}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-edu-accent/20 text-edu-primary rounded-md hover:bg-edu-accent/30"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <FileText size={16} />
                          {exam.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className="flex-grow">
          <div className="container mx-auto px-4 py-8">
            {/* Lesson Title */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-edu-dark mb-2">{currentLesson.title}</h1>
              <div className="text-sm text-gray-500">
                {chapters.find(ch => ch.chapter_id === currentLesson.chapter_id)?.title}
              </div>
            </div>
            
            {/* Lesson Content */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              {hasPages && currentPage ? (
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentPage.content || '<p>Trang này chưa có nội dung.</p>' }}
                />
              ) : (
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentLesson.content || '<p>Bài học này chưa có nội dung.</p>' }}
                />
              )}
              
              {/* Page Navigation */}
              {hasPages && currentLesson.pages && currentLesson.pages.length > 0 && (
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Trang {currentPageIndex + 1} / {currentLesson.pages.length}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={handlePrevPage}
                        disabled={currentPageIndex === 0 && !prevLesson}
                      >
                        <ChevronLeft className="mr-2" size={16} />
                        Trang trước
                      </Button>
                      <Button
                        onClick={handleNextPage}
                        disabled={currentPageIndex === currentLesson.pages.length - 1 && !nextLesson}
                      >
                        Trang tiếp theo
                        <ChevronRight className="ml-2" size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Attachments */}
              {currentLesson.documents && currentLesson.documents.length > 0 && (
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <h3 className="font-semibold mb-4">Tài liệu bài học</h3>
                  <div className="space-y-2">
                    {currentLesson.documents.map((doc) => (
                      <a
                        key={doc.document_id}
                        href={`http://localhost:5000/${doc.file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-gray-50 rounded-md hover:bg-gray-100"
                      >
                        <FileText size={18} className="text-edu-primary" />
                        <div>
                          <div className="font-medium">{doc.title}</div>
                          <div className="text-xs text-gray-500">Nhấp để tải xuống</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Lesson Navigation */}
            <div className="flex justify-between">
              {prevLesson ? (
                <Link to={`/learning/${courseId}/${prevLesson.lesson_id}`}>
                  <Button variant="outline">
                    <ChevronLeft className="mr-2" size={16} />
                    Bài học trước
                  </Button>
                </Link>
              ) : (
                <div></div>
              )}
              
              {nextLesson && (
                <Link to={`/learning/${courseId}/${nextLesson.lesson_id}`}>
                  <Button>
                    Bài học tiếp theo
                    <ChevronRight className="ml-2" size={16} />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LearningPage;
