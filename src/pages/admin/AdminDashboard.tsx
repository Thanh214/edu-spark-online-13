
import { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home, 
  BookOpen, 
  Layout,
  FileText,
  Users,
  LogOut,
  Menu,
  X
} from "lucide-react";
import AdminCourses from "./AdminCourses";
import AdminOverview from "./AdminOverview";

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex flex-col w-64 bg-edu-dark text-white">
        <div className="p-4 border-b border-edu-dark">
          <div className="flex items-center space-x-2">
            <span className="bg-edu-primary text-white font-bold p-2 rounded-md">ES</span>
            <span className="text-xl font-bold">Admin Panel</span>
          </div>
        </div>
        
        <nav className="flex-grow p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-4">Management</p>
          
          <div className="space-y-2">
            <Link 
              to="/admin" 
              className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-edu-primary/10"
            >
              <Home size={18} />
              <span>Overview</span>
            </Link>
            
            <Link 
              to="/admin/courses" 
              className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-edu-primary/10"
            >
              <BookOpen size={18} />
              <span>Courses</span>
            </Link>
            
            <Link 
              to="/admin/chapters" 
              className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-edu-primary/10"
            >
              <Layout size={18} />
              <span>Chapters</span>
            </Link>
            
            <Link 
              to="/admin/exams" 
              className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-edu-primary/10"
            >
              <FileText size={18} />
              <span>Exams</span>
            </Link>
            
            <Link 
              to="/admin/users" 
              className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-edu-primary/10"
            >
              <Users size={18} />
              <span>Users</span>
            </Link>
          </div>
        </nav>
        
        <div className="p-4 border-t border-edu-dark">
          <Button 
            variant="outline" 
            className="w-full justify-start text-white border-white/20 hover:bg-edu-primary/20 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Mobile Hamburger */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <Button 
          variant="outline" 
          size="icon"
          className="bg-white"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>
      
      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-black/50">
          <div className="fixed top-0 left-0 bottom-0 w-64 bg-edu-dark text-white">
            <div className="p-4 border-b border-edu-dark">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="bg-edu-primary text-white font-bold p-2 rounded-md">ES</span>
                  <span className="text-xl font-bold">Admin Panel</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-white hover:bg-edu-primary/20"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X size={20} />
                </Button>
              </div>
            </div>
            
            <nav className="flex-grow p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-4">Management</p>
              
              <div className="space-y-2">
                <Link 
                  to="/admin" 
                  className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-edu-primary/10"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Home size={18} />
                  <span>Overview</span>
                </Link>
                
                <Link 
                  to="/admin/courses" 
                  className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-edu-primary/10"
                  onClick={() => setSidebarOpen(false)}
                >
                  <BookOpen size={18} />
                  <span>Courses</span>
                </Link>
                
                <Link 
                  to="/admin/chapters" 
                  className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-edu-primary/10"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Layout size={18} />
                  <span>Chapters</span>
                </Link>
                
                <Link 
                  to="/admin/exams" 
                  className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-edu-primary/10"
                  onClick={() => setSidebarOpen(false)}
                >
                  <FileText size={18} />
                  <span>Exams</span>
                </Link>
                
                <Link 
                  to="/admin/users" 
                  className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-edu-primary/10"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Users size={18} />
                  <span>Users</span>
                </Link>
              </div>
            </nav>
            
            <div className="p-4 border-t border-edu-dark">
              <Button 
                variant="outline" 
                className="w-full justify-start text-white border-white/20 hover:bg-edu-primary/20 hover:text-white"
                onClick={handleLogout}
              >
                <LogOut size={18} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-grow">
        <div className="container mx-auto py-6 px-4">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/courses" element={<AdminCourses />} />
            <Route path="/chapters" element={<div>Chapters Management</div>} />
            <Route path="/exams" element={<div>Exams Management</div>} />
            <Route path="/users" element={<div>Users Management</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
