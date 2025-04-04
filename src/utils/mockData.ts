
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

// Mock Courses
export const mockCourses: Course[] = [
  {
    courseId: 1,
    title: "Introduction to Web Development",
    description: "Learn the basics of HTML, CSS, and JavaScript to build modern websites.",
    thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    createdAt: "2023-01-15T12:00:00Z",
    updatedAt: "2023-01-15T12:00:00Z",
    chaptersCount: 5,
    lessonsCount: 24,
    enrolledCount: 1245
  },
  {
    courseId: 2,
    title: "Data Science Fundamentals",
    description: "Master the essentials of data analysis, visualization, and machine learning algorithms.",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    createdAt: "2023-02-20T14:30:00Z",
    updatedAt: "2023-02-25T09:15:00Z",
    chaptersCount: 8,
    lessonsCount: 32,
    enrolledCount: 987
  },
  {
    courseId: 3,
    title: "Advanced React Programming",
    description: "Take your React skills to the next level with hooks, context API, and performance optimization.",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    createdAt: "2023-03-10T10:00:00Z",
    updatedAt: "2023-03-15T16:45:00Z",
    chaptersCount: 6,
    lessonsCount: 28,
    enrolledCount: 756
  },
  {
    courseId: 4,
    title: "Cloud Computing with AWS",
    description: "Learn how to design, deploy, and manage applications on the Amazon Web Services platform.",
    thumbnail: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    createdAt: "2023-04-05T08:20:00Z",
    updatedAt: "2023-04-10T11:30:00Z",
    chaptersCount: 7,
    lessonsCount: 35,
    enrolledCount: 543
  },
  {
    courseId: 5,
    title: "Mobile App Development with Flutter",
    description: "Build beautiful cross-platform mobile applications with Google's Flutter framework.",
    thumbnail: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    createdAt: "2023-05-12T13:45:00Z",
    updatedAt: "2023-05-18T09:10:00Z",
    chaptersCount: 9,
    lessonsCount: 42,
    enrolledCount: 1032
  },
  {
    courseId: 6,
    title: "Cybersecurity Essentials",
    description: "Learn to protect systems, networks, and programs from digital attacks.",
    thumbnail: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    createdAt: "2023-06-08T15:30:00Z",
    updatedAt: "2023-06-15T10:20:00Z",
    chaptersCount: 6,
    lessonsCount: 30,
    enrolledCount: 876
  }
];

// Mock Chapters and Lessons for Course 1
export const mockChaptersForCourse1: Chapter[] = [
  {
    chapterId: 1,
    courseId: 1,
    title: "HTML Fundamentals",
    description: "Learn the building blocks of web pages",
    chapterOrder: 1,
    createdAt: "2023-01-15T12:00:00Z",
    lessons: [
      {
        lessonId: 1,
        chapterId: 1,
        title: "Introduction to HTML",
        content: "HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser.",
        lessonOrder: 1,
        createdAt: "2023-01-15T12:00:00Z",
        pages: [
          {
            pageId: 1,
            lessonId: 1,
            pageNumber: 1,
            content: "<h1>Introduction to HTML</h1><p>HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser. It defines the meaning and structure of web content.</p><p>HTML consists of a series of elements, which you use to enclose different parts of the content to make it appear a certain way or act in a certain way.</p>",
            createdAt: "2023-01-15T12:00:00Z"
          },
          {
            pageId: 2,
            lessonId: 1,
            pageNumber: 2,
            content: "<h2>Basic HTML Structure</h2><pre><code>&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n&lt;head&gt;\n  &lt;title&gt;Page Title&lt;/title&gt;\n&lt;/head&gt;\n&lt;body&gt;\n  &lt;h1&gt;My First Heading&lt;/h1&gt;\n  &lt;p&gt;My first paragraph.&lt;/p&gt;\n&lt;/body&gt;\n&lt;/html&gt;</code></pre>",
            createdAt: "2023-01-15T12:00:00Z"
          }
        ]
      },
      {
        lessonId: 2,
        chapterId: 1,
        title: "HTML Elements",
        content: "Learn about different HTML elements and their usage",
        lessonOrder: 2,
        createdAt: "2023-01-15T12:00:00Z"
      }
    ]
  },
  {
    chapterId: 2,
    courseId: 1,
    title: "CSS Styling",
    description: "Learn how to style your web pages",
    chapterOrder: 2,
    createdAt: "2023-01-15T12:00:00Z",
    lessons: [
      {
        lessonId: 3,
        chapterId: 2,
        title: "CSS Basics",
        content: "Learn the basics of CSS styling",
        lessonOrder: 1,
        createdAt: "2023-01-15T12:00:00Z"
      },
      {
        lessonId: 4,
        chapterId: 2,
        title: "CSS Layouts",
        content: "Learn about different CSS layout techniques",
        lessonOrder: 2,
        createdAt: "2023-01-15T12:00:00Z"
      }
    ]
  }
];

// Mock Exams
export const mockExams: Exam[] = [
  {
    examId: 1,
    courseId: 1,
    chapterId: null,
    title: "Web Development Fundamentals Exam",
    timeLimit: 60,
    totalQuestions: 20,
    passingScore: 70,
    questions: [
      {
        questionId: 1,
        examId: 1,
        questionText: "What does HTML stand for?",
        optionA: "Hyper Text Markup Language",
        optionB: "High Tech Multi Language",
        optionC: "Hyper Transfer Markup Language",
        optionD: "Hybrid Text Manipulation Language",
        correctAnswer: "A"
      },
      {
        questionId: 2,
        examId: 1,
        questionText: "Which HTML tag is used to create a hyperlink?",
        optionA: "<link>",
        optionB: "<a>",
        optionC: "<href>",
        optionD: "<navigate>",
        correctAnswer: "B"
      }
    ]
  }
];

// Mock Enrollments
export const mockEnrollments: Enrollment[] = [
  {
    enrollmentId: 1,
    userId: 1,
    courseId: 1,
    currentLessonId: 2,
    progressPercent: 25.5,
    enrolledDate: "2023-02-10T14:30:00Z",
    course: mockCourses[0]
  },
  {
    enrollmentId: 2,
    userId: 1,
    courseId: 3,
    currentLessonId: 10,
    progressPercent: 45.0,
    enrolledDate: "2023-03-15T09:45:00Z",
    course: mockCourses[2]
  }
];

// Helper functions to get mock data
export const getCourseById = (courseId: number): Course | undefined => {
  return mockCourses.find(course => course.courseId === courseId);
};

export const getChaptersByCourseId = (courseId: number): Chapter[] => {
  if (courseId === 1) return mockChaptersForCourse1;
  return [];
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
