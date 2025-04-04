
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md py-4 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-brand-blue to-brand-indigo bg-clip-text text-transparent">
                EduSpark
              </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-brand-blue">Trang chủ</Link>
            <Link to="/courses" className="text-gray-700 hover:text-brand-blue">Khóa học</Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-gray-700 hover:text-brand-blue">
                  Bảng điều khiển
                </Link>
                <div className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-brand-blue">
                    <span className="mr-1">{user?.full_name}</span>
                    <User size={18} />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                      Hồ sơ
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                        Quản trị
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline">Đăng nhập</Button>
                </Link>
                <Link to="/register">
                  <Button variant="gradient">Đăng ký</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-500 focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="mt-4 md:hidden">
            <div className="flex flex-col space-y-4 pb-4">
              <Link to="/" className="text-gray-700" onClick={toggleMenu}>Trang chủ</Link>
              <Link to="/courses" className="text-gray-700" onClick={toggleMenu}>Khóa học</Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-gray-700" onClick={toggleMenu}>
                    Bảng điều khiển
                  </Link>
                  <Link to="/profile" className="text-gray-700" onClick={toggleMenu}>
                    Hồ sơ
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="text-gray-700" onClick={toggleMenu}>
                      Quản trị
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                    className="text-left text-gray-700 flex items-center"
                  >
                    <LogOut size={16} className="mr-2" />
                    Đăng xuất
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/login" onClick={toggleMenu}>
                    <Button variant="outline" className="w-full">Đăng nhập</Button>
                  </Link>
                  <Link to="/register" onClick={toggleMenu}>
                    <Button variant="gradient" className="w-full">Đăng ký</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
