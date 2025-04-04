
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { getEnrollmentsByUserId, mockCourses } from "@/utils/mockData";
import { Enrollment, Course } from "@/utils/mockData";

const Dashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!user) return;
    
    // Fetch enrollments for current user
    const fetchEnrollments = () => {
      setIsLoading(true);
      
      const userEnrollments = getEnrollmentsByUserId(user.userId);
      setEnrollments(userEnrollments);
      
      // Generate recommended courses (excluding enrolled ones)
      const enrolledCourseIds = userEnrollments.map(e => e.courseId);
      const recommended = mockCourses
        .filter(course => !enrolledCourseIds.includes(course.courseId))
        .slice(0, 3);
      
      setRecommendedCourses(recommended);
      setIsLoading(false);
    };
    
    fetchEnrollments();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-xl text-gray-600">Loading dashboard...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-edu-dark mb-2">Welcome back, {user?.fullName}</h1>
            <p className="text-gray-600">Track your progress and continue learning</p>
          </div>
          
          {/* My Courses Section */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-edu-dark">My Courses</h2>
              <Link to="/courses">
                <Button variant="outline">Browse All Courses</Button>
              </Link>
            </div>
            
            {enrollments.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h3 className="text-xl font-semibold mb-4 text-edu-dark">You haven't enrolled in any courses yet</h3>
                <p className="text-gray-600 mb-6">
                  Start your learning journey by browsing our catalog of courses.
                </p>
                <Link to="/courses">
                  <Button>Explore Courses</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map((enrollment) => (
                  <div key={enrollment.enrollmentId} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="relative">
                      <img 
                        src={enrollment.course?.thumbnail} 
                        alt={enrollment.course?.title} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <div className="text-white font-semibold">{enrollment.course?.title}</div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-sm text-gray-600">Progress</div>
                          <div className="text-sm font-medium">{enrollment.progressPercent.toFixed(0)}%</div>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-value" 
                            style={{ width: `${enrollment.progressPercent}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <Link to={`/learning/${enrollment.courseId}/${enrollment.currentLessonId || ''}`}>
                        <Button className="w-full">Continue Learning</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
          
          {/* Recommended Courses */}
          {recommendedCourses.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-edu-dark mb-6">Recommended for You</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedCourses.map((course) => (
                  <div key={course.courseId} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 text-edu-dark">{course.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-xs bg-edu-accent/30 text-edu-primary px-2 py-1 rounded-full">
                          {course.lessonsCount} lessons
                        </span>
                        <span className="text-xs bg-edu-accent/30 text-edu-primary px-2 py-1 rounded-full">
                          {course.enrolledCount} students
                        </span>
                      </div>
                      
                      <Link to={`/courses/${course.courseId}`}>
                        <Button variant="outline" className="w-full">View Course</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
