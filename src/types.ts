
export interface User {
  user_id: number;
  full_name: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface Course {
  course_id: number;
  title: string;
  description: string;
  thumbnail: string | null;
  created_at: string;
  updated_at: string;
  chapters?: Chapter[];
}

export interface Chapter {
  chapter_id: number;
  course_id: number;
  title: string;
  description: string | null;
  chapter_order: number;
  created_at: string;
  lessons?: Lesson[];
}

export interface Lesson {
  lesson_id: number;
  chapter_id: number;
  title: string;
  content: string | null;
  lesson_order: number;
  created_at: string;
  pages?: Page[];
  documents?: Document[];
}

export interface Page {
  page_id: number;
  lesson_id: number;
  page_number: number;
  content: string | null;
  created_at: string;
}

export interface Document {
  document_id: number;
  lesson_id: number;
  title: string;
  file_path: string;
  uploaded_at: string;
}

export interface Enrollment {
  enrollment_id: number;
  user_id: number;
  course_id: number;
  current_lesson_id: number | null;
  progress_percent: number;
  enrolled_date: string;
  course?: Course;
}

export interface Exam {
  exam_id: number;
  course_id: number | null;
  chapter_id: number | null;
  title: string | null;
  time_limit: number | null;
  total_questions: number | null;
  passing_score: number | null;
  questions?: Question[];
}

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

export interface TestScore {
  score_id: number;
  user_id: number;
  exam_id: number;
  score: number;
  attempt_date: string;
  status: 'pass' | 'fail';
}

export interface AuthResponse {
  token: string;
  user: User;
}
