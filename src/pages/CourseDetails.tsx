
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/contexts/AuthContext";
import { getCourseById, getChaptersByCourseId, mockEnrollments } from "@/utils/mockData";
import { Course, Chapter } from "@/utils/mockData";

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [enrollmentId, setEnrollmentId] = useState<number | null>(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseDetails = () => {
      if (!courseId) return;
      
      // Get course details
      const fetchedCourse = getCourseById(parseInt(courseId));
      if (fetchedCourse) {
        setCourse(fetchedCourse);
        
        // Get chapters for this course
        const fetchedChapters = getChaptersByCourseId(parseInt(courseId));
        setChapters(fetchedChapters);
        
        // Check if user is enrolled
        if (isAuthenticated && user) {
          const enrollment = mockEnrollments.find(
            (e) => e.courseId === parseInt(courseId) && e.userId === user.userId
          );
          
          if (enrollment) {
            setIsEnrolled(true);
            setEnrollmentId(enrollment.enrollmentId);
          }
        }
      }
      
      setIsLoading(false);
    };
    
    fetchCourseDetails();
  }, [courseId, isAuthenticated, user]);

  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    // Simulate enrollment API call
    setIsLoading(true);
    
    setTimeout(() => {
      // In a real app, we would make an API call to enroll
      const newEnrollmentId = Math.floor(Math.random() * 1000) + 1;
      setIsEnrolled(true);
      setEnrollmentId(newEnrollmentId);
      setIsLoading(false);
      
      toast({
        title: "Success",
        description: "You have successfully enrolled in this course",
      });
    }, 1000);
  };

  const handleContinueLearning = () => {
    if (!course || !chapters.length || chapters[0].lessons.length === 0) return;
    
    // Navigate to the first lesson if no current lesson, or to the current lesson
    const firstLessonId = chapters[0].lessons[0].lessonId;
    navigate(`/learning/${courseId}/${firstLessonId}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-xl text-gray-600">Loading course details...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Course Not Found</h1>
            <p className="text-gray-600 mb-6">The course you are looking for does not exist.</p>
            <Link to="/courses">
              <Button>Browse All Courses</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
                    <div className="text-2xl font-bold">{course.chaptersCount}</div>
                    <div className="text-sm">Chapters</div>
                  </div>
                  <div className="bg-white/10 px-4 py-2 rounded-md">
                    <div className="text-2xl font-bold">{course.lessonsCount}</div>
                    <div className="text-sm">Lessons</div>
                  </div>
                  <div className="bg-white/10 px-4 py-2 rounded-md">
                    <div className="text-2xl font-bold">{course.enrolledCount}</div>
                    <div className="text-sm">Students</div>
                  </div>
                </div>
                
                {isEnrolled ? (
                  <Button 
                    size="lg"
                    className="bg-white text-edu-primary hover:bg-gray-100"
                    onClick={handleContinueLearning}
                  >
                    Continue Learning
                  </Button>
                ) : (
                  <Button 
                    size="lg"
                    className="bg-white text-edu-primary hover:bg-gray-100"
                    onClick={handleEnroll}
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Enroll Now"}
                  </Button>
                )}
              </div>
              
              <div className="hidden lg:block">
                <img 
                  src={course.thumbnail} 
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
            <h2 className="text-2xl font-bold mb-6 text-edu-dark">Course Content</h2>
            
            {chapters.length === 0 ? (
              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <p className="text-gray-600">Content for this course is being prepared.</p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {chapters.map((chapter) => (
                  <AccordionItem key={chapter.chapterId} value={`chapter-${chapter.chapterId}`}>
                    <AccordionTrigger className="text-lg font-medium py-4 hover:no-underline">
                      <div className="flex items-start">
                        <span className="text-left">{chapter.title}</span>
                        <span className="text-sm text-gray-500 ml-2">({chapter.lessons.length} lessons)</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-4 py-2">
                        <p className="text-gray-600 mb-4">{chapter.description}</p>
                        
                        <div className="space-y-3">
                          {chapter.lessons.map((lesson, index) => (
                            <div key={lesson.lessonId} className="flex items-center p-3 bg-gray-50 rounded-md">
                              <div className="w-8 h-8 rounded-full bg-edu-accent/50 flex items-center justify-center mr-3">
                                {index + 1}
                              </div>
                              <div className="flex-grow">
                                <h4 className="font-medium">{lesson.title}</h4>
                              </div>
                              {isEnrolled ? (
                                <Link to={`/learning/${courseId}/${lesson.lessonId}`}>
                                  <Button size="sm" variant="outline">View</Button>
                                </Link>
                              ) : (
                                <Button size="sm" variant="outline" disabled>Locked</Button>
                              )}
                            </div>
                          ))}
                        </div>
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
            <h2 className="text-2xl font-bold mb-4 text-edu-dark">Ready to Start Learning?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already advancing their careers with EduSpark.
            </p>
            
            {isEnrolled ? (
              <Button 
                size="lg"
                onClick={handleContinueLearning}
              >
                Continue Learning
              </Button>
            ) : (
              <Button 
                size="lg"
                onClick={handleEnroll}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Enroll Now"}
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
