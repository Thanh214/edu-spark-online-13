
// User related types
export interface User {
  user_id: number;
  full_name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  created_at: Date;
  updated_at: Date;
}

export interface UserCreateDTO {
  full_name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface UserUpdateDTO {
  full_name?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'user';
}

export interface RegisterUserDTO {
  full_name: string;
  email: string;
  password: string;
}

// Course related types
export interface Course {
  course_id: number;
  title: string;
  description: string | null;
  thumbnail: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CourseCreateDTO {
  title: string;
  description?: string | null;
  thumbnail?: string | null;
}

export interface CourseUpdateDTO {
  title?: string;
  description?: string | null;
  thumbnail?: string | null;
}

// Chapter related types
export interface Chapter {
  chapter_id: number;
  course_id: number;
  title: string;
  description: string | null;
  chapter_order: number;
  created_at: Date;
}

export interface ChapterCreateDTO {
  course_id: number;
  title: string;
  description?: string | null;
  chapter_order: number;
}

export interface ChapterUpdateDTO {
  course_id?: number;
  title?: string;
  description?: string | null;
  chapter_order?: number;
}

// Lesson related types
export interface Lesson {
  lesson_id: number;
  chapter_id: number;
  title: string;
  content: string | null;
  lesson_order: number;
  created_at: Date;
}

export interface LessonCreateDTO {
  chapter_id: number;
  title: string;
  content?: string | null;
  lesson_order: number;
}

export interface LessonUpdateDTO {
  chapter_id?: number;
  title?: string;
  content?: string | null;
  lesson_order?: number;
}

// Page related types
export interface Page {
  page_id: number;
  lesson_id: number;
  page_number: number;
  content: string | null;
  created_at: Date;
}

export interface PageCreateDTO {
  lesson_id: number;
  page_number: number;
  content?: string | null;
}

export interface PageUpdateDTO {
  lesson_id?: number;
  page_number?: number;
  content?: string | null;
}

// Document related types
export interface Document {
  document_id: number;
  lesson_id: number;
  title: string;
  file_path: string;
  uploaded_at: Date;
}

export interface DocumentCreateDTO {
  lesson_id: number;
  title: string;
  file_path: string;
}

// Enrollment related types
export interface Enrollment {
  enrollment_id: number;
  user_id: number;
  course_id: number;
  current_lesson_id: number | null;
  progress_percent: number;
  enrolled_date: Date;
}

export interface EnrollmentCreateDTO {
  user_id: number;
  course_id: number;
  current_lesson_id?: number | null;
  progress_percent?: number;
}

export interface EnrollmentUpdateDTO {
  current_lesson_id?: number | null;
  progress_percent?: number;
}

export interface LessonProgressDTO {
  lesson_id: number;
  completed: boolean;
}
