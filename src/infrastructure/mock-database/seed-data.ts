import { User, MentorExpertise, TimeSlot, TutoringSession, Conversation, Message, SessionReview, Notification, Post, CommunityItem, SkillItem, Connection, Project, ProjectApplication } from '../../foundation/types';

// ============================================================
// USERS — 12 mentors + 8 mentees + 1 admin = 21
// ============================================================

export const mockUsers: User[] = [
  // ── MENTORS ────────────────────────────────────────────────
  {
    id: 'mentor-1', email: 'sarah.mentor@campus.edu', fullName: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', role: 'mentor', department: 'Computer Science', year: '4th Year',
    headline: 'Senior CS Student & Distributed Systems Lead | Python & ML Practitioner',
    university: 'State Technological University',
    bio: 'Passionate about distributed algorithms, consensus mechanisms, and Python data pipelines. Looking to exchange Python/ML knowledge for modern ReactJS and frontend architecture.',
    joinedAt: '2025-08-15T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['visual', 'kinesthetic'], languages: ['English', 'Mandarin'],
    onlineStatus: 'available', portfolioUrl: 'https://sarahjenkins.dev', githubUrl: 'https://github.com/sarahjenkins', linkedinUrl: 'https://linkedin.com/in/sarahjenkins',
    availableDays: ['monday', 'wednesday', 'thursday'],
    skillsOffered: [
      { id: 'so-b1', userId: 'mentor-1', skillName: 'Python', proficiency: 'advanced', intention: 'teach', yearsOfExperience: 3, preferredFormat: '1-on-1' },
      { id: 'so-b2', userId: 'mentor-1', skillName: 'Machine Learning', proficiency: 'intermediate', intention: 'teach', yearsOfExperience: 2, preferredFormat: 'project-collab' },
      { id: 'so-b3', userId: 'mentor-1', skillName: 'Distributed Systems', proficiency: 'advanced', intention: 'teach', yearsOfExperience: 3, preferredFormat: '1-on-1' },
    ],
    skillsWanted: [
      { id: 'sw-b1', userId: 'mentor-1', skillName: 'ReactJS', proficiency: 'beginner', intention: 'learn', preferredFormat: 'pair-programming', targetGoal: 'Full-stack UI for ML models' },
      { id: 'sw-b2', userId: 'mentor-1', skillName: 'TypeScript', proficiency: 'beginner', intention: 'learn', preferredFormat: '1-on-1', targetGoal: 'Type safety and frontend components' },
    ],
    badges: [
      { id: 'b-1', name: 'Knowledge Sharer', description: 'Conducted 15+ verified peer tutoring sessions', icon: 'BookOpen', tier: 'Gold', dateEarned: '2025-11-10' },
      { id: 'b-2', name: 'Reliable Collaborator', description: '100% scheduled session attendance record', icon: 'ShieldCheck', tier: 'Gold', dateEarned: '2026-01-14' },
      { id: 'b-3', name: 'Community Contributor', description: 'Active contributor to ACM Campus chapter', icon: 'Users', tier: 'Silver', dateEarned: '2026-02-01' },
    ],
  },
  {
    id: 'mentor-2', email: 'rajesh.kumar@campus.edu', fullName: 'Rajesh Kumar',
    avatar: '', role: 'mentor', department: 'Computer Science', year: 'Alumni',
    headline: 'Machine Learning Engineer @ FAANG | Deep Learning Researcher',
    university: 'State Technological University',
    bio: 'ML engineer at a FAANG company. Love giving back by mentoring students in machine learning and Python. Published 3 research papers on deep learning.',
    joinedAt: '2025-06-10T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['reading', 'visual'], languages: ['English', 'Hindi'],
    onlineStatus: 'available', githubUrl: 'https://github.com/rajeshkumar', linkedinUrl: 'https://linkedin.com/in/rajeshkumar',
  },
  {
    id: 'mentor-3', email: 'marcus.iot@campus.edu', fullName: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', role: 'mentor', department: 'Electronics Engineering', year: '4th Year',
    headline: 'Embedded Systems & IoT Hardware Lead | Building AgriPulse IoT',
    university: 'State Technological University',
    bio: 'Electronics enthusiast specializing in ESP32 firmware, sensor telemetry, and hardware prototyping. Leading the AgriPulse Smart Agriculture campus project.',
    joinedAt: '2025-09-01T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['kinesthetic', 'visual'], languages: ['English'],
    onlineStatus: 'available', portfolioUrl: 'https://marcusvance.tech', githubUrl: 'https://github.com/marcusvance', linkedinUrl: 'https://linkedin.com/in/marcusvance',
    availableDays: ['tuesday', 'thursday', 'saturday'],
    skillsOffered: [
      { id: 'so-c1', userId: 'mentor-3', skillName: 'Embedded C', proficiency: 'expert', intention: 'teach', yearsOfExperience: 3, preferredFormat: 'project-collab' },
      { id: 'so-c2', userId: 'mentor-3', skillName: 'ESP32', proficiency: 'expert', intention: 'teach', yearsOfExperience: 3, preferredFormat: 'project-collab' },
      { id: 'so-c3', userId: 'mentor-3', skillName: 'IoT Circuit Design', proficiency: 'advanced', intention: 'teach', yearsOfExperience: 2, preferredFormat: '1-on-1' },
    ],
    skillsWanted: [
      { id: 'sw-c1', userId: 'mentor-3', skillName: 'Machine Learning', proficiency: 'beginner', intention: 'learn', preferredFormat: 'project-collab', targetGoal: 'Predictive soil moisture and yield forecasting' },
      { id: 'sw-c2', userId: 'mentor-3', skillName: 'ReactJS', proficiency: 'beginner', intention: 'learn', preferredFormat: 'project-collab', targetGoal: 'Live web telemetry dashboard for greenhouse' },
    ],
    badges: [
      { id: 'b-4', name: 'Project Builder', description: 'Creator and lead of AgriPulse Smart Ag project', icon: 'Hammer', tier: 'Gold', dateEarned: '2025-12-01' },
      { id: 'b-5', name: 'Knowledge Sharer', description: 'Conducted microcontrollers workshops', icon: 'BookOpen', tier: 'Silver', dateEarned: '2026-02-15' },
    ],
  },
  {
    id: 'mentor-4', email: 'marcus.johnson@campus.edu', fullName: 'Marcus Johnson',
    avatar: '', role: 'mentor', department: 'Mathematics', year: 'Alumni',
    headline: 'Mathematics PhD Candidate | Calculus & Linear Algebra Mentor',
    university: 'State Technological University',
    bio: 'Math PhD candidate who believes every student can master calculus and linear algebra with the right approach. Patient, methodical teaching style.',
    joinedAt: '2025-05-20T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['reading', 'auditory'], languages: ['English', 'Spanish'],
    onlineStatus: 'offline',
  },
  {
    id: 'mentor-5', email: 'priya.sharma@campus.edu', fullName: 'Priya Sharma',
    avatar: '', role: 'mentor', department: 'Computer Science', year: '3rd Year',
    headline: 'Competitive Programmer (Candidate Master on Codeforces) | SDE Prep',
    university: 'State Technological University',
    bio: 'Competitive programmer with 1800+ rating on Codeforces. Specialize in data structures and algorithms. Available for interview prep sessions.',
    joinedAt: '2025-10-05T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['kinesthetic', 'reading'], languages: ['English', 'Hindi'],
    onlineStatus: 'available',
  },
  {
    id: 'mentor-6', email: 'james.wilson@campus.edu', fullName: 'James Wilson',
    avatar: '', role: 'mentor', department: 'Information Technology', year: '4th Year',
    headline: 'Cloud & DevOps Practitioner | AWS Certified Solutions Architect',
    university: 'State Technological University',
    bio: 'DevOps and cloud computing enthusiast. AWS certified. Enjoy teaching networking, operating systems, and deployment pipelines.',
    joinedAt: '2025-07-15T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['visual', 'auditory'], languages: ['English'],
    onlineStatus: 'available',
  },
  {
    id: 'mentor-7', email: 'aisha.mohammed@campus.edu', fullName: 'Aisha Mohammed',
    avatar: '', role: 'mentor', department: 'Computer Science', year: '4th Year',
    headline: 'Java & Spring Boot Engineer | Microservices & Distributed Systems',
    university: 'State Technological University',
    bio: 'Java and enterprise software development specialist. Contributed to open-source Spring Boot projects. Passionate about clean code and software architecture.',
    joinedAt: '2025-08-20T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['reading', 'kinesthetic'], languages: ['English', 'French'],
    onlineStatus: 'available',
  },
  {
    id: 'mentor-8', email: 'carlos.rodriguez@campus.edu', fullName: 'Carlos Rodriguez',
    avatar: '', role: 'mentor', department: 'Electrical Engineering', year: '3rd Year',
    headline: 'Digital Electronics TA | Verilog & Circuit Design',
    university: 'State Technological University',
    bio: 'Circuit design and signal processing whiz. Teaching assistant for Digital Electronics for 2 semesters. Great at visual explanations.',
    joinedAt: '2025-09-15T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['visual', 'kinesthetic'], languages: ['English', 'Spanish'],
    onlineStatus: 'busy',
  },
  {
    id: 'mentor-9', email: 'nina.patel@campus.edu', fullName: 'Nina Patel',
    avatar: '', role: 'mentor', department: 'Computer Science', year: 'Alumni',
    headline: 'Senior Frontend Engineer @ FinTech | React & TypeScript Consultant',
    university: 'State Technological University',
    bio: 'Senior developer at a fintech startup. Expert in TypeScript, React, and Node.js. Passionate about modern web development and best practices.',
    joinedAt: '2025-04-10T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['visual', 'reading'], languages: ['English', 'Hindi'],
    onlineStatus: 'available',
  },
  {
    id: 'mentor-10', email: 'david.lee@campus.edu', fullName: 'David Lee',
    avatar: '', role: 'mentor', department: 'Mechanical Engineering', year: '4th Year',
    headline: 'Thermal Sciences & CFD Researcher | Engineering Physics Tutor',
    university: 'State Technological University',
    bio: 'Top student in thermodynamics and fluid mechanics. Enjoy making complex physics concepts accessible through practical examples and simulations.',
    joinedAt: '2025-08-01T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['auditory', 'kinesthetic'], languages: ['English', 'Mandarin'],
    onlineStatus: 'offline',
  },
  {
    id: 'mentor-11', email: 'sophia.garcia@campus.edu', fullName: 'Sophia Garcia',
    avatar: '', role: 'mentor', department: 'Computer Science', year: '3rd Year',
    headline: 'Full-Stack Developer & Workshop Lead | Women in Tech Chapter',
    university: 'State Technological University',
    bio: 'Full-stack web developer focused on modern JavaScript frameworks. Love creating interactive tutorials and coding workshops for beginners.',
    joinedAt: '2025-10-01T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['visual', 'kinesthetic'], languages: ['English', 'Spanish'],
    onlineStatus: 'available',
  },
  {
    id: 'mentor-12', email: 'kevin.brown@campus.edu', fullName: 'Kevin Brown',
    avatar: '', role: 'mentor', department: 'Information Technology', year: '4th Year',
    headline: 'Database Systems & SQL Optimization Specialist | Backend Dev',
    university: 'State Technological University',
    bio: 'Database and backend specialist. Expert in SQL, PostgreSQL, and system design. Great at breaking down complex architectures into understandable parts.',
    joinedAt: '2025-07-01T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['reading', 'auditory'], languages: ['English'],
    onlineStatus: 'available',
  },

  // ── MENTEES ────────────────────────────────────────────────
  {
    id: 'mentee-1', email: 'alex.student@campus.edu', fullName: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200', role: 'mentee', department: 'Computer Science', year: '3rd Year',
    headline: 'Full-Stack Developer & ReactJS Specialist | Seeking Python & Machine Learning Exchange',
    university: 'State Technological University',
    bio: 'Junior CS student passionate about frontend design systems, state management, and real-time collaborative apps. Want to exchange my ReactJS and TypeScript knowledge for Python and Machine Learning mentorship.',
    joinedAt: '2026-01-15T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['visual', 'kinesthetic'], languages: ['English'],
    onlineStatus: 'available', portfolioUrl: 'https://alexchen.dev', githubUrl: 'https://github.com/alexchen', linkedinUrl: 'https://linkedin.com/in/alexchen-campus',
    availableDays: ['monday', 'wednesday', 'friday'],
    skillsOffered: [
      { id: 'so-a1', userId: 'mentee-1', skillName: 'ReactJS', proficiency: 'advanced', intention: 'teach', yearsOfExperience: 2, preferredFormat: 'pair-programming' },
      { id: 'so-a2', userId: 'mentee-1', skillName: 'TypeScript', proficiency: 'advanced', intention: 'teach', yearsOfExperience: 2, preferredFormat: '1-on-1' },
      { id: 'so-a3', userId: 'mentee-1', skillName: 'Tailwind CSS', proficiency: 'expert', intention: 'teach', yearsOfExperience: 2, preferredFormat: 'pair-programming' },
    ],
    skillsWanted: [
      { id: 'sw-a1', userId: 'mentee-1', skillName: 'Python', proficiency: 'beginner', intention: 'learn', preferredFormat: '1-on-1', targetGoal: 'Backend data structures & PyTorch fundamentals' },
      { id: 'sw-a2', userId: 'mentee-1', skillName: 'Machine Learning', proficiency: 'beginner', intention: 'learn', preferredFormat: 'project-collab', targetGoal: 'Model training and fine-tuning' },
    ],
    badges: [
      { id: 'b-6', name: 'Knowledge Sharer', description: 'Taught 10+ peers frontend component architecture', icon: 'BookOpen', tier: 'Gold', dateEarned: '2026-02-10' },
      { id: 'b-7', name: 'Fast Learner', description: 'Completed 6 intensive peer learning cycles', icon: 'Zap', tier: 'Silver', dateEarned: '2026-03-01' },
      { id: 'b-8', name: 'Project Builder', description: 'Published 2 collaborative open source apps', icon: 'Hammer', tier: 'Gold', dateEarned: '2026-03-15' },
    ],
  },
  {
    id: 'mentee-2', email: 'jessica.li@campus.edu', fullName: 'Jessica Li',
    avatar: '', role: 'mentee', department: 'Information Technology', year: '1st Year',
    headline: 'Freshman IT Student | Exploring Web Development & Design',
    university: 'State Technological University',
    bio: 'First-year IT student eager to learn programming fundamentals and web development. Looking for patient mentors to guide my learning journey.',
    joinedAt: '2026-02-10T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['visual', 'auditory'], languages: ['English', 'Mandarin'],
    onlineStatus: 'available',
  },
  {
    id: 'mentee-3', email: 'omar.hassan@campus.edu', fullName: 'Omar Hassan',
    avatar: '', role: 'mentee', department: 'Electronics Engineering', year: '2nd Year',
    headline: 'ECE Undergrad | Digital Logic & Embedded Hardware Enthusiast',
    university: 'State Technological University',
    bio: 'ECE student struggling with digital electronics and circuit analysis. Need help understanding both theory and practical lab work.',
    joinedAt: '2026-01-20T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['kinesthetic', 'visual'], languages: ['English', 'Hindi'],
    onlineStatus: 'busy',
  },
  {
    id: 'mentee-4', email: 'mia.anderson@campus.edu', fullName: 'Mia Anderson',
    avatar: '', role: 'mentee', department: 'Computer Science', year: '2nd Year',
    headline: 'CS Student & AI Enthusiast | Working with Python & PyTorch',
    university: 'State Technological University',
    bio: 'Interested in machine learning and AI. Looking for a mentor to help me get started with Python and ML fundamentals.',
    joinedAt: '2026-03-01T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['reading', 'visual'], languages: ['English'],
    onlineStatus: 'available',
  },
  {
    id: 'mentee-5', email: 'ryan.park@campus.edu', fullName: 'Ryan Park',
    avatar: '', role: 'mentee', department: 'Mechanical Engineering', year: '1st Year',
    headline: 'Mechanical Engineering Freshman | Engineering Math & CAD',
    university: 'State Technological University',
    bio: 'ME fresher looking for help with engineering mathematics and thermodynamics. Prefer step-by-step problem-solving approach.',
    joinedAt: '2026-02-15T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['auditory', 'reading'], languages: ['English'],
    onlineStatus: 'offline',
  },
  {
    id: 'mentee-6', email: 'luna.martinez@campus.edu', fullName: 'Luna Martinez',
    avatar: '', role: 'mentee', department: 'Computer Science', year: '3rd Year',
    headline: 'Junior CS Major | Competitive Programming & Interview Prep',
    university: 'State Technological University',
    bio: 'Preparing for software engineering interviews. Need help with advanced DSA, system design, and competitive programming strategies.',
    joinedAt: '2026-01-05T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['kinesthetic', 'reading'], languages: ['English', 'Spanish'],
    onlineStatus: 'available',
  },
  {
    id: 'mentee-7', email: 'ethan.wright@campus.edu', fullName: 'Ethan Wright',
    avatar: '', role: 'mentee', department: 'Information Technology', year: '2nd Year',
    headline: 'IT Undergrad | Cloud Infrastructure & Database Enthusiast',
    university: 'State Technological University',
    bio: 'Want to learn about databases, backend development, and cloud services. Looking forward to building real projects with mentor guidance.',
    joinedAt: '2026-02-20T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['visual', 'kinesthetic'], languages: ['English'],
    onlineStatus: 'available',
  },
  {
    id: 'mentee-8', email: 'zara.khan@campus.edu', fullName: 'Zara Khan',
    avatar: '', role: 'mentee', department: 'Electrical Engineering', year: '2nd Year',
    headline: 'Electrical Engineering Undergrad | Robotics & Microcontrollers',
    university: 'State Technological University',
    bio: 'EE student interested in IoT and embedded systems. Also need help with circuit analysis and basic programming for microcontrollers.',
    joinedAt: '2026-03-10T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['kinesthetic', 'visual'], languages: ['English', 'Hindi'],
    onlineStatus: 'available',
  },

  // ── ADMIN ──────────────────────────────────────────────────
  {
    id: 'admin-1', email: 'admin@campus.edu', fullName: 'Campus Admin Officer',
    avatar: '', role: 'admin', department: 'Academic Affairs', year: 'Faculty',
    headline: 'Platform Administrator & Campus Community Director',
    university: 'State Technological University',
    bio: 'Platform administrator responsible for verifying campus mentors, moderating discussions, and ensuring safety standards across the ecosystem.',
    joinedAt: '2025-01-01T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: [], languages: ['English'],
    onlineStatus: 'available',
  },
];

// ============================================================
// MENTOR EXPERTISE — 31 records
// ============================================================

export const mockExpertise: MentorExpertise[] = [
  // Sarah Chen
  { id: 'exp-1', mentorId: 'mentor-1', topic: 'ReactJS', category: 'technical', proficiencyLevel: 5, description: 'Modern React with hooks, context, and performance optimization', yearsOfExperience: 3 },
  { id: 'exp-2', mentorId: 'mentor-1', topic: 'Web Development', category: 'technical', proficiencyLevel: 5, description: 'Full-stack development with React, Node.js, and databases', yearsOfExperience: 3 },
  { id: 'exp-3', mentorId: 'mentor-1', topic: 'TypeScript', category: 'technical', proficiencyLevel: 4, description: 'Type-safe development patterns and best practices', yearsOfExperience: 2 },
  // Rajesh Kumar
  { id: 'exp-4', mentorId: 'mentor-2', topic: 'Python', category: 'technical', proficiencyLevel: 5, description: 'Python for data science, scripting, and backend development', yearsOfExperience: 5 },
  { id: 'exp-5', mentorId: 'mentor-2', topic: 'Machine Learning', category: 'technical', proficiencyLevel: 5, description: 'Supervised, unsupervised learning, neural networks, and model deployment', yearsOfExperience: 4 },
  // Emily Davis
  { id: 'exp-6', mentorId: 'mentor-3', topic: 'Embedded Systems', category: 'technical', proficiencyLevel: 5, description: 'ARM microcontrollers, RTOS, and firmware development', yearsOfExperience: 3 },
  { id: 'exp-7', mentorId: 'mentor-3', topic: 'IoT', category: 'technical', proficiencyLevel: 4, description: 'IoT protocols, sensor integration, and edge computing', yearsOfExperience: 2 },
  { id: 'exp-8', mentorId: 'mentor-3', topic: 'Digital Electronics', category: 'academic', proficiencyLevel: 5, description: 'Logic design, sequential circuits, and FPGA basics', yearsOfExperience: 3 },
  // Marcus Johnson
  { id: 'exp-9', mentorId: 'mentor-4', topic: 'Engineering Mathematics', category: 'academic', proficiencyLevel: 5, description: 'Calculus, differential equations, and numerical methods', yearsOfExperience: 6 },
  { id: 'exp-10', mentorId: 'mentor-4', topic: 'Linear Algebra', category: 'academic', proficiencyLevel: 5, description: 'Vector spaces, eigenvalues, and matrix theory', yearsOfExperience: 6 },
  { id: 'exp-11', mentorId: 'mentor-4', topic: 'Probability & Statistics', category: 'academic', proficiencyLevel: 4, description: 'Probability theory, distributions, and statistical inference', yearsOfExperience: 4 },
  // Priya Sharma
  { id: 'exp-12', mentorId: 'mentor-5', topic: 'Data Structures', category: 'academic', proficiencyLevel: 5, description: 'Trees, graphs, dynamic programming, and advanced data structures', yearsOfExperience: 2 },
  { id: 'exp-13', mentorId: 'mentor-5', topic: 'C++', category: 'technical', proficiencyLevel: 5, description: 'Modern C++, STL, competitive programming techniques', yearsOfExperience: 3 },
  // James Wilson
  { id: 'exp-14', mentorId: 'mentor-6', topic: 'Operating Systems', category: 'academic', proficiencyLevel: 4, description: 'Process management, memory, file systems, and concurrency', yearsOfExperience: 2 },
  { id: 'exp-15', mentorId: 'mentor-6', topic: 'Computer Networks', category: 'academic', proficiencyLevel: 5, description: 'TCP/IP, routing, network security, and cloud networking', yearsOfExperience: 3 },
  { id: 'exp-16', mentorId: 'mentor-6', topic: 'Docker', category: 'technical', proficiencyLevel: 4, description: 'Containerization, Docker Compose, and deployment automation', yearsOfExperience: 2 },
  // Aisha Mohammed
  { id: 'exp-17', mentorId: 'mentor-7', topic: 'Java', category: 'technical', proficiencyLevel: 5, description: 'Java SE/EE, Spring Boot, design patterns, and testing', yearsOfExperience: 3 },
  { id: 'exp-18', mentorId: 'mentor-7', topic: 'Software Engineering', category: 'academic', proficiencyLevel: 4, description: 'SDLC, agile methodologies, and software architecture', yearsOfExperience: 2 },
  // Carlos Rodriguez
  { id: 'exp-19', mentorId: 'mentor-8', topic: 'Digital Electronics', category: 'academic', proficiencyLevel: 5, description: 'Boolean algebra, combinational/sequential circuits, and Verilog', yearsOfExperience: 2 },
  { id: 'exp-20', mentorId: 'mentor-8', topic: 'Circuit Analysis', category: 'academic', proficiencyLevel: 4, description: 'DC/AC analysis, network theorems, and signal processing', yearsOfExperience: 2 },
  // Nina Patel
  { id: 'exp-21', mentorId: 'mentor-9', topic: 'ReactJS', category: 'technical', proficiencyLevel: 5, description: 'Production React apps, state management, and testing', yearsOfExperience: 4 },
  { id: 'exp-22', mentorId: 'mentor-9', topic: 'JavaScript', category: 'technical', proficiencyLevel: 5, description: 'Advanced JS, async patterns, and performance tuning', yearsOfExperience: 5 },
  { id: 'exp-23', mentorId: 'mentor-9', topic: 'Node.js', category: 'technical', proficiencyLevel: 4, description: 'Server-side development, APIs, and microservices', yearsOfExperience: 4 },
  // David Lee
  { id: 'exp-24', mentorId: 'mentor-10', topic: 'Thermodynamics', category: 'academic', proficiencyLevel: 5, description: 'Laws of thermodynamics, heat transfer, and energy systems', yearsOfExperience: 3 },
  { id: 'exp-25', mentorId: 'mentor-10', topic: 'Engineering Mathematics', category: 'academic', proficiencyLevel: 4, description: 'Applied math for mechanical engineering problems', yearsOfExperience: 2 },
  // Sophia Garcia
  { id: 'exp-26', mentorId: 'mentor-11', topic: 'Web Development', category: 'technical', proficiencyLevel: 4, description: 'HTML, CSS, JavaScript, and modern frontend frameworks', yearsOfExperience: 2 },
  { id: 'exp-27', mentorId: 'mentor-11', topic: 'JavaScript', category: 'technical', proficiencyLevel: 4, description: 'ES6+, DOM manipulation, and browser APIs', yearsOfExperience: 2 },
  { id: 'exp-28', mentorId: 'mentor-11', topic: 'Python', category: 'technical', proficiencyLevel: 3, description: 'Python basics, scripting, and intro to Flask', yearsOfExperience: 1 },
  // Kevin Brown
  { id: 'exp-29', mentorId: 'mentor-12', topic: 'SQL', category: 'technical', proficiencyLevel: 5, description: 'Complex queries, optimization, schema design, and PostgreSQL', yearsOfExperience: 3 },
  { id: 'exp-30', mentorId: 'mentor-12', topic: 'Database Management', category: 'academic', proficiencyLevel: 5, description: 'Normalization, transactions, indexing, and NoSQL concepts', yearsOfExperience: 3 },
  { id: 'exp-31', mentorId: 'mentor-12', topic: 'Node.js', category: 'technical', proficiencyLevel: 4, description: 'Express.js, REST APIs, and backend architecture', yearsOfExperience: 2 },
];

// ============================================================
// AVAILABILITY
// ============================================================

export const mockAvailability: TimeSlot[] = [
  // Sarah Chen
  { id: 'avail-1', mentorId: 'mentor-1', dayOfWeek: 'monday', startTime: '10:00', endTime: '12:00', isRecurring: true },
  { id: 'avail-2', mentorId: 'mentor-1', dayOfWeek: 'wednesday', startTime: '14:00', endTime: '16:00', isRecurring: true },
  { id: 'avail-3', mentorId: 'mentor-1', dayOfWeek: 'friday', startTime: '09:00', endTime: '11:00', isRecurring: true },
  // Rajesh Kumar
  { id: 'avail-4', mentorId: 'mentor-2', dayOfWeek: 'tuesday', startTime: '18:00', endTime: '20:00', isRecurring: true },
  { id: 'avail-5', mentorId: 'mentor-2', dayOfWeek: 'saturday', startTime: '10:00', endTime: '13:00', isRecurring: true },
  // Emily Davis
  { id: 'avail-6', mentorId: 'mentor-3', dayOfWeek: 'monday', startTime: '15:00', endTime: '17:00', isRecurring: true },
  { id: 'avail-7', mentorId: 'mentor-3', dayOfWeek: 'thursday', startTime: '10:00', endTime: '12:00', isRecurring: true },
  // Marcus Johnson
  { id: 'avail-8', mentorId: 'mentor-4', dayOfWeek: 'wednesday', startTime: '09:00', endTime: '12:00', isRecurring: true },
  { id: 'avail-9', mentorId: 'mentor-4', dayOfWeek: 'friday', startTime: '14:00', endTime: '17:00', isRecurring: true },
  { id: 'avail-10', mentorId: 'mentor-4', dayOfWeek: 'saturday', startTime: '10:00', endTime: '12:00', isRecurring: true },
  // Priya Sharma
  { id: 'avail-11', mentorId: 'mentor-5', dayOfWeek: 'tuesday', startTime: '16:00', endTime: '18:00', isRecurring: true },
  { id: 'avail-12', mentorId: 'mentor-5', dayOfWeek: 'thursday', startTime: '16:00', endTime: '18:00', isRecurring: true },
  { id: 'avail-13', mentorId: 'mentor-5', dayOfWeek: 'sunday', startTime: '10:00', endTime: '13:00', isRecurring: true },
  // James Wilson
  { id: 'avail-14', mentorId: 'mentor-6', dayOfWeek: 'monday', startTime: '14:00', endTime: '16:00', isRecurring: true },
  { id: 'avail-15', mentorId: 'mentor-6', dayOfWeek: 'wednesday', startTime: '14:00', endTime: '16:00', isRecurring: true },
  { id: 'avail-16', mentorId: 'mentor-6', dayOfWeek: 'friday', startTime: '10:00', endTime: '12:00', isRecurring: true },
  // Aisha Mohammed
  { id: 'avail-17', mentorId: 'mentor-7', dayOfWeek: 'tuesday', startTime: '10:00', endTime: '12:00', isRecurring: true },
  { id: 'avail-18', mentorId: 'mentor-7', dayOfWeek: 'thursday', startTime: '14:00', endTime: '16:00', isRecurring: true },
  // Carlos Rodriguez
  { id: 'avail-19', mentorId: 'mentor-8', dayOfWeek: 'monday', startTime: '09:00', endTime: '11:00', isRecurring: true },
  { id: 'avail-20', mentorId: 'mentor-8', dayOfWeek: 'wednesday', startTime: '09:00', endTime: '11:00', isRecurring: true },
  { id: 'avail-21', mentorId: 'mentor-8', dayOfWeek: 'friday', startTime: '15:00', endTime: '17:00', isRecurring: true },
  // Nina Patel
  { id: 'avail-22', mentorId: 'mentor-9', dayOfWeek: 'tuesday', startTime: '19:00', endTime: '21:00', isRecurring: true },
  { id: 'avail-23', mentorId: 'mentor-9', dayOfWeek: 'saturday', startTime: '11:00', endTime: '14:00', isRecurring: true },
  // David Lee
  { id: 'avail-24', mentorId: 'mentor-10', dayOfWeek: 'wednesday', startTime: '16:00', endTime: '18:00', isRecurring: true },
  { id: 'avail-25', mentorId: 'mentor-10', dayOfWeek: 'sunday', startTime: '10:00', endTime: '12:00', isRecurring: true },
  // Sophia Garcia
  { id: 'avail-26', mentorId: 'mentor-11', dayOfWeek: 'monday', startTime: '16:00', endTime: '18:00', isRecurring: true },
  { id: 'avail-27', mentorId: 'mentor-11', dayOfWeek: 'thursday', startTime: '10:00', endTime: '12:00', isRecurring: true },
  { id: 'avail-28', mentorId: 'mentor-11', dayOfWeek: 'saturday', startTime: '14:00', endTime: '16:00', isRecurring: true },
  // Kevin Brown
  { id: 'avail-29', mentorId: 'mentor-12', dayOfWeek: 'tuesday', startTime: '14:00', endTime: '16:00', isRecurring: true },
  { id: 'avail-30', mentorId: 'mentor-12', dayOfWeek: 'friday', startTime: '10:00', endTime: '12:00', isRecurring: true },
];

// ============================================================
// TUTORING SESSIONS
// ============================================================

export const mockSessions: TutoringSession[] = [
  // Completed sessions
  { id: 'session-1', mentorId: 'mentor-1', menteeId: 'mentee-1', topic: 'ReactJS', description: 'Introduction to React hooks and state management', date: '2026-10-15', startTime: '10:00', duration: 60, sessionType: 'online', meetingLink: 'https://meet.skillbridge.campus/abc', status: 'completed', createdAt: '2026-10-10T10:00:00Z', updatedAt: '2026-10-15T11:00:00Z' },
  { id: 'session-2', mentorId: 'mentor-2', menteeId: 'mentee-4', topic: 'Machine Learning', description: 'Understanding linear regression and gradient descent', date: '2026-10-18', startTime: '18:00', duration: 90, sessionType: 'online', meetingLink: 'https://meet.skillbridge.campus/def', status: 'completed', createdAt: '2026-10-12T10:00:00Z', updatedAt: '2026-10-18T19:30:00Z' },
  { id: 'session-3', mentorId: 'mentor-5', menteeId: 'mentee-6', topic: 'Data Structures', description: 'Graph algorithms and BFS/DFS traversal', date: '2026-10-20', startTime: '16:00', duration: 60, sessionType: 'online', status: 'completed', createdAt: '2026-10-14T10:00:00Z', updatedAt: '2026-10-20T17:00:00Z' },
  { id: 'session-4', mentorId: 'mentor-4', menteeId: 'mentee-5', topic: 'Engineering Mathematics', description: 'Solving differential equations with Laplace transforms', date: '2026-10-22', startTime: '09:00', duration: 90, sessionType: 'in-person', location: 'Library Room 204', status: 'completed', createdAt: '2026-10-16T10:00:00Z', updatedAt: '2026-10-22T10:30:00Z' },
  { id: 'session-5', mentorId: 'mentor-3', menteeId: 'mentee-3', topic: 'Digital Electronics', description: 'Designing sequential circuits and flip-flops', date: '2026-10-25', startTime: '15:00', duration: 60, sessionType: 'in-person', location: 'Electronics Lab', status: 'completed', createdAt: '2026-10-19T10:00:00Z', updatedAt: '2026-10-25T16:00:00Z' },
  { id: 'session-6', mentorId: 'mentor-1', menteeId: 'mentee-2', topic: 'Web Development', description: 'Building responsive layouts with CSS Grid and Flexbox', date: '2026-10-28', startTime: '10:00', duration: 60, sessionType: 'online', status: 'completed', createdAt: '2026-10-22T10:00:00Z', updatedAt: '2026-10-28T11:00:00Z' },
  { id: 'session-7', mentorId: 'mentor-9', menteeId: 'mentee-1', topic: 'ReactJS', description: 'Advanced patterns: render props, HOCs, and custom hooks', date: '2026-10-30', startTime: '19:00', duration: 60, sessionType: 'online', status: 'completed', createdAt: '2026-10-24T10:00:00Z', updatedAt: '2026-10-30T20:00:00Z' },
  { id: 'session-8', mentorId: 'mentor-7', menteeId: 'mentee-6', topic: 'Java', description: 'Design patterns: Factory, Observer, and Strategy', date: '2026-10-29', startTime: '10:00', duration: 90, sessionType: 'online', status: 'completed', createdAt: '2026-10-23T10:00:00Z', updatedAt: '2026-10-29T11:30:00Z' },

  // Upcoming sessions
  { id: 'session-9', mentorId: 'mentor-1', menteeId: 'mentee-1', topic: 'ReactJS', description: 'State management with Zustand and context API', date: '2026-11-10', startTime: '10:00', duration: 60, sessionType: 'online', meetingLink: 'https://meet.skillbridge.campus/xyz', status: 'accepted', createdAt: '2026-11-01T10:00:00Z', updatedAt: '2026-11-02T10:00:00Z' },
  { id: 'session-10', mentorId: 'mentor-2', menteeId: 'mentee-4', topic: 'Python', description: 'NumPy and Pandas for data manipulation', date: '2026-11-12', startTime: '18:00', duration: 90, sessionType: 'online', status: 'accepted', createdAt: '2026-11-02T10:00:00Z', updatedAt: '2026-11-03T10:00:00Z' },
  { id: 'session-11', mentorId: 'mentor-5', menteeId: 'mentee-6', topic: 'C++', description: 'STL containers and competitive programming tricks', date: '2026-11-14', startTime: '16:00', duration: 60, sessionType: 'online', status: 'accepted', createdAt: '2026-11-03T10:00:00Z', updatedAt: '2026-11-04T10:00:00Z' },

  // Pending sessions
  { id: 'session-12', mentorId: 'mentor-6', menteeId: 'mentee-7', topic: 'Computer Networks', description: 'Understanding TCP/IP stack and network layers', date: '2026-11-15', startTime: '14:00', duration: 60, sessionType: 'online', status: 'pending', createdAt: '2026-11-04T10:00:00Z', updatedAt: '2026-11-04T10:00:00Z' },
  { id: 'session-13', mentorId: 'mentor-3', menteeId: 'mentee-8', topic: 'IoT', description: 'Getting started with Arduino and sensor integration', date: '2026-11-16', startTime: '15:00', duration: 90, sessionType: 'in-person', location: 'IoT Lab', status: 'pending', createdAt: '2026-11-04T12:00:00Z', updatedAt: '2026-11-04T12:00:00Z' },
  { id: 'session-14', mentorId: 'mentor-12', menteeId: 'mentee-7', topic: 'SQL', description: 'Complex joins, subqueries, and query optimization', date: '2026-11-17', startTime: '14:00', duration: 60, sessionType: 'online', status: 'pending', createdAt: '2026-11-05T08:00:00Z', updatedAt: '2026-11-05T08:00:00Z' },
];

// ============================================================
// REVIEWS
// ============================================================

export const mockReviews: SessionReview[] = [
  { id: 'rev-1', sessionId: 'session-1', mentorId: 'mentor-1', menteeId: 'mentee-1', overallRating: 5, teachingQuality: 5, communication: 5, subjectKnowledge: 5, review: 'Sarah is an amazing mentor! She explained React hooks so clearly. I finally understand useState and useEffect. Highly recommend her for anyone learning React.', createdAt: '2026-10-15T12:00:00Z' },
  { id: 'rev-2', sessionId: 'session-2', mentorId: 'mentor-2', menteeId: 'mentee-4', overallRating: 5, teachingQuality: 5, communication: 4, subjectKnowledge: 5, review: 'Rajesh made machine learning concepts so accessible. His practical examples really helped me understand gradient descent. Can\'t wait for the next session!', createdAt: '2026-10-18T20:00:00Z' },
  { id: 'rev-3', sessionId: 'session-3', mentorId: 'mentor-5', menteeId: 'mentee-6', overallRating: 4, teachingQuality: 4, communication: 5, subjectKnowledge: 5, review: 'Priya is great at explaining complex DSA concepts. She walked me through graph algorithms step by step. Very patient and knowledgeable.', createdAt: '2026-10-20T18:00:00Z' },
  { id: 'rev-4', sessionId: 'session-4', mentorId: 'mentor-4', menteeId: 'mentee-5', overallRating: 5, teachingQuality: 5, communication: 5, subjectKnowledge: 5, review: 'Professor-level teaching quality. Marcus made Laplace transforms actually make sense. The in-person session was really productive.', createdAt: '2026-10-22T11:00:00Z' },
  { id: 'rev-5', sessionId: 'session-5', mentorId: 'mentor-3', menteeId: 'mentee-3', overallRating: 4, teachingQuality: 4, communication: 4, subjectKnowledge: 5, review: 'Emily knows her electronics inside out. The hands-on lab session was very helpful. Would love to have more sessions on FPGA design.', createdAt: '2026-10-25T17:00:00Z' },
  { id: 'rev-6', sessionId: 'session-6', mentorId: 'mentor-1', menteeId: 'mentee-2', overallRating: 5, teachingQuality: 5, communication: 5, subjectKnowledge: 4, review: 'Sarah is so patient and encouraging! She helped me build my first responsive layout. Now I feel confident working with CSS Grid.', createdAt: '2026-10-28T12:00:00Z' },
  { id: 'rev-7', sessionId: 'session-7', mentorId: 'mentor-9', menteeId: 'mentee-1', overallRating: 5, teachingQuality: 5, communication: 5, subjectKnowledge: 5, review: 'Nina is a React expert. Her insights on advanced patterns and real-world production code were invaluable. Top-tier mentoring.', createdAt: '2026-10-30T21:00:00Z' },
  { id: 'rev-8', sessionId: 'session-8', mentorId: 'mentor-7', menteeId: 'mentee-6', overallRating: 4, teachingQuality: 4, communication: 4, subjectKnowledge: 5, review: 'Aisha explained design patterns with great real-world Java examples. Very organized and well-prepared session.', createdAt: '2026-10-29T12:00:00Z' },
];

// ============================================================
// CONVERSATIONS & MESSAGES
// ============================================================

export const mockConversations: Conversation[] = [
  { id: 'conv-1', participantIds: ['mentee-1', 'mentor-1'], lastMessage: 'Looking forward to our next session on Zustand!', lastMessageAt: '2026-11-03T14:00:00Z', createdAt: '2026-10-10T10:00:00Z', unreadCount: { 'mentee-1': 0, 'mentor-1': 1 } },
  { id: 'conv-2', participantIds: ['mentee-4', 'mentor-2'], lastMessage: 'I\'ve shared the Jupyter notebook link for our Python session.', lastMessageAt: '2026-11-02T19:00:00Z', createdAt: '2026-10-12T10:00:00Z', unreadCount: { 'mentee-4': 1, 'mentor-2': 0 } },
  { id: 'conv-3', participantIds: ['mentee-6', 'mentor-5'], lastMessage: 'Thanks for the Codeforces problem set! Working through it now.', lastMessageAt: '2026-11-04T11:00:00Z', createdAt: '2026-10-14T10:00:00Z', unreadCount: { 'mentee-6': 0, 'mentor-5': 0 } },
  { id: 'conv-4', participantIds: ['mentee-1', 'mentor-9'], lastMessage: 'Great session! I\'ll practice the custom hook pattern you showed me.', lastMessageAt: '2026-10-30T21:30:00Z', createdAt: '2026-10-24T10:00:00Z', unreadCount: { 'mentee-1': 0, 'mentor-9': 0 } },
  { id: 'conv-5', participantIds: ['mentee-3', 'mentor-3'], lastMessage: 'Can we schedule another lab session for next week?', lastMessageAt: '2026-11-01T09:00:00Z', createdAt: '2026-10-19T10:00:00Z', unreadCount: { 'mentee-3': 0, 'mentor-3': 1 } },
];

export const mockMessages: Message[] = [
  { id: 'msg-1', conversationId: 'conv-1', senderId: 'mentee-1', content: 'Hi Sarah! I saw your profile and would love to learn React from you.', timestamp: '2026-10-10T10:00:00Z', isRead: true },
  { id: 'msg-2', conversationId: 'conv-1', senderId: 'mentor-1', content: 'Hey Alex! I\'d be happy to help. What\'s your current experience with React?', timestamp: '2026-10-10T10:15:00Z', isRead: true },
  { id: 'msg-3', conversationId: 'conv-1', senderId: 'mentee-1', content: 'I know basic JavaScript and HTML/CSS. Just starting with React. I\'ve done a few tutorials but want structured guidance.', timestamp: '2026-10-10T10:30:00Z', isRead: true },
  { id: 'msg-4', conversationId: 'conv-1', senderId: 'mentor-1', content: 'That\'s a great foundation! Let\'s start with hooks in our first session. I\'ll prepare some exercises for you.', timestamp: '2026-10-10T11:00:00Z', isRead: true },
  { id: 'msg-5', conversationId: 'conv-1', senderId: 'mentee-1', content: 'That session on hooks was so helpful! I built a todo app using everything we covered. 🎉', timestamp: '2026-10-16T09:00:00Z', isRead: true },
  { id: 'msg-6', conversationId: 'conv-1', senderId: 'mentor-1', content: 'That\'s awesome progress! Next session let\'s tackle state management.', timestamp: '2026-10-16T09:30:00Z', isRead: true },
  { id: 'msg-7', conversationId: 'conv-1', senderId: 'mentee-1', content: 'Looking forward to our next session on Zustand!', timestamp: '2026-11-03T14:00:00Z', isRead: false },

  { id: 'msg-8', conversationId: 'conv-2', senderId: 'mentee-4', content: 'Hello Rajesh! I\'m really interested in getting into machine learning. Where should I start?', timestamp: '2026-10-12T10:00:00Z', isRead: true },
  { id: 'msg-9', conversationId: 'conv-2', senderId: 'mentor-2', content: 'Hi Mia! Great to hear. Let\'s begin with Python fundamentals and then move to ML concepts. Do you have Python installed?', timestamp: '2026-10-12T10:30:00Z', isRead: true },
  { id: 'msg-10', conversationId: 'conv-2', senderId: 'mentee-4', content: 'Yes, I have Anaconda set up. The ML session was great! Understanding gradient descent finally clicked.', timestamp: '2026-10-19T10:00:00Z', isRead: true },
  { id: 'msg-11', conversationId: 'conv-2', senderId: 'mentor-2', content: 'I\'ve shared the Jupyter notebook link for our Python session.', timestamp: '2026-11-02T19:00:00Z', isRead: false },

  { id: 'msg-12', conversationId: 'conv-3', senderId: 'mentee-6', content: 'Hi Priya! I\'m preparing for SDE interviews. Can you help with advanced DSA?', timestamp: '2026-10-14T10:00:00Z', isRead: true },
  { id: 'msg-13', conversationId: 'conv-3', senderId: 'mentor-5', content: 'Absolutely Luna! Let\'s create a study plan. I\'ll share some curated problem sets organized by topic.', timestamp: '2026-10-14T10:30:00Z', isRead: true },
  { id: 'msg-14', conversationId: 'conv-3', senderId: 'mentor-5', content: 'Here\'s a Codeforces problem set focusing on graphs and DP. Try solving 3-4 problems before our next session.', timestamp: '2026-11-04T10:00:00Z', isRead: true },
  { id: 'msg-15', conversationId: 'conv-3', senderId: 'mentee-6', content: 'Thanks for the Codeforces problem set! Working through it now.', timestamp: '2026-11-04T11:00:00Z', isRead: true },

  { id: 'msg-16', conversationId: 'conv-4', senderId: 'mentee-1', content: 'Hi Nina! I loved reading your profile. I want to learn advanced React patterns.', timestamp: '2026-10-24T10:00:00Z', isRead: true },
  { id: 'msg-17', conversationId: 'conv-4', senderId: 'mentor-9', content: 'Thanks Alex! I see you\'ve already done intro sessions. Let\'s dive into production patterns.', timestamp: '2026-10-24T11:00:00Z', isRead: true },
  { id: 'msg-18', conversationId: 'conv-4', senderId: 'mentee-1', content: 'Great session! I\'ll practice the custom hook pattern you showed me.', timestamp: '2026-10-30T21:30:00Z', isRead: true },

  { id: 'msg-19', conversationId: 'conv-5', senderId: 'mentee-3', content: 'Hi Emily! I need help with sequential circuit design for my lab exam.', timestamp: '2026-10-19T10:00:00Z', isRead: true },
  { id: 'msg-20', conversationId: 'conv-5', senderId: 'mentor-3', content: 'No problem Omar! Let\'s schedule a hands-on lab session. Bring your lab manual.', timestamp: '2026-10-19T10:30:00Z', isRead: true },
  { id: 'msg-21', conversationId: 'conv-5', senderId: 'mentee-3', content: 'Can we schedule another lab session for next week?', timestamp: '2026-11-01T09:00:00Z', isRead: false },
];

// ============================================================
// NOTIFICATIONS
// ============================================================

export const mockNotifications: Notification[] = [
  { id: 'notif-1', userId: 'mentee-1', type: 'session_accepted', title: 'Session Confirmed', message: 'Sarah Chen accepted your session request for ReactJS on Nov 10.', isRead: false, relatedId: 'session-9', createdAt: '2026-11-02T10:00:00Z' },
  { id: 'notif-2', userId: 'mentor-1', type: 'new_review', title: 'New Review', message: 'Jessica Li left a 5-star review for your Web Development session.', isRead: true, relatedId: 'rev-6', createdAt: '2026-10-28T12:30:00Z' },
  { id: 'notif-3', userId: 'mentor-6', type: 'session_request', title: 'New Session Request', message: 'Ethan Wright requested a Computer Networks session on Nov 15.', isRead: false, relatedId: 'session-12', createdAt: '2026-11-04T10:00:00Z' },
  { id: 'notif-4', userId: 'mentee-6', type: 'session_accepted', title: 'Session Confirmed', message: 'Priya Sharma accepted your C++ tutoring session on Nov 14.', isRead: true, relatedId: 'session-11', createdAt: '2026-11-04T10:00:00Z' },
  { id: 'notif-5', userId: 'mentor-3', type: 'session_request', title: 'New Session Request', message: 'Zara Khan requested an IoT session on Nov 16.', isRead: false, relatedId: 'session-13', createdAt: '2026-11-04T12:00:00Z' },
  { id: 'notif-6', userId: 'mentee-1', type: 'session_reminder', title: 'Session Tomorrow', message: 'Reminder: You have a ReactJS session with Sarah Chen tomorrow at 10:00 AM.', isRead: false, createdAt: '2026-11-09T08:00:00Z' },
  { id: 'notif-7', userId: 'mentee-1', type: 'connection_request', title: 'New Connection Request', message: 'Rajesh Kumar wants to connect with your professional network.', isRead: false, linkUrl: '/network', createdAt: '2026-11-04T15:00:00Z' },
  { id: 'notif-8', userId: 'mentee-1', type: 'skill_endorsed', title: 'Skill Endorsement', message: 'Sarah Chen endorsed your skill: ReactJS.', isRead: false, linkUrl: '/profile', createdAt: '2026-11-03T18:00:00Z' },
];

// ============================================================
// SKILLBRIDGE 2.0: PROFESSIONAL FEED POSTS
// ============================================================

export const mockPosts: Post[] = [
  {
    id: 'post-1',
    authorId: 'mentor-1',
    authorName: 'Sarah Chen',
    authorHeadline: 'Senior CS Student & Frontend Architect | Incoming SWE Intern',
    authorDepartment: 'Computer Science',
    authorRole: 'mentor',
    content: '🎉 Thrilled to announce that our campus developer team took 1st place at the National Inter-College Hackathon! We built "CampusSync", an edge-AI scheduling tool using React, WebSockets, and PyTorch. Huge shoutout to my mentees who contributed to the backend services. Building in public pays off! 🚀',
    postType: 'ACHIEVEMENT',
    tags: ['Hackathon', 'WebDev', 'React', 'CampusLife', 'StudentSuccess'],
    createdAt: '2026-11-04T14:30:00Z',
    reactionsCount: 42,
    commentsCount: 8,
    sharesCount: 5,
    hasLiked: false,
    isSaved: true,
    comments: [
      {
        id: 'c-1',
        postId: 'post-1',
        authorId: 'mentee-1',
        authorName: 'Alex Turner',
        authorHeadline: 'Sophomore CS Student',
        content: 'Congratulations Sarah! Watching your architectural breakdown during our mentoring session helped me understand WebSocket scaling.',
        createdAt: '2026-11-04T15:10:00Z',
      },
      {
        id: 'c-2',
        postId: 'post-1',
        authorId: 'mentor-2',
        authorName: 'Rajesh Kumar',
        authorHeadline: 'ML Engineer @ FAANG',
        content: 'Impressive architecture Sarah. The edge caching approach was very smart. Keep inspiring the junior students!',
        createdAt: '2026-11-04T16:00:00Z',
      },
    ],
  },
  {
    id: 'post-2',
    authorId: 'mentor-2',
    authorName: 'Rajesh Kumar',
    authorHeadline: 'Machine Learning Engineer @ FAANG | Deep Learning Researcher',
    authorDepartment: 'Computer Science',
    authorRole: 'mentor',
    content: 'For everyone preparing for AI/ML engineering campus interviews: focus on fundamentals over chasing every new LLM paper. Make sure you can write matrix multiplications from scratch, explain loss backpropagation, and understand precision-recall tradeoffs for real-world datasets. Feel free to book a mentorship slot if you want mock technical interviews!',
    postType: 'OPPORTUNITY',
    tags: ['MachineLearning', 'CareerAdvice', 'InterviewPrep', 'Python', 'Mentorship'],
    createdAt: '2026-11-03T11:00:00Z',
    reactionsCount: 89,
    commentsCount: 14,
    sharesCount: 12,
    hasLiked: true,
    isSaved: false,
    comments: [
      {
        id: 'c-3',
        postId: 'post-2',
        authorId: 'mentee-4',
        authorName: 'Mia Anderson',
        authorHeadline: 'CS Student & AI Enthusiast',
        content: 'Our session on gradient descent was the turning point for me. Booking another session for next week!',
        createdAt: '2026-11-03T12:30:00Z',
      },
    ],
  },
  {
    id: 'post-3',
    authorId: 'mentee-1',
    authorName: 'Alex Turner',
    authorHeadline: 'Sophomore CS Student | Learning Full-Stack React & Algorithms',
    authorDepartment: 'Computer Science',
    authorRole: 'mentee',
    content: '💡 Milestone achieved: just open-sourced my first canvas-based Data Structures visualizer for binary trees and AVL trees! Check out the interactive sorting animations. Thanks to Priya Sharma and Sarah Chen for reviewing my code structure.',
    postType: 'PROJECT_SHOWCASE',
    tags: ['OpenSource', 'DataStructures', 'React', 'TypeScript', 'Portfolio'],
    createdAt: '2026-11-02T09:15:00Z',
    reactionsCount: 31,
    commentsCount: 6,
    sharesCount: 3,
    hasLiked: false,
    isSaved: false,
  },
  {
    id: 'post-4',
    authorId: 'mentor-3',
    authorName: 'Emily Davis',
    authorHeadline: 'Embedded Systems & IoT Specialist | 3x Hackathon Winner',
    authorDepartment: 'Electronics Engineering',
    authorRole: 'mentor',
    content: '🚨 Lab Alert: The Electronics Department has just received 20 new ARM Cortex-M4 development boards! Starting next Monday, I will be hosting open lab sessions on FreeRTOS task scheduling. Open to all students who want hands-on microcontroller experience.',
    postType: 'ACADEMIC_QUESTION',
    tags: ['EmbeddedSystems', 'IoT', 'HardwareLab', 'Electronics', 'FreeRTOS'],
    createdAt: '2026-11-01T16:45:00Z',
    reactionsCount: 56,
    commentsCount: 11,
    sharesCount: 7,
    hasLiked: true,
    isSaved: true,
  },
];

// ============================================================
// SKILLBRIDGE 2.0: CAMPUS COMMUNITIES
// ============================================================

export const mockCommunities: CommunityItem[] = [
  {
    id: 'comm-1',
    name: 'Computer Science & Engineering',
    slug: 'cs-engineering',
    description: 'The primary campus community for algorithms, systems, software architecture, and competitive coding.',
    icon: '💻',
    membersCount: 420,
    postsCount: 145,
    isMember: true,
  },
  {
    id: 'comm-2',
    name: 'AI & Machine Learning Club',
    slug: 'ai-ml-club',
    description: 'Deep learning discussions, computer vision research, paper reading groups, and Kaggle team matching.',
    icon: '🤖',
    membersCount: 310,
    postsCount: 92,
    isMember: true,
  },
  {
    id: 'comm-3',
    name: 'Web & Cloud Dev Society',
    slug: 'web-cloud-society',
    description: 'React, Next.js, Node.js, cloud deployments, DevOps pipelines, and campus open-source collaborations.',
    icon: '🌐',
    membersCount: 285,
    postsCount: 118,
    isMember: false,
  },
  {
    id: 'comm-4',
    name: 'Electronics & Robotics Hub',
    slug: 'electronics-robotics',
    description: 'Embedded firmware, PCB design, sensors, IoT automation, and robotics competitions.',
    icon: '⚡',
    membersCount: 195,
    postsCount: 64,
    isMember: false,
  },
  {
    id: 'comm-5',
    name: 'Campus Startup & Innovation',
    slug: 'startup-innovation',
    description: 'Product design, venture building, pitching to campus incubators, and student co-founder discovery.',
    icon: '🚀',
    membersCount: 160,
    postsCount: 41,
    isMember: false,
  },
];

// ============================================================
// SKILLBRIDGE 2.0: SKILLS & ENDORSEMENTS
// ============================================================

export const mockSkills: SkillItem[] = [
  {
    id: 'sk-1',
    name: 'React.js',
    category: 'technical',
    endorsementsCount: 18,
    isEndorsedByMe: true,
    endorsers: [
      { id: 'mentor-1', name: 'Sarah Chen' },
      { id: 'mentor-9', name: 'Nina Patel' },
      { id: 'mentor-11', name: 'Sophia Garcia' },
    ],
  },
  {
    id: 'sk-2',
    name: 'TypeScript',
    category: 'technical',
    endorsementsCount: 14,
    isEndorsedByMe: false,
    endorsers: [
      { id: 'mentor-1', name: 'Sarah Chen' },
      { id: 'mentor-9', name: 'Nina Patel' },
    ],
  },
  {
    id: 'sk-3',
    name: 'Data Structures & Algorithms',
    category: 'academic',
    endorsementsCount: 22,
    isEndorsedByMe: true,
    endorsers: [
      { id: 'mentor-5', name: 'Priya Sharma' },
      { id: 'mentor-2', name: 'Rajesh Kumar' },
    ],
  },
  {
    id: 'sk-4',
    name: 'Python',
    category: 'technical',
    endorsementsCount: 27,
    isEndorsedByMe: false,
    endorsers: [
      { id: 'mentor-2', name: 'Rajesh Kumar' },
    ],
  },
  {
    id: 'sk-5',
    name: 'Machine Learning',
    category: 'technical',
    endorsementsCount: 19,
    isEndorsedByMe: false,
    endorsers: [
      { id: 'mentor-2', name: 'Rajesh Kumar' },
    ],
  },
  {
    id: 'sk-6',
    name: 'Embedded Systems',
    category: 'technical',
    endorsementsCount: 12,
    isEndorsedByMe: false,
    endorsers: [
      { id: 'mentor-3', name: 'Emily Davis' },
    ],
  },
  {
    id: 'sk-7',
    name: 'SQL & Database Optimization',
    category: 'technical',
    endorsementsCount: 15,
    isEndorsedByMe: false,
    endorsers: [
      { id: 'mentor-12', name: 'Kevin Brown' },
    ],
  },
];

// ============================================================
// SKILLBRIDGE 2.0: CONNECTIONS
// ============================================================

export const mockConnections: Connection[] = [
  {
    id: 'conn-1',
    senderId: 'mentee-1',
    receiverId: 'mentor-1',
    status: 'ACCEPTED',
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-02T11:00:00Z',
    user: mockUsers[0],
  },
  {
    id: 'conn-2',
    senderId: 'mentee-1',
    receiverId: 'mentor-2',
    status: 'ACCEPTED',
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-02-16T11:00:00Z',
    user: mockUsers[1],
  },
  {
    id: 'conn-3',
    senderId: 'mentee-2',
    receiverId: 'mentee-1',
    status: 'ACCEPTED',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-02T11:00:00Z',
    user: mockUsers[13],
  },
  {
    id: 'conn-4',
    senderId: 'mentor-5',
    receiverId: 'mentee-1',
    status: 'PENDING',
    createdAt: '2026-11-04T14:00:00Z',
    updatedAt: '2026-11-04T14:00:00Z',
    user: mockUsers[4],
  },
  {
    id: 'conn-5',
    senderId: 'mentee-6',
    receiverId: 'mentee-1',
    status: 'PENDING',
    createdAt: '2026-11-05T09:00:00Z',
    updatedAt: '2026-11-05T09:00:00Z',
    user: mockUsers[17],
  },
];

// ============================================================
// PROJECTS (SkillBridge 4.0 – ProjectSpace)
// ============================================================

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    ownerId: 'mentor-3',
    ownerName: 'Marcus Vance',
    ownerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    ownerHeadline: 'Embedded Systems & IoT Hardware Lead',
    ownerDepartment: 'Electronics Engineering',
    title: 'AgriPulse – IoT Smart Agriculture & Automated Irrigation',
    tagline: 'Solar-powered precision farming node using ESP32, soil capacitive sensing, and cloud telemetry.',
    description: 'We are engineering an open hardware IoT agriculture system designed for the campus research greenhouse. It measures real-time volumetric water content (VWC), ambient temperature, and sunlight lux, triggering automated drip irrigation solenoids. Seeking collaborators with ReactJS for our real-time telemetry dashboard and Machine Learning for crop stress prediction.',
    category: 'IoT & Hardware',
    status: 'recruiting',
    teamSize: 4,
    currentMembers: [
      {
        userId: 'mentor-3',
        name: 'Marcus Vance',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        role: 'Hardware & Firmware Lead',
        skills: ['Embedded C', 'ESP32', 'Circuit Design'],
      },
      {
        userId: 'mentee-3',
        name: 'Omar Hassan',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        role: 'Sensor Circuit Testing',
        skills: ['Electronics', 'Breadboarding'],
      },
    ],
    requiredSkills: ['Embedded C', 'ESP32', 'ReactJS', 'Cloud Integration', 'Machine Learning', 'UI/UX Design'],
    openPositions: [
      {
        id: 'pos-1',
        title: 'Web Dashboard & Cloud Integrator',
        requiredSkills: ['ReactJS', 'TypeScript', 'WebSockets'],
        spots: 1,
        description: 'Build a responsive telemetry dashboard in ReactJS to stream live sensor readings from MQTT/WebSockets and toggle automated valves.',
      },
      {
        id: 'pos-2',
        title: 'Edge ML Yield Prediction Specialist',
        requiredSkills: ['Python', 'Machine Learning', 'Time Series'],
        spots: 1,
        description: 'Train and evaluate regression models to predict optimal watering cycles from historical moisture and weather forecast patterns.',
      },
    ],
    duration: 'Fall Semester (3 Months)',
    milestones: [
      { id: 'm-1', title: 'PCB Schematics & ESP32 FreeRTOS Firmware', dueDate: 'Oct 15', completed: true },
      { id: 'm-2', title: 'MQTT Telemetry Broker Integration', dueDate: 'Nov 01', completed: true },
      { id: 'm-3', title: 'Live ReactJS Telemetry & Valve Controls Portal', dueDate: 'Nov 20', completed: false },
      { id: 'm-4', title: 'Greenhouse Field Deployment & ML Validation', dueDate: 'Dec 05', completed: false },
    ],
    applicationsCount: 3,
    githubUrl: 'https://github.com/campus-agripulse/core',
    createdAt: '2026-02-10T10:00:00Z',
  },
  {
    id: 'proj-2',
    ownerId: 'mentor-1',
    ownerName: 'Sarah Jenkins',
    ownerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    ownerHeadline: 'Senior CS Student & Distributed Systems Lead',
    ownerDepartment: 'Computer Science',
    title: 'CampusAI – Intelligent Syllabus & Research Search Engine',
    tagline: 'Semantic vector search and RAG engine indexing campus textbooks, past papers, and lecture notes.',
    description: 'A campus knowledge search engine providing answers with citations from official syllabus documents and course lecture slides. Looking for a frontend specialist to build a clean Notion-like reading experience.',
    category: 'AI & Machine Learning',
    status: 'recruiting',
    teamSize: 3,
    currentMembers: [
      {
        userId: 'mentor-1',
        name: 'Sarah Jenkins',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        role: 'RAG & Vector Pipeline Lead',
        skills: ['Python', 'PyTorch', 'FastAPI'],
      },
    ],
    requiredSkills: ['Python', 'FastAPI', 'ReactJS', 'Tailwind CSS', 'Vector Databases'],
    openPositions: [
      {
        id: 'pos-3',
        title: 'Frontend Reading Interface Lead',
        requiredSkills: ['ReactJS', 'Tailwind CSS', 'TypeScript'],
        spots: 1,
        description: 'Design and build the interactive textbook and search results viewer with citation tooltips and markdown rendering.',
      },
    ],
    duration: '4 Months',
    milestones: [
      { id: 'm-5', title: 'Document Parsing & Embedding Generation', dueDate: 'Nov 12', completed: true },
      { id: 'm-6', title: 'Interactive Citations UI & Speed Benchmarking', dueDate: 'Nov 30', completed: false },
    ],
    applicationsCount: 2,
    githubUrl: 'https://github.com/campus-ai/syllabus-search',
    createdAt: '2026-02-18T14:00:00Z',
  },
  {
    id: 'proj-3',
    ownerId: 'mentee-1',
    ownerName: 'Alex Chen',
    ownerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    ownerHeadline: 'Full-Stack Developer & ReactJS Specialist',
    ownerDepartment: 'Computer Science',
    title: 'DevCollab – Collaborative Canvas for Peer Whiteboarding',
    tagline: 'Infinite virtual canvas with synchronized code execution and live peer audio channels.',
    description: 'An open-source peer learning tool allowing students to visually diagram system designs, write code side-by-side, and run test suites directly in the browser.',
    category: 'Web & Cloud',
    status: 'in-progress',
    teamSize: 4,
    currentMembers: [
      {
        userId: 'mentee-1',
        name: 'Alex Chen',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
        role: 'Frontend Canvas Architect',
        skills: ['ReactJS', 'TypeScript', 'Canvas API'],
      },
    ],
    requiredSkills: ['ReactJS', 'WebSockets', 'WebRTC', 'Go', 'Docker'],
    openPositions: [
      {
        id: 'pos-4',
        title: 'Sandboxed Code Runner Backend Engineer',
        requiredSkills: ['Python', 'Docker', 'Go'],
        spots: 1,
        description: 'Build secure, isolated Docker container execution workers to run student code submissions safely.',
      },
    ],
    duration: '2 Months',
    milestones: [
      { id: 'm-7', title: 'Canvas Multi-Cursor Sync via CRDTs', dueDate: 'Nov 05', completed: true },
      { id: 'm-8', title: 'WebRTC Audio Channel Integration', dueDate: 'Nov 22', completed: false },
    ],
    applicationsCount: 4,
    githubUrl: 'https://github.com/alexchen/devcollab',
    createdAt: '2026-01-20T11:00:00Z',
  },
];

export const mockProjectApplications: ProjectApplication[] = [
  {
    id: 'app-1',
    projectId: 'proj-1',
    projectTitle: 'AgriPulse – IoT Smart Agriculture & Automated Irrigation',
    applicantId: 'mentee-1',
    applicantName: 'Alex Chen',
    applicantAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    applicantHeadline: 'Full-Stack Developer & ReactJS Specialist',
    appliedPositionId: 'pos-1',
    appliedPositionTitle: 'Web Dashboard & Cloud Integrator',
    pitch: 'I have extensive experience with ReactJS and WebSocket telemetry streaming. I would love to build the greenhouse control dashboard and learn IoT hardware integration from Marcus!',
    relevantSkills: ['ReactJS', 'TypeScript', 'Tailwind CSS', 'WebSockets'],
    status: 'pending',
    appliedAt: '2026-11-04T16:00:00Z',
  },
];
