
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  Users, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  Layers 
} from "lucide-react";
import { mockCourses, mockEnrollments, mockExams } from "@/utils/mockData";

const AdminOverview = () => {
  // In a real app, these would be fetched from an API
  const totalUsers = 1245;
  const totalCourses = mockCourses.length;
  const totalEnrollments = mockEnrollments.length;
  const totalExams = mockExams.length;
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to the EduSpark admin dashboard.</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalUsers}</div>
            <p className="text-xs text-gray-500">
              <TrendingUp className="h-3 w-3 inline mr-1 text-green-500" />
              <span className="text-green-500">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCourses}</div>
            <p className="text-xs text-gray-500">
              <TrendingUp className="h-3 w-3 inline mr-1 text-green-500" />
              <span className="text-green-500">+5%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Enrollments</CardTitle>
            <Layers className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalEnrollments}</div>
            <p className="text-xs text-gray-500">
              <TrendingUp className="h-3 w-3 inline mr-1 text-green-500" />
              <span className="text-green-500">+18%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Exams Created</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalExams}</div>
            <p className="text-xs text-gray-500">
              <TrendingUp className="h-3 w-3 inline mr-1 text-green-500" />
              <span className="text-green-500">+7%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
            <CardDescription>Latest user course enrollments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockEnrollments.map((enrollment) => (
                <div key={enrollment.enrollmentId} className="flex items-center">
                  <div className="bg-edu-primary/10 rounded-full p-2 mr-4">
                    <Users className="h-4 w-4 text-edu-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">User #{enrollment.userId} enrolled in {enrollment.course?.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(enrollment.enrolledDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Popular Courses</CardTitle>
            <CardDescription>Courses with highest enrollment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCourses
                .slice(0, 5)
                .sort((a, b) => (b.enrolledCount || 0) - (a.enrolledCount || 0))
                .map((course) => (
                  <div key={course.courseId} className="flex items-center">
                    <div className="bg-edu-primary/10 rounded-full p-2 mr-4">
                      <BookOpen className="h-4 w-4 text-edu-primary" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium">{course.title}</p>
                      <p className="text-xs text-gray-500">{course.enrolledCount} enrollments</p>
                    </div>
                    <BarChart3 className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
