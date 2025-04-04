
import axios from 'axios';
import { Course, User, AuthResponse, Enrollment, Lesson, Chapter } from '@/types';

// Tạo instance axios với URL backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor để thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (full_name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', { full_name, email, password });
    return response.data;
  },
  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Courses API
export const coursesAPI = {
  getAllCourses: async (): Promise<Course[]> => {
    const response = await api.get('/courses');
    return response.data;
  },
  getCourseById: async (id: number): Promise<Course> => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },
  getCourseDetails: async (id: number): Promise<Course> => {
    const response = await api.get(`/courses/${id}/details`);
    return response.data;
  }
};

// Enrollments API
export const enrollmentsAPI = {
  getUserEnrollments: async (): Promise<Enrollment[]> => {
    const response = await api.get('/enrollments/me');
    return response.data;
  },
  enrollCourse: async (courseId: number): Promise<any> => {
    const response = await api.post('/enrollments', { course_id: courseId });
    return response.data;
  },
  updateProgress: async (enrollmentId: number, lessonId: number, progress: number): Promise<any> => {
    const response = await api.put(`/enrollments/${enrollmentId}`, { 
      current_lesson_id: lessonId,
      progress_percent: progress 
    });
    return response.data;
  }
};

// Hook để xử lý lỗi chung từ API
export const handleApiError = (error: any) => {
  if (error.response) {
    // Error response từ server
    return error.response.data.message || 'Đã có lỗi xảy ra từ server';
  } else if (error.request) {
    // Không nhận được response
    return 'Không thể kết nối đến server';
  } else {
    // Lỗi khi set up request
    return 'Đã có lỗi xảy ra, vui lòng thử lại';
  }
};

export default api;
