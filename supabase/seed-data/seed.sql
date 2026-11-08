-- Seed Data for SkillBridge (CIH-008 Hackathon)
-- Run this in the Supabase SQL Editor after 001_initial_schema.sql

-- Mentors
INSERT INTO profiles (id, email, full_name, role, department, year, bio, is_verified, online_status) VALUES
('b0000000-0000-0000-0000-000000000001', 'sarah.mentor@campus.edu', 'Sarah Chen', 'mentor', 'Computer Science', '4th Year', 'Passionate about teaching web development and helping juniors build real-world projects.', true, 'available'),
('b0000000-0000-0000-0000-000000000002', 'rohit.gupta@campus.edu', 'Rohit Gupta', 'mentor', 'Computer Science', 'Alumni', 'ML engineer at FAANG company. Mentoring in Python and machine learning.', true, 'available'),
('b0000000-0000-0000-0000-000000000003', 'emily.davis@campus.edu', 'Emily Davis', 'mentor', 'Electronics Engineering', '4th Year', 'Specializing in embedded systems and IoT. 3x Hackathon winner.', true, 'busy'),
('b0000000-0000-0000-0000-000000000004', 'marcus.johnson@campus.edu', 'Marcus Johnson', 'mentor', 'Mathematics', 'Alumni', 'Math PhD candidate specializing in calculus and linear algebra.', true, 'offline'),
('b0000000-0000-0000-0000-000000000005', 'priya.sharma@campus.edu', 'Priya Sharma', 'mentor', 'Computer Science', '3rd Year', 'Competitive programmer with 1800+ rating on Codeforces.', true, 'available');

-- Mentees
INSERT INTO profiles (id, email, full_name, role, department, year, bio, is_verified, online_status) VALUES
('a0000000-0000-0000-0000-000000000001', 'alex.student@campus.edu', 'Alex Turner', 'mentee', 'Computer Science', '2nd Year', 'Aspiring software engineer learning React and Data Structures.', true, 'available'),
('a0000000-0000-0000-0000-000000000002', 'jessica.li@campus.edu', 'Jessica Li', 'mentee', 'Information Technology', '1st Year', 'First-year student learning web fundamentals.', true, 'available'),
('a0000000-0000-0000-0000-000000000003', 'omar.hassan@campus.edu', 'Omar Hassan', 'mentee', 'Electronics Engineering', '2nd Year', 'ECE student studying digital circuits.', true, 'busy');

-- Admin
INSERT INTO profiles (id, email, full_name, role, department, year, bio, is_verified, online_status) VALUES
('c0000000-0000-0000-0000-000000000001', 'admin@campus.edu', 'Admin Officer', 'admin', 'Administration', 'Staff', 'Platform supervisor and campus safety officer.', true, 'available');

-- Expertise
INSERT INTO mentor_expertise (mentor_id, topic, category, proficiency_level, description, years_of_experience) VALUES
('b0000000-0000-0000-0000-000000000001', 'ReactJS', 'technical', 5, 'Modern React with hooks and state management', 3),
('b0000000-0000-0000-0000-000000000001', 'Web Development', 'technical', 5, 'Full-stack development with Node.js and SQL', 3),
('b0000000-0000-0000-0000-000000000002', 'Python', 'technical', 5, 'Python for AI, data science, and scripting', 5),
('b0000000-0000-0000-0000-000000000002', 'Machine Learning', 'technical', 5, 'Supervised learning, deep learning, PyTorch', 4),
('b0000000-0000-0000-0000-000000000003', 'Embedded Systems', 'technical', 5, 'ARM microcontrollers and RTOS development', 3),
('b0000000-0000-0000-0000-000000000004', 'Engineering Mathematics', 'academic', 5, 'Differential equations and Fourier transforms', 6),
('b0000000-0000-0000-0000-000000000005', 'Data Structures', 'academic', 5, 'Trees, graphs, dynamic programming', 3);
