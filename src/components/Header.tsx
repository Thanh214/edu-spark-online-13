
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="bg-edu-primary text-white font-bold p-2 rounded-md">ES</span>
          <span className="text-xl font-bold text-edu-dark">EduSpark</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-edu-dark hover:text-edu-primary transition-colors">
            Trang Chủ
          </Link>
          <Link to="/courses" className="text-edu-dark hover:text-edu-primary transition-colors">
            Khóa Học
          </Link>
          <Link to="/team" className="text-edu-dark hover:text-edu-primary transition-colors">
            Đội Ngũ
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard" className="text-edu-dark hover:text-edu-primary transition-colors">
              Bảng Điều Khiển
            </Link>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin" className="text-edu-dark hover:text-edu-primary transition-colors">
              Quản Trị
            </Link>
          )}
        </nav>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm font-medium text-edu-dark">
                {user?.fullName}
              </span>
              <Button variant="outline" onClick={logout}>
                Đăng Xuất
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Đăng Nhập</Button>
              </Link>
              <Link to="/register">
                <Button>Đăng Ký</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-edu-dark"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden py-4 bg-white border-t">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            <Link 
              to="/" 
              className="text-edu-dark hover:text-edu-primary py-2 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Trang Chủ
            </Link>
            <Link 
              to="/courses" 
              className="text-edu-dark hover:text-edu-primary py-2 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Khóa Học
            </Link>
            <Link 
              to="/team" 
              className="text-edu-dark hover:text-edu-primary py-2 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Đội Ngũ
            </Link>
            {isAuthenticated && (
              <Link 
                to="/dashboard" 
                className="text-edu-dark hover:text-edu-primary py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Bảng Điều Khiển
              </Link>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className="text-edu-dark hover:text-edu-primary py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Quản Trị
              </Link>
            )}
            
            {isAuthenticated ? (
              <Button variant="outline" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                Đăng Xuất
              </Button>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Đăng Nhập</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Đăng Ký</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
