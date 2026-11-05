import { User, MentorExpertise, TimeSlot, TutoringSession, Conversation, Message, SessionReview, Notification, Post, CommunityItem, SkillItem, Connection, Project, ProjectApplication } from '../../foundation/types';

// ============================================================
// SKILLBRIDGE 4.0 EXPANDED FICTIONAL STUDENT DATASET
// 38 University Students across 7 Engineering & Science Disciplines
// Distinct Complementary Pairs for Two-Way Skill Exchange
// ============================================================

export const mockUsers: User[] = [
  // ── MENTORS & PEER LEADERS ─────────────────────────────────
  {
    id: 'mentor-1', email: 'sarah.mentor@campus.edu', fullName: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', role: 'mentor', department: 'Computer Science', year: '4th Year',
    headline: 'Senior CS Student & ML Lead | Python, PyTorch & Distributed Systems',
    university: 'State Technological University',
    bio: 'Passionate about distributed algorithms, consensus mechanisms, and Python data pipelines. Looking to exchange Python and Machine Learning knowledge for modern ReactJS and frontend architecture.',
    joinedAt: '2025-08-15T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['visual', 'kinesthetic'], languages: ['English', 'Mandarin'],
    onlineStatus: 'available', portfolioUrl: 'https://sarahjenkins.dev', githubUrl: 'https://github.com/sarahjenkins', linkedinUrl: 'https://linkedin.com/in/sarahjenkins',
    availableDays: ['monday', 'wednesday', 'thursday'],
    skillsOffered: [
      { id: 'so-b1', userId: 'mentor-1', skillName: 'Python', proficiency: 'expert', intention: 'teach', yearsOfExperience: 3, preferredFormat: '1-on-1' },
      { id: 'so-b2', userId: 'mentor-1', skillName: 'Machine Learning', proficiency: 'advanced', intention: 'teach', yearsOfExperience: 2, preferredFormat: 'project-collab' },
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
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', role: 'mentor', department: 'Data Science', year: 'Alumni',
    headline: 'Machine Learning Engineer @ FAANG | Deep Learning Researcher',
    university: 'State Technological University',
    bio: 'ML engineer at a FAANG company. Love giving back by mentoring students in machine learning and Python. Published 3 research papers on deep learning.',
    joinedAt: '2025-06-10T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['reading', 'visual'], languages: ['English', 'Hindi'],
    onlineStatus: 'available', githubUrl: 'https://github.com/rajeshkumar', linkedinUrl: 'https://linkedin.com/in/rajeshkumar',
    availableDays: ['saturday', 'sunday'],
    skillsOffered: [
      { id: 'so-r1', userId: 'mentor-2', skillName: 'Machine Learning', proficiency: 'expert', intention: 'teach', yearsOfExperience: 4, preferredFormat: '1-on-1' },
      { id: 'so-r2', userId: 'mentor-2', skillName: 'Python', proficiency: 'expert', intention: 'teach', yearsOfExperience: 5, preferredFormat: '1-on-1' },
    ],
    skillsWanted: [
      { id: 'sw-r1', userId: 'mentor-2', skillName: 'Rust', proficiency: 'beginner', intention: 'learn', targetGoal: 'Systems programming for ML runtimes' },
    ],
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
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200', role: 'mentor', department: 'Mathematics', year: 'Alumni',
    headline: 'Mathematics PhD Candidate | Calculus, Linear Algebra & Discrete Math',
    university: 'State Technological University',
    bio: 'Math PhD candidate who believes every student can master calculus and linear algebra with the right approach. Patient, methodical teaching style.',
    joinedAt: '2025-05-20T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['reading', 'auditory'], languages: ['English', 'Spanish'],
    onlineStatus: 'offline', availableDays: ['monday', 'friday'],
    skillsOffered: [
      { id: 'so-mj1', userId: 'mentor-4', skillName: 'Engineering Mathematics', proficiency: 'expert', intention: 'teach', yearsOfExperience: 5 },
      { id: 'so-mj2', userId: 'mentor-4', skillName: 'Linear Algebra', proficiency: 'expert', intention: 'teach', yearsOfExperience: 5 },
    ],
    skillsWanted: [
      { id: 'sw-mj1', userId: 'mentor-4', skillName: 'Python', proficiency: 'intermediate', intention: 'learn', targetGoal: 'Scientific computation in NumPy' },
    ],
  },
  {
    id: 'mentor-5', email: 'priya.sharma@campus.edu', fullName: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200', role: 'mentor', department: 'Computer Science', year: '3rd Year',
    headline: 'Competitive Programmer (Candidate Master) | C++ & Advanced Algorithms',
    university: 'State Technological University',
    bio: 'Competitive programmer with 1800+ rating on Codeforces. Specialize in data structures and graph algorithms. Available for interview prep sessions.',
    joinedAt: '2025-10-05T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['kinesthetic', 'reading'], languages: ['English', 'Hindi'],
    onlineStatus: 'available', availableDays: ['tuesday', 'thursday', 'sunday'],
    skillsOffered: [
      { id: 'so-ps1', userId: 'mentor-5', skillName: 'C++', proficiency: 'expert', intention: 'teach', yearsOfExperience: 3 },
      { id: 'so-ps2', userId: 'mentor-5', skillName: 'Data Structures', proficiency: 'expert', intention: 'teach', yearsOfExperience: 3 },
    ],
    skillsWanted: [
      { id: 'sw-ps1', userId: 'mentor-5', skillName: 'Engineering Mathematics', proficiency: 'intermediate', intention: 'learn', targetGoal: 'Combinatorics and probability bounds' },
    ],
  },
  {
    id: 'mentor-6', email: 'james.wilson@campus.edu', fullName: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200', role: 'mentor', department: 'Information Technology', year: '4th Year',
    headline: 'Cloud & DevOps Practitioner | AWS Solutions Architect, Docker & CI/CD',
    university: 'State Technological University',
    bio: 'DevOps and cloud computing enthusiast. AWS certified. Enjoy teaching networking, operating systems, and deployment pipelines.',
    joinedAt: '2025-07-15T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['visual', 'auditory'], languages: ['English'],
    onlineStatus: 'available', availableDays: ['wednesday', 'friday', 'saturday'],
    skillsOffered: [
      { id: 'so-jw1', userId: 'mentor-6', skillName: 'Cloud Computing', proficiency: 'advanced', intention: 'teach', yearsOfExperience: 2 },
      { id: 'so-jw2', userId: 'mentor-6', skillName: 'Docker', proficiency: 'advanced', intention: 'teach', yearsOfExperience: 2 },
    ],
    skillsWanted: [
      { id: 'sw-jw1', userId: 'mentor-6', skillName: 'Cybersecurity', proficiency: 'beginner', intention: 'learn', targetGoal: 'Zero trust security architecture' },
    ],
  },
  {
    id: 'mentor-7', email: 'aisha.mohammed@campus.edu', fullName: 'Aisha Mohammed',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200', role: 'mentor', department: 'Computer Science', year: '4th Year',
    headline: 'Java & Spring Boot Engineer | Microservices & Distributed Architecture',
    university: 'State Technological University',
    bio: 'Java and enterprise software development specialist. Contributed to open-source Spring Boot projects. Passionate about clean code and scalable software design.',
    joinedAt: '2025-08-20T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['reading', 'kinesthetic'], languages: ['English', 'French'],
    onlineStatus: 'available', availableDays: ['monday', 'wednesday'],
    skillsOffered: [
      { id: 'so-am1', userId: 'mentor-7', skillName: 'Java', proficiency: 'expert', intention: 'teach', yearsOfExperience: 3 },
      { id: 'so-am2', userId: 'mentor-7', skillName: 'SQL', proficiency: 'advanced', intention: 'teach', yearsOfExperience: 3 },
    ],
    skillsWanted: [
      { id: 'sw-am1', userId: 'mentor-7', skillName: 'ReactJS', proficiency: 'beginner', intention: 'learn', targetGoal: 'Micro-frontends integration' },
    ],
  },
  {
    id: 'mentor-8', email: 'carlos.rodriguez@campus.edu', fullName: 'Carlos Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200', role: 'mentor', department: 'Electronics Engineering', year: '3rd Year',
    headline: 'Digital Electronics TA | Verilog, FPGA & Circuit Simulation',
    university: 'State Technological University',
    bio: 'Circuit design and signal processing whiz. Teaching assistant for Digital Electronics for 2 semesters. Great at visual explanations.',
    joinedAt: '2025-09-15T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['visual', 'kinesthetic'], languages: ['English', 'Spanish'],
    onlineStatus: 'busy', availableDays: ['tuesday', 'thursday'],
    skillsOffered: [
      { id: 'so-cr1', userId: 'mentor-8', skillName: 'Digital Electronics', proficiency: 'expert', intention: 'teach', yearsOfExperience: 2 },
      { id: 'so-cr2', userId: 'mentor-8', skillName: 'Circuit Analysis', proficiency: 'advanced', intention: 'teach', yearsOfExperience: 2 },
    ],
    skillsWanted: [
      { id: 'sw-cr1', userId: 'mentor-8', skillName: 'PCB Design', proficiency: 'beginner', intention: 'learn', targetGoal: 'Two-layer SMD board routing in KiCad' },
    ],
  },
  {
    id: 'mentor-9', email: 'nina.patel@campus.edu', fullName: 'Nina Patel',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', role: 'mentor', department: 'Computer Science', year: 'Alumni',
    headline: 'Senior Frontend Engineer @ FinTech | React, Next.js & Performance',
    university: 'State Technological University',
    bio: 'Senior developer at a fintech startup. Expert in TypeScript, React, and Node.js. Passionate about modern web development and accessibility.',
    joinedAt: '2025-04-10T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['visual', 'reading'], languages: ['English', 'Hindi'],
    onlineStatus: 'available', availableDays: ['saturday', 'sunday'],
    skillsOffered: [
      { id: 'so-np1', userId: 'mentor-9', skillName: 'ReactJS', proficiency: 'expert', intention: 'teach', yearsOfExperience: 4 },
      { id: 'so-np2', userId: 'mentor-9', skillName: 'Web Development', proficiency: 'expert', intention: 'teach', yearsOfExperience: 4 },
    ],
    skillsWanted: [
      { id: 'sw-np1', userId: 'mentor-9', skillName: 'Artificial Intelligence', proficiency: 'beginner', intention: 'learn', targetGoal: 'LLM agents and prompt engineering' },
    ],
  },
  {
    id: 'mentor-10', email: 'david.lee@campus.edu', fullName: 'David Lee',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200', role: 'mentor', department: 'Mechanical Engineering', year: '4th Year',
    headline: 'Thermal Sciences & CFD Specialist | Engineering Physics & Fluid Mechanics',
    university: 'State Technological University',
    bio: 'Top student in thermodynamics and fluid mechanics. Enjoy making complex physics concepts accessible through practical simulations.',
    joinedAt: '2025-08-01T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['auditory', 'kinesthetic'], languages: ['English', 'Mandarin'],
    onlineStatus: 'available', availableDays: ['monday', 'thursday'],
    skillsOffered: [
      { id: 'so-dl1', userId: 'mentor-10', skillName: 'Thermodynamics', proficiency: 'expert', intention: 'teach', yearsOfExperience: 3 },
      { id: 'so-dl2', userId: 'mentor-10', skillName: 'Engineering Mathematics', proficiency: 'advanced', intention: 'teach', yearsOfExperience: 3 },
    ],
    skillsWanted: [
      { id: 'sw-dl1', userId: 'mentor-10', skillName: 'Python', proficiency: 'beginner', intention: 'learn', targetGoal: 'Automating thermodynamic cycle calculations' },
    ],
  },
  {
    id: 'mentor-11', email: 'sophia.garcia@campus.edu', fullName: 'Sophia Garcia',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200', role: 'mentor', department: 'Computer Science', year: '3rd Year',
    headline: 'Frontend Engineer & UI Workshop Lead | React, Tailwind & UI/UX',
    university: 'State Technological University',
    bio: 'Full-stack web developer focused on modern JavaScript frameworks. Love creating interactive tutorials and coding workshops for campus peers.',
    joinedAt: '2025-10-01T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['visual', 'kinesthetic'], languages: ['English', 'Spanish'],
    onlineStatus: 'available', availableDays: ['tuesday', 'wednesday', 'friday'],
    skillsOffered: [
      { id: 'so-sg1', userId: 'mentor-11', skillName: 'ReactJS', proficiency: 'advanced', intention: 'teach', yearsOfExperience: 2 },
      { id: 'so-sg2', userId: 'mentor-11', skillName: 'Web Development', proficiency: 'advanced', intention: 'teach', yearsOfExperience: 2 },
    ],
    skillsWanted: [
      { id: 'sw-sg1', userId: 'mentor-11', skillName: 'UI/UX Design', proficiency: 'beginner', intention: 'learn', targetGoal: 'User research and Figma prototypes' },
    ],
  },
  {
    id: 'mentor-12', email: 'kevin.brown@campus.edu', fullName: 'Kevin Brown',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200', role: 'mentor', department: 'Information Technology', year: '4th Year',
    headline: 'Database Architect & SQL Optimization Lead | PostgreSQL & Systems',
    university: 'State Technological University',
    bio: 'Database and backend specialist. Expert in SQL, PostgreSQL, and system design. Great at breaking down complex query plans.',
    joinedAt: '2025-07-01T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['reading', 'auditory'], languages: ['English'],
    onlineStatus: 'available', availableDays: ['monday', 'wednesday'],
    skillsOffered: [
      { id: 'so-kb1', userId: 'mentor-12', skillName: 'SQL', proficiency: 'expert', intention: 'teach', yearsOfExperience: 3 },
      { id: 'so-kb2', userId: 'mentor-12', skillName: 'Database Management', proficiency: 'expert', intention: 'teach', yearsOfExperience: 3 },
    ],
    skillsWanted: [
      { id: 'sw-kb1', userId: 'mentor-12', skillName: 'Docker', proficiency: 'beginner', intention: 'learn', targetGoal: 'Database containerization & clustering' },
    ],
  },

  // ── MENTEES & COMPLEMENTARY COLLABORATORS ──────────────────
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
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200', role: 'mentee', department: 'Information Technology', year: '2nd Year',
    headline: 'UI/UX Product Designer | Figma Master seeking ReactJS Frontend Mentorship',
    university: 'State Technological University',
    bio: 'Passionate about human-centered design, micro-interactions, and accessibility. Offering deep Figma and wireframing guidance in return for React component building.',
    joinedAt: '2026-02-10T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['visual', 'auditory'], languages: ['English', 'Mandarin'],
    onlineStatus: 'available', availableDays: ['tuesday', 'wednesday', 'friday'],
    skillsOffered: [
      { id: 'so-jl1', userId: 'mentee-2', skillName: 'UI/UX Design', proficiency: 'expert', intention: 'teach', yearsOfExperience: 2 },
      { id: 'so-jl2', userId: 'mentee-2', skillName: 'Figma', proficiency: 'expert', intention: 'teach', yearsOfExperience: 2 },
    ],
    skillsWanted: [
      { id: 'sw-jl1', userId: 'mentee-2', skillName: 'ReactJS', proficiency: 'beginner', intention: 'learn', targetGoal: 'Building interactive design systems in code' },
    ],
  },
  {
    id: 'mentee-3', email: 'omar.hassan@campus.edu', fullName: 'Omar Hassan',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=200', role: 'mentee', department: 'Electronics Engineering', year: '2nd Year',
    headline: 'ECE Undergrad | Digital Logic & Embedded Hardware Enthusiast',
    university: 'State Technological University',
    bio: 'ECE student studying digital circuits and microcontroller interfacing. Seeking hands-on guidance on ESP32 telemetry.',
    joinedAt: '2026-01-20T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['kinesthetic', 'visual'], languages: ['English', 'Hindi'],
    onlineStatus: 'busy', availableDays: ['thursday', 'saturday'],
    skillsOffered: [
      { id: 'so-oh1', userId: 'mentee-3', skillName: 'Digital Electronics', proficiency: 'intermediate', intention: 'teach', yearsOfExperience: 1 },
    ],
    skillsWanted: [
      { id: 'sw-oh1', userId: 'mentee-3', skillName: 'ESP32', proficiency: 'beginner', intention: 'learn', targetGoal: 'Firmware programming with FreeRTOS' },
    ],
  },
  {
    id: 'mentee-4', email: 'mia.anderson@campus.edu', fullName: 'Mia Anderson',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200', role: 'mentee', department: 'Computer Science', year: '2nd Year',
    headline: 'Machine Learning Student | Python & PyTorch practitioner seeking Embedded C',
    university: 'State Technological University',
    bio: 'Focused on edge AI and computer vision. Offering Python machine learning guidance in exchange for embedded C and microcontroller hardware basics.',
    joinedAt: '2026-03-01T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['reading', 'visual'], languages: ['English'],
    onlineStatus: 'available', availableDays: ['tuesday', 'thursday', 'saturday'],
    skillsOffered: [
      { id: 'so-ma1', userId: 'mentee-4', skillName: 'Machine Learning', proficiency: 'advanced', intention: 'teach', yearsOfExperience: 2 },
      { id: 'so-ma2', userId: 'mentee-4', skillName: 'Python', proficiency: 'advanced', intention: 'teach', yearsOfExperience: 2 },
    ],
    skillsWanted: [
      { id: 'sw-ma1', userId: 'mentee-4', skillName: 'Embedded C', proficiency: 'beginner', intention: 'learn', targetGoal: 'Deploying quantized models to microcontrollers' },
      { id: 'sw-ma2', userId: 'mentee-4', skillName: 'ESP32', proficiency: 'beginner', intention: 'learn', targetGoal: 'Edge sensor processing' },
    ],
  },
  {
    id: 'mentee-5', email: 'ryan.park@campus.edu', fullName: 'Ryan Park',
    avatar: 'https://images.unsplash.com/photo-1480429370139-e0132c086e2a?w=200', role: 'mentee', department: 'Mechanical Engineering', year: '1st Year',
    headline: 'Mechanical Engineering Freshman | SolidWorks & CAD Modeler',
    university: 'State Technological University',
    bio: 'Passionate about 3D CAD modeling and mechanism design. Offering SolidWorks guidance in return for Engineering Mathematics problem solving.',
    joinedAt: '2026-02-15T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['auditory', 'reading'], languages: ['English'],
    onlineStatus: 'offline', availableDays: ['monday', 'friday'],
    skillsOffered: [
      { id: 'so-rp1', userId: 'mentee-5', skillName: 'AutoCAD', proficiency: 'intermediate', intention: 'teach', yearsOfExperience: 1 },
    ],
    skillsWanted: [
      { id: 'sw-rp1', userId: 'mentee-5', skillName: 'Engineering Mathematics', proficiency: 'beginner', intention: 'learn', targetGoal: 'Mastering multivariable calculus' },
    ],
  },
  {
    id: 'mentee-6', email: 'luna.martinez@campus.edu', fullName: 'Luna Martinez',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', role: 'mentee', department: 'Computer Science', year: '3rd Year',
    headline: 'Junior CS Major | LeetCode & Competitive Coding Enthusiast',
    university: 'State Technological University',
    bio: 'Solved 450+ DSA problems. Offering technical interview algorithms coaching in exchange for System Design and Cloud infrastructure guidance.',
    joinedAt: '2026-01-05T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['kinesthetic', 'reading'], languages: ['English', 'Spanish'],
    onlineStatus: 'available', availableDays: ['wednesday', 'friday'],
    skillsOffered: [
      { id: 'so-lm1', userId: 'mentee-6', skillName: 'Data Structures', proficiency: 'advanced', intention: 'teach', yearsOfExperience: 2 },
      { id: 'so-lm2', userId: 'mentee-6', skillName: 'C++', proficiency: 'advanced', intention: 'teach', yearsOfExperience: 2 },
    ],
    skillsWanted: [
      { id: 'sw-lm1', userId: 'mentee-6', skillName: 'Cloud Computing', proficiency: 'beginner', intention: 'learn', targetGoal: 'Building scalable microservices' },
    ],
  },
  {
    id: 'mentee-7', email: 'ethan.wright@campus.edu', fullName: 'Ethan Wright',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', role: 'mentee', department: 'Information Technology', year: '2nd Year',
    headline: 'IT Undergrad | Cloud Infrastructure, Docker & Linux Admin',
    university: 'State Technological University',
    bio: 'Linux and self-hosting enthusiast. Can teach server deployment, Docker compose, and reverse proxies in exchange for SQL query optimization.',
    joinedAt: '2026-02-20T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['visual', 'kinesthetic'], languages: ['English'],
    onlineStatus: 'available', availableDays: ['monday', 'wednesday'],
    skillsOffered: [
      { id: 'so-ew1', userId: 'mentee-7', skillName: 'Docker', proficiency: 'advanced', intention: 'teach', yearsOfExperience: 2 },
      { id: 'so-ew2', userId: 'mentee-7', skillName: 'Git', proficiency: 'expert', intention: 'teach', yearsOfExperience: 2 },
    ],
    skillsWanted: [
      { id: 'sw-ew1', userId: 'mentee-7', skillName: 'SQL', proficiency: 'beginner', intention: 'learn', targetGoal: 'Database indexing and execution plans' },
    ],
  },
  {
    id: 'mentee-8', email: 'zara.khan@campus.edu', fullName: 'Zara Khan',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200', role: 'mentee', department: 'Electrical Engineering', year: '2nd Year',
    headline: 'EE Undergrad | PCB Design & KiCad Specialist seeking Verilog Mentorship',
    university: 'State Technological University',
    bio: 'Designed 4 production hardware PCBs for campus rover club. Want to teach PCB design and schematic routing in return for digital logic & FPGA Verilog.',
    joinedAt: '2026-02-15T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['kinesthetic', 'visual'], languages: ['English', 'Urdu'],
    onlineStatus: 'available', availableDays: ['tuesday', 'thursday'],
    skillsOffered: [
      { id: 'so-zk1', userId: 'mentee-8', skillName: 'PCB Design', proficiency: 'advanced', intention: 'teach', yearsOfExperience: 2 },
      { id: 'so-zk2', userId: 'mentee-8', skillName: 'Circuit Analysis', proficiency: 'intermediate', intention: 'teach', yearsOfExperience: 1 },
    ],
    skillsWanted: [
      { id: 'sw-zk1', userId: 'mentee-8', skillName: 'Digital Electronics', proficiency: 'beginner', intention: 'learn', targetGoal: 'Writing synthesizable Verilog modules' },
    ],
  },

  // ── ADDITIONAL MULTI-DISCIPLINARY CAMPUS PEERS (20 MORE) ──
  {
    id: 'student-9', email: 'vikram.malhotra@campus.edu', fullName: 'Vikram Malhotra',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', role: 'mentee', department: 'Mechanical Engineering', year: '3rd Year',
    headline: 'Robotics Kinematics & 3D Prototyping Lead | Seeks ROS2 & Python Exchange',
    university: 'State Technological University',
    bio: 'Lead mechanical designer for the university autonomous drone team. Offering CAD and 3D printing expertise in return for ROS2 robotic control algorithms.',
    joinedAt: '2026-01-10T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['kinesthetic', 'visual'], languages: ['English', 'Hindi'],
    onlineStatus: 'available', availableDays: ['monday', 'wednesday', 'saturday'],
    skillsOffered: [
      { id: 'so-vm1', userId: 'student-9', skillName: 'AutoCAD', proficiency: 'expert', intention: 'teach', yearsOfExperience: 3 },
      { id: 'so-vm2', userId: 'student-9', skillName: 'Thermodynamics', proficiency: 'intermediate', intention: 'teach', yearsOfExperience: 2 },
    ],
    skillsWanted: [
      { id: 'sw-vm1', userId: 'student-9', skillName: 'Python', proficiency: 'beginner', intention: 'learn', targetGoal: 'Inverse kinematics scripting in ROS2' },
    ],
  },
  {
    id: 'student-10', email: 'arjun.nair@campus.edu', fullName: 'Arjun Nair',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200', role: 'mentee', department: 'Computer Science', year: '3rd Year',
    headline: 'Autonomous Robotics Software Engineer | ROS2, SLAM & Python Lead',
    university: 'State Technological University',
    bio: 'Software engineer focusing on SLAM, path planning, and robot perception. Seeking mechanical teammates for physical chassis and gimbal design.',
    joinedAt: '2026-01-12T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['visual', 'kinesthetic'], languages: ['English', 'Malayalam'],
    onlineStatus: 'available', availableDays: ['monday', 'wednesday', 'saturday'],
    skillsOffered: [
      { id: 'so-an1', userId: 'student-10', skillName: 'Python', proficiency: 'expert', intention: 'teach', yearsOfExperience: 3 },
      { id: 'so-an2', userId: 'student-10', skillName: 'Machine Learning', proficiency: 'advanced', intention: 'teach', yearsOfExperience: 2 },
    ],
    skillsWanted: [
      { id: 'sw-an1', userId: 'student-10', skillName: 'AutoCAD', proficiency: 'beginner', intention: 'learn', targetGoal: 'Chassis design and weight distribution' },
    ],
  },
  {
    id: 'student-11', email: 'kavita.reddy@campus.edu', fullName: 'Kavita Reddy',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200', role: 'mentee', department: 'Information Technology', year: '4th Year',
    headline: 'Cybersecurity Analyst & CTF Lead | Network Security & Penetration Testing',
    university: 'State Technological University',
    bio: 'Captain of the university CTF team. Passionate about web application penetration testing, cryptography, and network defense. Looking for Cloud/DevOps exchange.',
    joinedAt: '2025-09-10T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['kinesthetic', 'reading'], languages: ['English', 'Telugu'],
    onlineStatus: 'available', availableDays: ['wednesday', 'friday'],
    skillsOffered: [
      { id: 'so-kr1', userId: 'student-11', skillName: 'Cybersecurity', proficiency: 'expert', intention: 'teach', yearsOfExperience: 3 },
      { id: 'so-kr2', userId: 'student-11', skillName: 'Computer Networks', proficiency: 'expert', intention: 'teach', yearsOfExperience: 3 },
    ],
    skillsWanted: [
      { id: 'sw-kr1', userId: 'student-11', skillName: 'Cloud Computing', proficiency: 'beginner', intention: 'learn', targetGoal: 'Automating secure cloud infrastructure' },
    ],
  },
  {
    id: 'student-12', email: 'daniel.kim@campus.edu', fullName: 'Daniel Kim',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200', role: 'mentee', department: 'Electronics Engineering', year: '3rd Year',
    headline: 'FPGA Engineer & Hardware Accelerator Developer | Verilog & RISC-V',
    university: 'State Technological University',
    bio: 'Building open-source RISC-V cores on Xilinx FPGAs. Offering digital design tutorials in exchange for PCB layout and manufacturing review.',
    joinedAt: '2026-02-01T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['visual', 'kinesthetic'], languages: ['English', 'Korean'],
    onlineStatus: 'busy', availableDays: ['tuesday', 'thursday'],
    skillsOffered: [
      { id: 'so-dk1', userId: 'student-12', skillName: 'Digital Electronics', proficiency: 'advanced', intention: 'teach', yearsOfExperience: 2 },
    ],
    skillsWanted: [
      { id: 'sw-dk1', userId: 'student-12', skillName: 'PCB Design', proficiency: 'beginner', intention: 'learn', targetGoal: 'High-speed differential trace routing' },
    ],
  },
  {
    id: 'student-13', email: 'ananya.deshmukh@campus.edu', fullName: 'Ananya Deshmukh',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200', role: 'mentee', department: 'Data Science', year: '3rd Year',
    headline: 'NLP & LLM Researcher | Transformer Fine-tuning & Sentiment Systems',
    university: 'State Technological University',
    bio: 'Researching multi-lingual sentiment extraction using open-weight LLMs. Looking for web full-stack partners to build interactive demo interfaces.',
    joinedAt: '2026-01-18T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['reading', 'visual'], languages: ['English', 'Marathi'],
    onlineStatus: 'available', availableDays: ['monday', 'wednesday', 'friday'],
    skillsOffered: [
      { id: 'so-ad1', userId: 'student-13', skillName: 'Machine Learning', proficiency: 'expert', intention: 'teach', yearsOfExperience: 3 },
      { id: 'so-ad2', userId: 'student-13', skillName: 'Python', proficiency: 'expert', intention: 'teach', yearsOfExperience: 3 },
    ],
    skillsWanted: [
      { id: 'sw-ad1', userId: 'student-13', skillName: 'ReactJS', proficiency: 'beginner', intention: 'learn', targetGoal: 'Building browser visualizers for attention weights' },
    ],
  },
  {
    id: 'student-14', email: 'lucas.silva@campus.edu', fullName: 'Lucas Silva',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200', role: 'mentee', department: 'Civil Engineering', year: '3rd Year',
    headline: 'Structural Engineering & Smart Sensor Lead | Civil Infrastructure Telemetry',
    university: 'State Technological University',
    bio: 'Investigating structural health monitoring of bridges with strain gauges and vibration sensors. Looking for IoT and microcontroller collaboration.',
    joinedAt: '2026-02-12T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['visual', 'kinesthetic'], languages: ['English', 'Portuguese'],
    onlineStatus: 'available', availableDays: ['tuesday', 'thursday', 'saturday'],
    skillsOffered: [
      { id: 'so-ls1', userId: 'student-14', skillName: 'AutoCAD', proficiency: 'advanced', intention: 'teach', yearsOfExperience: 2 },
      { id: 'so-ls2', userId: 'student-14', skillName: 'Engineering Mathematics', proficiency: 'intermediate', intention: 'teach', yearsOfExperience: 2 },
    ],
    skillsWanted: [
      { id: 'sw-ls1', userId: 'student-14', skillName: 'ESP32', proficiency: 'beginner', intention: 'learn', targetGoal: 'Wireless strain gauge data logging' },
    ],
  },
  {
    id: 'student-15', email: 'rohan.mehta@campus.edu', fullName: 'Rohan Mehta',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200', role: 'mentee', department: 'Computer Science', year: '2nd Year',
    headline: 'Backend Systems Developer | Golang, Redis & High-Throughput APIs',
    university: 'State Technological University',
    bio: 'Building low-latency microservices with Golang. Looking to pair program with React developers to build full-stack campus tools.',
    joinedAt: '2026-02-05T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['reading', 'kinesthetic'], languages: ['English', 'Gujarati'],
    onlineStatus: 'available', availableDays: ['monday', 'wednesday'],
    skillsOffered: [
      { id: 'so-rm1', userId: 'student-15', skillName: 'SQL', proficiency: 'advanced', intention: 'teach', yearsOfExperience: 2 },
      { id: 'so-rm2', userId: 'student-15', skillName: 'Database Management', proficiency: 'advanced', intention: 'teach', yearsOfExperience: 2 },
    ],
    skillsWanted: [
      { id: 'sw-rm1', userId: 'student-15', skillName: 'ReactJS', proficiency: 'beginner', intention: 'learn', targetGoal: 'Admin dashboards and charts' },
    ],
  },
  {
    id: 'student-16', email: 'emily.watson@campus.edu', fullName: 'Emily Watson',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', role: 'mentee', department: 'Computer Science', year: '3rd Year',
    headline: 'Design Systems Architect | Accessible Components & UX Research',
    university: 'State Technological University',
    bio: 'Obsessed with accessibility, color contrast, and micro-interactions. Can teach UI/UX design and WCAG compliance in return for TypeScript and state management.',
    joinedAt: '2026-01-22T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['visual', 'auditory'], languages: ['English'],
    onlineStatus: 'available', availableDays: ['tuesday', 'friday'],
    skillsOffered: [
      { id: 'so-ew1', userId: 'student-16', skillName: 'UI/UX Design', proficiency: 'expert', intention: 'teach', yearsOfExperience: 3 },
      { id: 'so-ew2', userId: 'student-16', skillName: 'Tailwind CSS', proficiency: 'advanced', intention: 'teach', yearsOfExperience: 2 },
    ],
    skillsWanted: [
      { id: 'sw-ew1', userId: 'student-16', skillName: 'TypeScript', proficiency: 'beginner', intention: 'learn', targetGoal: 'Generic props and strict typing in React' },
    ],
  },
  {
    id: 'student-17', email: 'tariq.mansoor@campus.edu', fullName: 'Tariq Mansoor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', role: 'mentee', department: 'Electrical Engineering', year: '4th Year',
    headline: 'Power Electronics & Renewable Energy Lead | Inverters & Battery Mgmt',
    university: 'State Technological University',
    bio: 'Designing solar inverters and battery management circuits for campus solar vehicle. Offering circuit analysis in return for microcontroller C++.',
    joinedAt: '2025-08-30T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['kinesthetic', 'reading'], languages: ['English', 'Arabic'],
    onlineStatus: 'available', availableDays: ['monday', 'thursday'],
    skillsOffered: [
      { id: 'so-tm1', userId: 'student-17', skillName: 'Circuit Analysis', proficiency: 'expert', intention: 'teach', yearsOfExperience: 3 },
    ],
    skillsWanted: [
      { id: 'sw-tm1', userId: 'student-17', skillName: 'C++', proficiency: 'beginner', intention: 'learn', targetGoal: 'CAN bus communication firmware' },
    ],
  },
  {
    id: 'student-18', email: 'chloe.dubois@campus.edu', fullName: 'Chloe Dubois',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200', role: 'mentee', department: 'Computer Science', year: '3rd Year',
    headline: 'Computer Vision & Autonomous Robotics | OpenCV & Real-Time Tracking',
    university: 'State Technological University',
    bio: 'Working on real-time object detection and optical flow for quadcopters. Want to learn hardware ESP32 deployment from electronics students.',
    joinedAt: '2026-02-14T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['visual', 'kinesthetic'], languages: ['English', 'French'],
    onlineStatus: 'available', availableDays: ['tuesday', 'thursday', 'saturday'],
    skillsOffered: [
      { id: 'so-cd1', userId: 'student-18', skillName: 'Python', proficiency: 'advanced', intention: 'teach', yearsOfExperience: 2 },
      { id: 'so-cd2', userId: 'student-18', skillName: 'Machine Learning', proficiency: 'advanced', intention: 'teach', yearsOfExperience: 2 },
    ],
    skillsWanted: [
      { id: 'sw-cd1', userId: 'student-18', skillName: 'ESP32', proficiency: 'beginner', intention: 'learn', targetGoal: 'Running camera modules with edge AI' },
    ],
  },
  {
    id: 'student-19', email: 'maya.lin@campus.edu', fullName: 'Maya Lin',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200', role: 'mentee', department: 'Data Science', year: '2nd Year',
    headline: 'Data Visualization & Storytelling | D3.js, Tableau & Interactive Analytics',
    university: 'State Technological University',
    bio: 'Transforming complex statistical models into clear visual stories. Looking for React and Tailwind developers for interactive data dashboards.',
    joinedAt: '2026-03-02T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['visual', 'reading'], languages: ['English'],
    onlineStatus: 'available', availableDays: ['wednesday', 'friday'],
    skillsOffered: [
      { id: 'so-ml1', userId: 'student-19', skillName: 'Web Development', proficiency: 'intermediate', intention: 'teach', yearsOfExperience: 2 },
    ],
    skillsWanted: [
      { id: 'sw-ml1', userId: 'student-19', skillName: 'ReactJS', proficiency: 'beginner', intention: 'learn', targetGoal: 'D3 inside React component trees' },
    ],
  },
  {
    id: 'student-20', email: 'fatima.alzahra@campus.edu', fullName: 'Fatima Al-Zahra',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200', role: 'mentee', department: 'Computer Science', year: '3rd Year',
    headline: 'Bioinformatics & Computational Biology | Python, Sequence Analysis & ML',
    university: 'State Technological University',
    bio: 'Analyzing genomic data and protein structures with Python and Biopython. Looking for Cloud computing mentors to handle large-scale sequence datasets.',
    joinedAt: '2026-01-28T10:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: ['reading', 'visual'], languages: ['English', 'Arabic'],
    onlineStatus: 'available', availableDays: ['monday', 'friday'],
    skillsOffered: [
      { id: 'so-fa1', userId: 'student-20', skillName: 'Python', proficiency: 'advanced', intention: 'teach', yearsOfExperience: 3 },
      { id: 'so-fa2', userId: 'student-20', skillName: 'Data Structures', proficiency: 'advanced', intention: 'teach', yearsOfExperience: 2 },
    ],
    skillsWanted: [
      { id: 'sw-fa1', userId: 'student-20', skillName: 'Cloud Computing', proficiency: 'beginner', intention: 'learn', targetGoal: 'AWS batch processing pipelines' },
    ],
  },

  // ── CAMPUS ADMINISTRATOR ───────────────────────────────────
  {
    id: 'admin-1', email: 'admin@campus.edu', fullName: 'Campus Administration',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200', role: 'admin', department: 'Academic Affairs', year: 'Staff',
    headline: 'Dean of Student Learning Networks | Peer Tutoring & Safety Governance',
    university: 'State Technological University',
    bio: 'Oversees the university peer-to-peer knowledge network, safety reporting, verified mentor accreditations, and inter-departmental collaboration grants.',
    joinedAt: '2025-01-01T00:00:00Z', isVerified: true, isSuspended: false,
    learningPreferences: [], languages: ['English'], onlineStatus: 'available',
  },
];

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
// STUDYBRIDGE 2.0: PROFESSIONAL FEED POSTS
// ============================================================

export const mockPosts: Post[] = [
  {
    id: 'post-1',
    authorId: 'mentor-1',
    authorName: 'Sarah Jenkins',
    authorHeadline: 'Senior CS Student & ML Lead | State Tech University',
    authorDepartment: 'Computer Science',
    authorRole: 'mentor',
    content: 'Thrilled to share that our campus ML study group successfully trained our first distilled LLM model for the university library search system! We achieved 4.2x faster inference using quantized weights. Huge shoutout to Alex Chen who helped us build the React frontend visualizer through our SkillBridge mutual exchange. Building in public pays off!',
    postType: 'ACHIEVEMENT',
    tags: ['MachineLearning', 'PyTorch', 'SkillExchange', 'StudentSuccess'],
    createdAt: '2026-11-05T14:30:00Z',
    reactionsCount: 54,
    commentsCount: 9,
    sharesCount: 6,
    hasLiked: false,
    isSaved: true,
    comments: [
      {
        id: 'c-1',
        postId: 'post-1',
        authorId: 'mentee-1',
        authorName: 'Alex Chen',
        authorHeadline: 'Full-Stack Developer & ReactJS Specialist',
        content: 'Loved every bit of our skill exchange, Sarah! Teaching you React hooks while learning PyTorch tensor mechanics was 10x faster than reading solo documentation.',
        createdAt: '2026-11-05T15:10:00Z',
      },
      {
        id: 'c-2',
        postId: 'post-1',
        authorId: 'mentor-2',
        authorName: 'Rajesh Kumar',
        authorHeadline: 'ML Engineer @ FAANG',
        content: 'Phenomenal work Sarah and Alex! The attention latency curves look solid. Would love to review your model pruning strategy.',
        createdAt: '2026-11-05T16:05:00Z',
      },
    ],
  },
  {
    id: 'post-2',
    authorId: 'mentor-3',
    authorName: 'Marcus Vance',
    authorHeadline: 'Embedded Systems & IoT Hardware Lead',
    authorDepartment: 'Electronics Engineering',
    authorRole: 'mentor',
    content: 'Calling all IoT and Web developers! We just launched Project AgriPulse in ProjectSpace. We have the ESP32 circuit boards fabricated and firmware operational. Now seeking 1 ReactJS frontend lead for our greenhouse dashboard and 1 ML modeler for crop stress alerts. Check out our open roles in ProjectSpace!',
    postType: 'PROJECT_SHOWCASE',
    tags: ['IoT', 'ESP32', 'ProjectSpace', 'Collaborate', 'Hardware'],
    createdAt: '2026-11-05T11:00:00Z',
    reactionsCount: 41,
    commentsCount: 7,
    sharesCount: 8,
    hasLiked: true,
    isSaved: false,
    comments: [
      {
        id: 'c-3',
        postId: 'post-2',
        authorId: 'mentee-1',
        authorName: 'Alex Chen',
        authorHeadline: 'Full-Stack Developer & ReactJS Specialist',
        content: 'Just submitted my application for the Dashboard Lead role through ProjectSpace! I can build WebSocket streaming for the soil moisture graphs.',
        createdAt: '2026-11-05T11:45:00Z',
      },
      {
        id: 'c-4',
        postId: 'post-2',
        authorId: 'student-14',
                authorName: 'Lucas Silva',
        authorHeadline: 'Structural Engineering & Smart Sensors',
        content: 'The 3D printed weatherproof enclosures are ready in the campus makerspace, Marcus! Ready for field assembly.',
        createdAt: '2026-11-05T12:20:00Z',
      },
    ],
  },
  {
    id: 'post-3',
    authorId: 'mentee-2',
    authorName: 'Jessica Li',
    authorHeadline: 'UI/UX Product Designer | 2nd Year IT',
    authorDepartment: 'Information Technology',
    authorRole: 'mentee',
    content: 'Design Question: When designing dashboard interfaces for university students, do you prefer dense information views (like Linear/GitHub) or spacious card-based views? Currently prototyping the CampusTransit shuttle tracker in Figma and running user interviews this Thursday.',
    postType: 'ACADEMIC_QUESTION',
    tags: ['UIUX', 'Figma', 'ProductDesign', 'CampusTransit'],
    createdAt: '2026-11-04T18:20:00Z',
    reactionsCount: 29,
    commentsCount: 11,
    sharesCount: 3,
    hasLiked: false,
    isSaved: false,
    comments: [
      {
        id: 'c-5',
        postId: 'post-3',
        authorId: 'mentor-11',
        authorName: 'Sophia Garcia',
        authorHeadline: 'Frontend Engineer & Workshop Lead',
        content: 'Dense layouts for desktop power users, but generous tap targets (min 44px) on mobile transit views! Let me know if you want to test the React Native components.',
        createdAt: '2026-11-04T19:00:00Z',
      },
    ],
  },
  {
    id: 'post-4',
    authorId: 'student-11',
    authorName: 'Kavita Reddy',
    authorHeadline: 'Cybersecurity Analyst & CTF Lead',
    authorDepartment: 'Information Technology',
    authorRole: 'mentee',
    content: 'Security Alert & Learning Opportunity: Tomorrow evening at 6:00 PM, the campus Cybersecurity Club is hosting an interactive live CTF teardown in Turing Hall Room 302. We will analyze common vulnerabilities found in student web apps: CORS misconfigurations, JWT token storage in localStorage, and SQLi. Beginners welcome!',
    postType: 'OPPORTUNITY',
    tags: ['Cybersecurity', 'WebDev', 'CampusEvent', 'InfoSec'],
    createdAt: '2026-11-04T13:15:00Z',
    reactionsCount: 68,
    commentsCount: 14,
    sharesCount: 19,
    hasLiked: true,
    isSaved: true,
    comments: [
      {
        id: 'c-6',
        postId: 'post-4',
        authorId: 'mentor-6',
        authorName: 'James Wilson',
        authorHeadline: 'Cloud & DevOps Practitioner',
        content: 'Will be there! I can help demonstrate how containerizing services with unprivileged user namespaces prevents root escalation.',
        createdAt: '2026-11-04T14:00:00Z',
      },
    ],
  },
  {
    id: 'post-5',
    authorId: 'student-9',
    authorName: 'Vikram Malhotra',
    authorHeadline: 'Robotics Kinematics Lead | Mechanical Engineering',
    authorDepartment: 'Mechanical Engineering',
    authorRole: 'mentee',
    content: 'Milestone Reached: The AeroQuad robot leg linkage passed 10,000 continuous cycle stress tests on the hydraulic test bench without joint failure! Check out the SolidWorks FEA strain contour below. Next step: inverse kinematics calibration in ROS2.',
    postType: 'ACHIEVEMENT',
    tags: ['Robotics', 'SolidWorks', 'CAD', 'Kinematics', 'Mechatronics'],
    createdAt: '2026-11-03T16:40:00Z',
    reactionsCount: 47,
    commentsCount: 8,
    sharesCount: 4,
    hasLiked: false,
    isSaved: false,
    comments: [],
  },
  {
    id: 'post-6',
    authorId: 'mentor-5',
    authorName: 'Priya Sharma',
    authorHeadline: 'Candidate Master @ Codeforces | CS 3rd Year',
    authorDepartment: 'Computer Science',
    authorRole: 'mentor',
    content: 'Weekly DSA Tip: If you are preparing for technical campus interviews, stop memorizing DP matrices mechanically. Focus on the subproblem state space transition: can you express state(i) purely in terms of state(i-1) and state(i-2)? Conducting a 1-on-1 tutoring session on Tree DP this Thursday on SkillBridge.',
    postType: 'STANDARD',
    tags: ['Algorithms', 'LeetCode', 'InterviewPrep', 'DataStructures'],
    createdAt: '2026-11-03T10:15:00Z',
    reactionsCount: 83,
    commentsCount: 16,
    sharesCount: 22,
    hasLiked: true,
    isSaved: true,
    comments: [],
  },
  {
    id: 'post-7',
    authorId: 'student-20',
    authorName: 'Fatima Al-Zahra',
    authorHeadline: 'Computational Biology Researcher',
    authorDepartment: 'Computer Science',
    authorRole: 'mentee',
    content: 'Just published our open-source protein visualization tool "FoldLab" in ProjectSpace! If you know Three.js or WebGL shaders and want to contribute to cancer therapeutic docking simulations, drop an application or message me.',
    postType: 'PROJECT_SHOWCASE',
    tags: ['Biotechnology', 'ThreeJS', 'OpenSource', 'Research'],
    createdAt: '2026-11-02T15:20:00Z',
    reactionsCount: 39,
    commentsCount: 5,
    sharesCount: 7,
    hasLiked: false,
    isSaved: false,
    comments: [],
  },
];

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
// STUDYBRIDGE 2.0: SKILLS & ENDORSEMENTS
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
// STUDYBRIDGE 2.0: CONNECTIONS
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
    title: 'AgriPulse - IoT Smart Agriculture & Automated Irrigation',
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
        userId: 'student-14',
        name: 'Lucas Silva',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
        role: 'Sensor Enclosure & CAD',
        skills: ['AutoCAD', 'SolidWorks'],
      },
    ],
    requiredSkills: ['Embedded C', 'ESP32', 'ReactJS', 'Python', 'Machine Learning'],
    openPositions: [
      {
        id: 'pos-1',
        title: 'Web Dashboard & Cloud Integrator',
        requiredSkills: ['ReactJS', 'TypeScript', 'WebSockets'],
        spots: 1,
        description: 'Build a responsive live telemetry dashboard displaying soil moisture trends, pump controls, and automated alert rules.',
      },
      {
        id: 'pos-2',
        title: 'Crop Stress ML Modeler',
        requiredSkills: ['Python', 'Machine Learning', 'PyTorch'],
        spots: 1,
        description: 'Train lightweight edge inference models to predict wilting points and optimize irrigation scheduling.',
      },
    ],
    duration: '3 Months',
    milestones: [
      { id: 'm-1', title: 'Schematic Design & 2-Layer PCB Fabrication', dueDate: 'Nov 15', completed: true },
      { id: 'm-2', title: 'ESP32 Deep-Sleep Firmware & MQTT Broker Integration', dueDate: 'Nov 28', completed: true },
      { id: 'm-3', title: 'React Web Telemetry Dashboard Beta Launch', dueDate: 'Dec 10', completed: false },
      { id: 'm-4', title: 'Greenhouse Field Trial & Power Benchmarking', dueDate: 'Dec 20', completed: false },
    ],
    applicationsCount: 3,
    githubUrl: 'https://github.com/marcusvance/agripulse-iot',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'proj-2',
    ownerId: 'mentor-1',
    ownerName: 'Sarah Jenkins',
    ownerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    ownerHeadline: 'Senior CS Student & ML Lead',
    ownerDepartment: 'Computer Science',
    title: 'CampusMind - Neural Syllabus & Lecture Search Engine',
    tagline: 'Semantic vector search across lecture recordings, course slides, and past examinations.',
    description: 'A privacy-first semantic retrieval engine indexing professor course notes, audio transcripts, and lecture PDFs. Allows students to search by concept (e.g. "Eigenvalue decomposition examples") and highlights the exact timestamp and textbook reference.',
    category: 'AI & Machine Learning',
    status: 'recruiting',
    teamSize: 5,
    currentMembers: [
      {
        userId: 'mentor-1',
        name: 'Sarah Jenkins',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        role: 'ML & Vector Indexing Lead',
        skills: ['Python', 'PyTorch', 'Vector Embeddings'],
      },
      {
        userId: 'student-13',
        name: 'Ananya Deshmukh',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
        role: 'NLP & Tokenization',
        skills: ['Transformers', 'FastAPI'],
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
    title: 'DevCollab - Collaborative Canvas for Peer Whiteboarding',
    tagline: 'Infinite virtual canvas with synchronized code execution and live peer audio channels.',
    description: 'An open-source peer learning tool allowing students to visually diagram system designs, write code side-by-side, and run test suites directly in the browser.',
    category: 'Web & Cloud',
    status: 'recruiting',
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
  {
    id: 'proj-4',
    ownerId: 'student-9',
    ownerName: 'Vikram Malhotra',
    ownerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    ownerHeadline: 'Robotics Kinematics Lead',
    ownerDepartment: 'Mechanical Engineering',
    title: 'AeroQuad - Autonomous Quadruped Delivery Robot',
    tagline: 'Four-legged robotic platform for inter-building campus package & lab sample transit.',
    description: 'Designing an electric quadruped with compliance actuators, inverse kinematics, and obstacle avoidance. Seeking ROS2 software engineers and battery management specialists.',
    category: 'Robotics',
    status: 'recruiting',
    teamSize: 5,
    currentMembers: [
      {
        userId: 'student-9',
        name: 'Vikram Malhotra',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        role: 'Mechanical Chassis & Linkages',
        skills: ['SolidWorks', 'AutoCAD', 'Kinematics'],
      },
      {
        userId: 'student-10',
        name: 'Arjun Nair',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200',
        role: 'Perception & SLAM',
        skills: ['ROS2', 'Python', 'C++'],
      },
    ],
    requiredSkills: ['SolidWorks', 'ROS2', 'C++', 'Circuit Analysis', 'Python'],
    openPositions: [
      {
        id: 'pos-5',
        title: 'Motor Controller Firmware Engineer',
        requiredSkills: ['C++', 'Embedded C', 'CAN Bus'],
        spots: 1,
        description: 'Write brushless motor FOC control algorithms with encoder feedback on STM32.',
      },
    ],
    duration: '6 Months',
    milestones: [
      { id: 'm-9', title: 'Single Leg Torque & Drop Testing', dueDate: 'Dec 01', completed: false },
      { id: 'm-10', title: 'Full Chassis Assembled & Standup Test', dueDate: 'Jan 15', completed: false },
    ],
    applicationsCount: 5,
    githubUrl: 'https://github.com/campus-robotics/aeroquad',
    createdAt: '2026-02-01T09:00:00Z',
  },
  {
    id: 'proj-5',
    ownerId: 'student-11',
    ownerName: 'Kavita Reddy',
    ownerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    ownerHeadline: 'Cybersecurity Analyst & CTF Lead',
    ownerDepartment: 'Information Technology',
    title: 'ZeroShield - Open Source Campus WAF & Threat Intelligence',
    tagline: 'Distributed reverse-proxy with automated IP reputation and bot defense for student sites.',
    description: 'An open-source Web Application Firewall engineered specifically to protect student-hosted capstone projects and campus club servers against DDoS, credential stuffing, and SQL injection.',
    category: 'Cybersecurity',
    status: 'recruiting',
    teamSize: 4,
    currentMembers: [
      {
        userId: 'student-11',
        name: 'Kavita Reddy',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
        role: 'Rule Engine & SecOps Lead',
        skills: ['Cybersecurity', 'Networks', 'Python'],
      },
    ],
    requiredSkills: ['Cybersecurity', 'Docker', 'Go', 'ReactJS', 'Computer Networks'],
    openPositions: [
      {
        id: 'pos-6',
        title: 'Real-Time Threat Dashboard Lead',
        requiredSkills: ['ReactJS', 'TypeScript', 'Tailwind CSS'],
        spots: 1,
        description: 'Build live geographic attack maps and rule configuration panels for system administrators.',
      },
    ],
    duration: '3 Months',
    milestones: [
      { id: 'm-11', title: 'eBPF Kernel Packet Filter Implementation', dueDate: 'Nov 18', completed: true },
      { id: 'm-12', title: 'Rule Parser & Benchmark Under 10Gbps Traffic', dueDate: 'Dec 05', completed: false },
    ],
    applicationsCount: 3,
    githubUrl: 'https://github.com/kavitareddy/zeroshield',
    createdAt: '2026-02-10T12:00:00Z',
  },
  {
    id: 'proj-6',
    ownerId: 'mentee-2',
    ownerName: 'Jessica Li',
    ownerAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200',
    ownerHeadline: 'UI/UX Product Designer',
    ownerDepartment: 'Information Technology',
    title: 'CampusTransit - Real-Time University Shuttle & Accessibility Tracker',
    tagline: 'Crowdsourced GPS shuttle tracking with wheelchair ramp availability and route predictions.',
    description: 'University shuttle delays cause students to miss morning classes. CampusTransit uses GPS beacons and crowdsourced commuter pings to provide live ETA predictions, seat availability, and wheelchair accessibility statuses across all 4 campus lines.',
    category: 'Mobile Apps',
    status: 'recruiting',
    teamSize: 4,
    currentMembers: [
      {
        userId: 'mentee-2',
        name: 'Jessica Li',
        avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200',
        role: 'Lead UX Researcher & Designer',
        skills: ['UI/UX Design', 'Figma', 'User Research'],
      },
    ],
    requiredSkills: ['React Native', 'Figma', 'TypeScript', 'Node.js', 'Google Maps API'],
    openPositions: [
      {
        id: 'pos-7',
        title: 'React Native Mobile Developer',
        requiredSkills: ['React Native', 'TypeScript', 'Mobile Development'],
        spots: 2,
        description: 'Implement offline-first transit maps and live driver GPS synchronization using Expo.',
      },
    ],
    duration: '2.5 Months',
    milestones: [
      { id: 'm-13', title: 'Interactive Figma Prototype User Testing', dueDate: 'Nov 10', completed: true },
      { id: 'm-14', title: 'Pilot Test on North Campus Shuttle Line', dueDate: 'Dec 02', completed: false },
    ],
    applicationsCount: 6,
    githubUrl: 'https://github.com/campustransit/transit-app',
    createdAt: '2026-02-05T08:00:00Z',
  },
  {
    id: 'proj-7',
    ownerId: 'student-17',
    ownerName: 'Tariq Mansoor',
    ownerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    ownerHeadline: 'Power Electronics Lead',
    ownerDepartment: 'Electrical Engineering',
    title: 'SolarGrid - Smart Microgrid Energy Storage & Battery Management',
    tagline: 'Bi-directional DC-DC buck/boost converter with active cell balancing for campus solar carport.',
    description: 'Creating an intelligent battery management system (BMS) for repurposing used EV battery modules into stationary storage for the campus engineering building solar panels.',
    category: 'Electronics',
    status: 'recruiting',
    teamSize: 4,
    currentMembers: [
      {
        userId: 'student-17',
        name: 'Tariq Mansoor',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        role: 'Power Inverter & BMS Hardware',
        skills: ['Circuit Analysis', 'Power Electronics', 'PCB Design'],
      },
    ],
    requiredSkills: ['Circuit Analysis', 'Embedded C', 'Python', 'PCB Design'],
    openPositions: [
      {
        id: 'pos-8',
        title: 'Telemetry & SoC State Estimation Lead',
        requiredSkills: ['Python', 'Embedded C', 'Data Structures'],
        spots: 1,
        description: 'Implement Extended Kalman Filter (EKF) algorithms on microcontrollers to estimate battery State-of-Charge accurately.',
      },
    ],
    duration: '5 Months',
    milestones: [
      { id: 'm-15', title: 'Power Stage SPICE Simulation & Thermal Sizing', dueDate: 'Nov 14', completed: true },
      { id: 'm-16', title: '48V 2kWh Battery Pack Bench Commissioning', dueDate: 'Dec 12', completed: false },
    ],
    applicationsCount: 2,
    githubUrl: 'https://github.com/campus-green/solargrid-bms',
    createdAt: '2026-01-25T15:00:00Z',
  },
  {
    id: 'proj-8',
    ownerId: 'student-20',
    ownerName: 'Fatima Al-Zahra',
    ownerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
    ownerHeadline: 'Computational Biology Researcher',
    ownerDepartment: 'Computer Science',
    title: 'FoldLab - WebGL Macromolecular Protein Complex Visualizer',
    tagline: 'Browser-based 3D visualization and docking simulation for pharmaceutical target research.',
    description: 'An interactive scientific web tool enabling undergraduate biochemistry students to view AlphaFold predicted structures, rotate ligand binding pockets in WebGL, and highlight mutation sites.',
    category: 'EdTech & SaaS',
    status: 'recruiting',
    teamSize: 3,
    currentMembers: [
      {
        userId: 'student-20',
        name: 'Fatima Al-Zahra',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
        role: 'Bioinformatics Lead',
        skills: ['Python', 'Data Structures', 'Machine Learning'],
      },
    ],
    requiredSkills: ['ReactJS', 'Three.js', 'Python', 'WebGL', 'TypeScript'],
    openPositions: [
      {
        id: 'pos-9',
        title: 'Three.js / WebGL 3D Shader Specialist',
        requiredSkills: ['ReactJS', 'Three.js', 'TypeScript'],
        spots: 1,
        description: 'Build ribbon renderings, electrostatic surface shaders, and smooth camera rotations for PDB/mmCIF files.',
      },
    ],
    duration: '3 Months',
    milestones: [
      { id: 'm-17', title: 'PDB Parser & Coordinate Normalization Pipeline', dueDate: 'Nov 20', completed: true },
      { id: 'm-18', title: 'Interactive Binding Pocket Measurement Tools', dueDate: 'Dec 08', completed: false },
    ],
    applicationsCount: 4,
    githubUrl: 'https://github.com/bio-ai/foldlab-webgl',
    createdAt: '2026-02-12T16:00:00Z',
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
