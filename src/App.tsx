
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Courses from '@/pages/Courses';
import CourseDetails from '@/pages/CourseDetails';
import Dashboard from '@/pages/Dashboard';
import LessonPlayer from '@/pages/LessonPlayer';
import Profile from '@/pages/Profile';

// Components
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes - Accessible when logged in */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes - Require Authentication */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/learn/:courseId" element={<LessonPlayer />} />
            <Route path="/learn/:courseId/:lessonId" element={<LessonPlayer />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<div>Admin Dashboard (Trang Admin sẽ được phát triển sau)</div>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
