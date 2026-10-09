-- ==========================================
-- 1. CREATE TABLES
-- ==========================================

CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT
);

CREATE TABLE enrolments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    UNIQUE(student_id, course_id) -- Prevents a student from enrolling in the same course twice
);

-- ==========================================
-- 2. INSERT SAMPLE DATA
-- ==========================================

-- Insert at least 3 students
INSERT INTO students (name, email) VALUES 
('Alice Smith', 'alice@example.com'),
('Bob Jones', 'bob@example.com'),
('Charlie Brown', 'charlie@example.com');

-- Insert at least 3 courses
INSERT INTO courses (title, description) VALUES 
('Mathematics 101', 'Introduction to Algebra and Calculus'),
('Computer Science 101', 'Basics of Programming in Python'),
('History 101', 'World History Overview');

-- Insert at least 5 enrolments
INSERT INTO enrolments (student_id, course_id, grade) VALUES 
(1, 1, 'A'),
(1, 2, 'B'),
(2, 2, 'A'),
(2, 3, 'C'),
(3, 1, 'B');

-- ==========================================
-- 3. REQUIRED QUERIES
-- ==========================================

-- Query 1: All courses for one student (by name)
SELECT c.title, c.description, e.grade 
FROM courses c
JOIN enrolments e ON c.id = e.course_id
JOIN students s ON s.id = e.student_id
WHERE s.name = 'Alice Smith';

-- Query 2: All students on one course
SELECT s.name, s.email, e.grade 
FROM students s
JOIN enrolments e ON s.id = e.student_id
JOIN courses c ON c.id = e.course_id
WHERE c.title = 'Computer Science 101';

-- Query 3: The number of students per course (using LEFT JOIN to include courses with 0 students)
SELECT c.title, COUNT(e.student_id) AS student_count
FROM courses c
LEFT JOIN enrolments e ON c.id = e.course_id
GROUP BY c.id;

-- Query 4: Students who have no enrolments
SELECT s.name, s.email 
FROM students s
LEFT JOIN enrolments e ON s.id = e.student_id
WHERE e.id IS NULL;

-- Query 5: Update of one enrolment's grade
UPDATE enrolments 
SET grade = 'A+' 
WHERE student_id = 1 AND course_id = 1;
