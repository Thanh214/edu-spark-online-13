-- Bảng Users
CREATE TABLE `Users` (
  `user_id` INT(11) NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(50) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `role` ENUM('admin','user') NOT NULL DEFAULT 'user',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bảng Courses
CREATE TABLE `Courses` (
  `course_id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `thumbnail` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bảng Chapters
CREATE TABLE `Chapters` (
  `chapter_id` INT(11) NOT NULL AUTO_INCREMENT,
  `course_id` INT(11) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `chapter_order` INT(11) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`chapter_id`),
  INDEX idx_course_id (`course_id`),
  CONSTRAINT fk_chapter_course FOREIGN KEY (`course_id`) REFERENCES `Courses`(`course_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bảng Lessons
CREATE TABLE `Lessons` (
  `lesson_id` INT(11) NOT NULL AUTO_INCREMENT,
  `chapter_id` INT(11) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `content` TEXT DEFAULT NULL,
  `lesson_order` INT(11) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`lesson_id`),
  INDEX idx_chapter_id (`chapter_id`),
  CONSTRAINT fk_lesson_chapter FOREIGN KEY (`chapter_id`) REFERENCES `Chapters`(`chapter_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bảng Pages
CREATE TABLE `Pages` (
  `page_id` INT(11) NOT NULL AUTO_INCREMENT,
  `lesson_id` INT(11) NOT NULL,
  `page_number` INT(11) NOT NULL,
  `content` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`page_id`),
  INDEX idx_lesson_id (`lesson_id`),
  CONSTRAINT fk_page_lesson FOREIGN KEY (`lesson_id`) REFERENCES `Lessons`(`lesson_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bảng Documents (bổ sung)
CREATE TABLE `Documents` (
  `document_id` INT(11) NOT NULL AUTO_INCREMENT,
  `lesson_id` INT(11) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `uploaded_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`document_id`),
  INDEX idx_document_lesson (`lesson_id`),
  CONSTRAINT fk_document_lesson FOREIGN KEY (`lesson_id`) REFERENCES `Lessons`(`lesson_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bảng Enrollments
CREATE TABLE `Enrollments` (
  `enrollment_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `course_id` INT(11) NOT NULL,
  `current_lesson_id` INT(11) DEFAULT NULL,
  `progress_percent` DECIMAL(5,2) DEFAULT 0.00,
  `enrolled_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`enrollment_id`),
  INDEX idx_enrollment_user (`user_id`),
  INDEX idx_enrollment_course (`course_id`),
  INDEX idx_enrollment_lesson (`current_lesson_id`),
  CONSTRAINT fk_enrollment_user FOREIGN KEY (`user_id`) REFERENCES `Users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_enrollment_course FOREIGN KEY (`course_id`) REFERENCES `Courses`(`course_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_enrollment_lesson FOREIGN KEY (`current_lesson_id`) REFERENCES `Lessons`(`lesson_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bảng Exams
CREATE TABLE `Exams` (
  `exam_id` INT(11) NOT NULL AUTO_INCREMENT,
  `course_id` INT(11) DEFAULT NULL,
  `chapter_id` INT(11) DEFAULT NULL,
  `title` VARCHAR(200) DEFAULT NULL,
  `time_limit` INT(11) DEFAULT NULL, -- thời gian làm bài tính theo phút
  `total_questions` INT(11) DEFAULT NULL,
  `passing_score` DECIMAL(5,2) DEFAULT NULL,
  PRIMARY KEY (`exam_id`),
  INDEX idx_exam_course (`course_id`),
  INDEX idx_exam_chapter (`chapter_id`),
  CONSTRAINT fk_exam_course FOREIGN KEY (`course_id`) REFERENCES `Courses`(`course_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_exam_chapter FOREIGN KEY (`chapter_id`) REFERENCES `Chapters`(`chapter_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bảng Questions
CREATE TABLE `Questions` (
  `question_id` INT(11) NOT NULL AUTO_INCREMENT,
  `exam_id` INT(11) NOT NULL,
  `question_text` TEXT NOT NULL,
  `option_a` VARCHAR(255) NOT NULL,
  `option_b` VARCHAR(255) NOT NULL,
  `option_c` VARCHAR(255) NOT NULL,
  `option_d` VARCHAR(255) NOT NULL,
  `correct_answer` ENUM('A','B','C','D') NOT NULL,
  PRIMARY KEY (`question_id`),
  INDEX idx_question_exam (`exam_id`),
  CONSTRAINT fk_question_exam FOREIGN KEY (`exam_id`) REFERENCES `Exams`(`exam_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bảng Test_Scores
CREATE TABLE `Test_Scores` (
  `score_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `exam_id` INT(11) NOT NULL,
  `score` DECIMAL(5,2) NOT NULL,
  `attempt_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('pass','fail') NOT NULL,
  PRIMARY KEY (`score_id`),
  INDEX idx_score_user (`user_id`),
  INDEX idx_score_exam (`exam_id`),
  CONSTRAINT fk_score_user FOREIGN KEY (`user_id`) REFERENCES `Users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_score_exam FOREIGN KEY (`exam_id`) REFERENCES `Exams`(`exam_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci; 