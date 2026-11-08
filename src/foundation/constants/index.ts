export const APP_NAME = 'SkillBridge';
export const APP_TAGLINE = 'Learn Together. Build Together. Grow Together.';
export const APP_DESCRIPTION = 'Peer-to-Peer Campus Skill Exchange & Collaborative Community';

export const DEMO_CREDENTIALS = {
  admin: { email: 'admin@campus.edu', password: 'admin1234' },
  student: { email: 'rohit.gupta@campus.edu', password: 'demo1234' },
  mentor: { email: 'nyoimei.konyak@campus.edu', password: 'demo1234' },
  rohit: { email: 'rohit.gupta@campus.edu', password: 'demo1234' },
  vidya: { email: 'vidya.gupta@campus.edu', password: 'demo1234' },
  nyoimei: { email: 'nyoimei.konyak@campus.edu', password: 'demo1234' },
  salini: { email: 'devrapalli.salini@campus.edu', password: 'demo1234' },
  kasturika: { email: 'kasturika.narzary@campus.edu', password: 'demo1234' },
  betimansa: { email: 'betimansa.chang@campus.edu', password: 'demo1234' },
};

export const MATCH_WEIGHTS = {
  topicRelevance: 0.35,
  availabilityCompatibility: 0.25,
  mentorRating: 0.20,
  skillProficiency: 0.10,
  learningPreference: 0.10,
} as const;

export const CATEGORIES = {
  technical: [
    'ReactJS', 'Python', 'C++', 'Java', 'Machine Learning',
    'Web Development', 'IoT', 'Embedded Systems', 'JavaScript',
    'TypeScript', 'Node.js', 'SQL', 'Git', 'Docker',
  ],
  academic: [
    'Engineering Mathematics', 'Thermodynamics', 'Digital Electronics',
    'Data Structures', 'Operating Systems', 'Computer Networks',
    'Database Management', 'Software Engineering', 'Linear Algebra',
    'Probability & Statistics', 'Discrete Mathematics', 'Circuit Analysis',
  ],
} as const;

export const ALL_TOPICS = [...CATEGORIES.technical, ...CATEGORIES.academic];

export const DAYS_OF_WEEK = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
] as const;

export const DAY_LABELS: Record<string, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed',
  thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
};

export const LANGUAGES = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese'];

export const DEPARTMENTS = [
  'Computer Science', 'Information Technology', 'Electronics Engineering',
  'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
  'Chemical Engineering', 'Mathematics', 'Physics',
];

export const AVATAR_COLORS = [
  '#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#ec4899', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316',
];
