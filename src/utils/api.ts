import axios from 'axios';

// Cấu hình axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor để xử lý lỗi
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || { message: 'Lỗi kết nối đến server' });
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (fullName: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { full_name: fullName, email, password });
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Đăng ký thất bại');
      }
    } catch (error: any) {
      console.error('Register error:', error);
      throw error;
    }
  },
  
  getProfile: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data.data.user;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }
};

// Courses API
export const coursesAPI = {
  getAllCourses: async () => {
    const response = await api.get('/courses');
    return response.data.data;
  },
  
  getCourseById: async (courseId: number) => {
    const response = await api.get(`/courses/${courseId}`);
    return response.data.data;
  },
  
  getChapters: async (courseId: number) => {
    const response = await api.get(`/courses/${courseId}/chapters`);
    return response.data.data;
  },
  
  getLessons: async (chapterId: number) => {
    const response = await api.get(`/courses/chapters/${chapterId}/lessons`);
    return response.data.data;
  }
};

// Enrollments API
export const enrollmentsAPI = {
  enrollCourse: async (courseId: number) => {
    const response = await api.post('/enrollments', { course_id: courseId });
    return response.data.data;
  },
  
  getUserEnrollments: async () => {
    const response = await api.get('/enrollments/user');
    return response.data.data;
  },
  
  updateProgress: async (lessonId: number, completed: boolean) => {
    const response = await api.put(`/enrollments/progress`, { lesson_id: lessonId, completed });
    return response.data.data;
  }
};

export default api; 