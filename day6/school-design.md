# School Database Design Document

## Table Explanations
* **`students`**: Stores personal details for each student, including their unique auto-incrementing ID, full name, and a unique email address used for identification.
* **`courses`**: Stores information about the subjects or classes offered by the school, including a unique course ID, title, and course description.
* **`enrolments`**: Acts as the junction (join) table linking students to courses. It tracks which student is registered in which course and stores the grade achieved for that specific enrolment.

## Relationships and Join Tables
* **Relationship Type**: The relationship between `students` and `courses` is **many-to-many**. A single student can enrol in multiple courses, and a single course can have multiple students.
* **Why a Join Table is Needed**: Relational databases cannot directly represent a many-to-many relationship inside a single table structure without data duplication. To resolve this, the `enrolments` join table breaks the many-to-many relationship down into two one-to-many relationships: one from `students` to `enrolments`, and one from `courses` to `enrolments`. It also safely stores relationship-specific attributes, such as the `grade`.

## Database Index
* **Index**: `CREATE INDEX idx_students_name ON students(name);`
* **Reason**: Creating an index on the `students.name` column speeds up search operations when querying enrolments or looking up student profiles by name, particularly as the size of the student body scales up.

## SQL vs. NoSQL Choice
For a school database managing students, courses, and structured academic grades, **SQL** is the optimal choice. Relational databases enforce strict schemas, referential integrity (via foreign keys), and ACID compliance, which are critical for ensuring that enrolments link properly to valid students and courses and that academic records remain consistent. NoSQL databases are better suited for unstructured data or rapid, fluid scaling without rigid schemas, which does not align well with the relational and transactional requirements of a school management system.
