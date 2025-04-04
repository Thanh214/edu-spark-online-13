import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../utils/api';
import { toast } from 'sonner';

interface User {
  userId: number;
  fullName: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (fullName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  useEffect(() => {
    // Check for saved authentication
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('eduUser');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      
      // Xác thực token bằng cách gọi API profile
      const verifyToken = async () => {
        try {
          const userData = await authAPI.getProfile();
          setUser({
            userId: userData.user_id,
            fullName: userData.full_name,
            email: userData.email,
            role: userData.role
          });
        } catch (error: any) {
          console.error('Token không hợp lệ:', error);
          // Hiển thị thông báo lỗi nếu cần
          if (error.message) {
            toast.error(error.message);
          }
          logout();
        } finally {
          setIsLoading(false);
        }
      };
      
      verifyToken();
    } else {
      setIsLoading(false);
    }
    
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await authAPI.login(email, password);
      
      const userData = {
        userId: response.user.user_id,
        fullName: response.user.full_name,
        email: response.user.email,
        role: response.user.role
      };
      
      setUser(userData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('eduUser', JSON.stringify(userData));
      toast.success('Đăng nhập thành công');
      return true;
    } catch (error: any) {
      console.error('Đăng nhập thất bại:', error);
      const errorMessage = error.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fullName: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await authAPI.register(fullName, email, password);
      
      const userData = {
        userId: response.user.user_id,
        fullName: response.user.full_name,
        email: response.user.email,
        role: response.user.role
      };
      
      setUser(userData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('eduUser', JSON.stringify(userData));
      toast.success('Đăng ký tài khoản thành công');
      return true;
    } catch (error: any) {
      console.error('Đăng ký thất bại:', error);
      const errorMessage = error.message || 'Không thể tạo tài khoản. Vui lòng thử lại.';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('eduUser');
    toast.info('Đã đăng xuất');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
