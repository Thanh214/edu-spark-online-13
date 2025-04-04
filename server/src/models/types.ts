// User interfaces
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

// Course interfaces
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
  description?: string;
  thumbnail?: string;
}

export interface CourseUpdateDTO {
  title?: string;
  description?: string;
  thumbnail?: string;
}

// Chapter interfaces
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
  description?: string;
  chapter_order: number;
}

export interface ChapterUpdateDTO {
  title?: string;
  description?: string;
  chapter_order?: number;
}

// Lesson interfaces
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
  content?: string;
  lesson_order: number;
}

export interface LessonUpdateDTO {
  title?: string;
  content?: string;
  lesson_order?: number;
}

// Page interfaces
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
  content?: string;
}

export interface PageUpdateDTO {
  page_number?: number;
  content?: string;
}

// Document interfaces
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

export interface DocumentUpdateDTO {
  title?: string;
  file_path?: string;
}

// Enrollment interfaces
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
  current_lesson_id?: number;
  progress_percent?: number;
}

export interface EnrollmentUpdateDTO {
  current_lesson_id?: number;
  progress_percent?: number;
}

// Exam interfaces
export interface Exam {
  exam_id: number;
  course_id: number | null;
  chapter_id: number | null;
  title: string | null;
  time_limit: number | null;
  total_questions: number | null;
  passing_score: number | null;
}

export interface ExamCreateDTO {
  course_id?: number;
  chapter_id?: number;
  title?: string;
  time_limit?: number;
  total_questions?: number;
  passing_score?: number;
}

export interface ExamUpdateDTO {
  title?: string;
  time_limit?: number;
  total_questions?: number;
  passing_score?: number;
}

// Question interfaces
export interface Question {
  question_id: number;
  exam_id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
}

export interface QuestionCreateDTO {
  exam_id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
}

export interface QuestionUpdateDTO {
  question_text?: string;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  correct_answer?: 'A' | 'B' | 'C' | 'D';
}

// TestScore interfaces
export interface TestScore {
  score_id: number;
  user_id: number;
  exam_id: number;
  score: number;
  attempt_date: Date;
  status: 'pass' | 'fail';
}

export interface TestScoreCreateDTO {
  user_id: number;
  exam_id: number;
  score: number;
  status: 'pass' | 'fail';
}

export interface TestScoreUpdateDTO {
  score?: number;
  status?: 'pass' | 'fail';
} 