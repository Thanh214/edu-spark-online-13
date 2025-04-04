export interface Course {
  courseId: number;
  title: string;
  description: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  chaptersCount?: number;
  lessonsCount?: number;
  enrolledCount?: number;
}

export interface Chapter {
  chapterId: number;
  courseId: number;
  title: string;
  description: string;
  chapterOrder: number;
  createdAt: string;
  lessons: Lesson[];
}

export interface Lesson {
  lessonId: number;
  chapterId: number;
  title: string;
  content: string;
  lessonOrder: number;
  createdAt: string;
  pages?: Page[];
  documents?: Document[];
}

export interface Page {
  pageId: number;
  lessonId: number;
  pageNumber: number;
  content: string;
  createdAt: string;
}

export interface Document {
  documentId: number;
  lessonId: number;
  title: string;
  filePath: string;
  uploadedAt: string;
}

export interface Exam {
  examId: number;
  courseId: number | null;
  chapterId: number | null;
  title: string;
  timeLimit: number;
  totalQuestions: number;
  passingScore: number;
  questions?: Question[];
}

export interface Question {
  questionId: number;
  examId: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

export interface Enrollment {
  enrollmentId: number;
  userId: number;
  courseId: number;
  currentLessonId: number | null;
  progressPercent: number;
  enrolledDate: string;
  course?: Course;
}

export interface TestScore {
  scoreId: number;
  userId: number;
  examId: number;
  score: number;
  attemptDate: string;
  status: 'pass' | 'fail';
  exam?: Exam;
}

// Mock Courses - empty array
export const mockCourses: Course[] = [];

// Mock Chapters - empty array
export const mockChaptersForCourse1: Chapter[] = [];

// Mock Exams - empty array
export const mockExams: Exam[] = [];

// Mock Enrollments - empty array
export const mockEnrollments: Enrollment[] = [];

// Mock Test Scores - empty array 
export const mockTestScores: TestScore[] = [];

// Helper functions to get mock data
export const getCourseById = (courseId: number): Course | undefined => {
  return mockCourses.find(course => course.courseId === courseId);
};

export const getChaptersByCourseId = (courseId: number): Chapter[] => {
  return mockChaptersForCourse1.filter(chapter => chapter.courseId === courseId);
};

export const getLessonById = (lessonId: number): Lesson | undefined => {
  for (const chapter of mockChaptersForCourse1) {
    const lesson = chapter.lessons.find(lesson => lesson.lessonId === lessonId);
    if (lesson) return lesson;
  }
  return undefined;
};

export const getEnrollmentsByUserId = (userId: number): Enrollment[] => {
  return mockEnrollments.filter(enrollment => enrollment.userId === userId);
};

export const getExamById = (examId: number): Exam | undefined => {
  return mockExams.find(exam => exam.examId === examId);
};
