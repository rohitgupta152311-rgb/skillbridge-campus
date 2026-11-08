import {
  User, MentorExpertise, TimeSlot, TutoringSession,
  Conversation, Message, SessionReview, Notification, UserReport,
  Post, CommunityItem, SkillItem, Connection, Project, ProjectApplication, TwoWayMatch
} from '../../foundation/types';

// ==========================================
// INSTITUTIONAL CAMPUS USERS (NIT NAGALAND EEE)
// ==========================================
export const mockUsers: User[] = [
  // 0. Platform Administrator: Admin (Hidden from public student discovery; can direct message anyone)
  {
    id: 'user-admin',
    email: 'admin@campus.edu',
    fullName: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
    role: 'admin',
    department: 'Campus Administration',
    year: 'System Administrator',
    university: 'SkillBridge Campus Governance',
    headline: 'Platform Administrator & Safety Governance',
    bio: 'Chief Platform Administrator overseeing student safety, verification, report audits, and direct campus announcements.',
    joinedAt: '2024-01-01T00:00:00Z',
    isVerified: true,
    isSuspended: false,
    learningPreferences: ['visual'],
    languages: ['English', 'Hindi'],
    onlineStatus: 'available',
    skillsOffered: [],
    skillsWanted: [],
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    badges: [
      { id: 'b-admin-shield', title: 'Campus Admin', icon: 'Shield', tier: 'gold', description: 'Institutional Safety & Governance Lead', earnedAt: '2024-01-01' },
    ],
  },

  // 1. Rohit Gupta (NIT Nagaland - Electrical & Electronics Engineering)
  {
    id: 'user-rohit',
    email: 'rohit.gupta@campus.edu',
    fullName: 'Rohit Gupta',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces',
    role: 'mentor',
    department: 'Electrical & Electronics Engineering',
    year: '2nd Year',
    university: 'National Institute of Technology (NIT) Nagaland',
    headline: 'EEE Student | NIT Nagaland | Power Electronics & Embedded IoT',
    bio: 'Electrical & Electronics Engineering student at NIT Nagaland. Specializing in power electronic converters, MATLAB Simulink modeling, IoT telemetry, and embedded microcontrollers. Passionate about reciprocal technical skill exchange and engineering project collaboration.',
    joinedAt: '2024-09-01T00:00:00Z',
    isVerified: true,
    isSuspended: false,
    learningPreferences: ['visual', 'kinesthetic'],
    languages: ['English', 'Hindi'],
    onlineStatus: 'available',
    githubUrl: 'https://github.com/rohitgupta-nitn',
    linkedinUrl: 'https://linkedin.com/in/rohitgupta-nitn',
    skillsOffered: [
      { skillName: 'Power Electronics', proficiency: 'expert', yearsExperience: 2.5 },
      { skillName: 'Circuit Analysis', proficiency: 'advanced', yearsExperience: 2.5 },
      { skillName: 'MATLAB & Simulink', proficiency: 'advanced', yearsExperience: 2 },
      { skillName: 'Embedded Systems & IoT', proficiency: 'intermediate', yearsExperience: 2 },
    ],
    skillsWanted: [
      { skillName: 'Full-Stack Web Development', proficiency: 'beginner', yearsExperience: 0 },
      { skillName: 'Python & Machine Learning', proficiency: 'beginner', yearsExperience: 0 },
      { skillName: 'ReactJS', proficiency: 'beginner', yearsExperience: 0 },
      { skillName: 'Data Structures & Algorithms', proficiency: 'beginner', yearsExperience: 0 },
    ],
    availableDays: ['monday', 'wednesday', 'friday', 'saturday'],
    badges: [
      { id: 'b-rohit-1', title: 'Circuit Specialist', icon: 'Zap', tier: 'gold', description: 'Led 10+ peer workshops on power electronic circuits', earnedAt: '2024-10-15' },
      { id: 'b-rohit-2', title: 'Hardware Innovator', icon: 'Cpu', tier: 'gold', description: 'Built IoT microgrid monitor prototype at NIT Nagaland lab', earnedAt: '2024-11-01' },
    ],
  },

  // 2. Vidya Gupta (NIT Nagaland - Electrical & Electronics Engineering)
  {
    id: 'user-vidya',
    email: 'vidya.gupta@campus.edu',
    fullName: 'Vidya Gupta',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces',
    role: 'mentor',
    department: 'Electrical & Electronics Engineering',
    year: '2nd Year',
    university: 'National Institute of Technology (NIT) Nagaland',
    headline: 'EEE Student | NIT Nagaland | Power Electronics & MATLAB Simulink',
    bio: 'Electrical & Electronics Engineering student at NIT Nagaland. Passionate about power electronics, circuit simulations in MATLAB, and control systems. Eager to barter engineering mathematics and circuit design for web programming basics.',
    joinedAt: '2024-09-01T00:00:00Z',
    isVerified: true,
    isSuspended: false,
    learningPreferences: ['visual', 'reading'],
    languages: ['English', 'Hindi'],
    onlineStatus: 'available',
    githubUrl: 'https://github.com/vidyagupta-dev',
    linkedinUrl: 'https://linkedin.com/in/vidyagupta-nitn',
    skillsOffered: [
      { skillName: 'Power Electronics', proficiency: 'expert', yearsExperience: 2.5 },
      { skillName: 'MATLAB', proficiency: 'advanced', yearsExperience: 2 },
      { skillName: 'Circuit Analysis', proficiency: 'advanced', yearsExperience: 2.5 },
      { skillName: 'Control Systems', proficiency: 'intermediate', yearsExperience: 1.5 },
    ],
    skillsWanted: [
      { skillName: 'Embedded C', proficiency: 'beginner', yearsExperience: 0 },
      { skillName: 'Microcontrollers', proficiency: 'beginner', yearsExperience: 0 },
      { skillName: 'Python', proficiency: 'beginner', yearsExperience: 0 },
      { skillName: 'ReactJS', proficiency: 'beginner', yearsExperience: 0 },
    ],
    availableDays: ['tuesday', 'thursday', 'saturday'],
    badges: [
      { id: 'b21', title: 'Circuit Specialist', icon: 'Zap', tier: 'gold', description: 'Led 12 peer workshops on circuit design', earnedAt: '2024-10-15' },
    ],
  },

  // 3. Nyoimei C Konyak (NIT Nagaland - Electrical & Electronics Engineering)
  {
    id: 'user-nyoimei',
    email: 'nyoimei.konyak@campus.edu',
    fullName: 'Nyoimei C Konyak',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
    role: 'mentor',
    department: 'Electrical & Electronics Engineering',
    year: '2nd Year',
    university: 'National Institute of Technology (NIT) Nagaland',
    headline: 'EEE Student | NIT Nagaland | Embedded Systems & Microcontrollers',
    bio: 'Electrical & Electronics Engineering student at NIT Nagaland. Specializing in microcontrollers (8051, ARM), embedded C programming, and smart grid automation. Love peer-to-peer technical exchange and hardware building.',
    joinedAt: '2024-09-05T00:00:00Z',
    isVerified: true,
    isSuspended: false,
    learningPreferences: ['kinesthetic', 'visual'],
    languages: ['English', 'Hindi', 'Nagamese'],
    onlineStatus: 'available',
    githubUrl: 'https://github.com/nyoimei-konyak',
    linkedinUrl: 'https://linkedin.com/in/nyoimei-konyak',
    skillsOffered: [
      { skillName: 'Embedded C', proficiency: 'expert', yearsExperience: 2.5 },
      { skillName: 'Microcontrollers', proficiency: 'advanced', yearsExperience: 2 },
      { skillName: 'Circuit Analysis', proficiency: 'advanced', yearsExperience: 2.5 },
      { skillName: 'IoT', proficiency: 'advanced', yearsExperience: 2 },
    ],
    skillsWanted: [
      { skillName: 'Power Electronics', proficiency: 'beginner', yearsExperience: 0 },
      { skillName: 'MATLAB', proficiency: 'beginner', yearsExperience: 0 },
      { skillName: 'Python', proficiency: 'beginner', yearsExperience: 0 },
    ],
    availableDays: ['monday', 'wednesday', 'saturday'],
    badges: [
      { id: 'b22', title: 'Hardware Innovator', icon: 'Cpu', tier: 'gold', description: 'Built automated smart energy switch', earnedAt: '2024-10-20' },
    ],
  },

  // 4. Devrapalli Salini (NIT Nagaland - Electrical & Electronics Engineering)
  {
    id: 'user-salini',
    email: 'devrapalli.salini@campus.edu',
    fullName: 'Devrapalli Salini',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=faces',
    role: 'mentor',
    department: 'Electrical & Electronics Engineering',
    year: '2nd Year',
    university: 'National Institute of Technology (NIT) Nagaland',
    headline: 'EEE Student | NIT Nagaland | Renewable Energy & Solar PV Systems',
    bio: 'Electrical & Electronics Engineering student at NIT Nagaland. Researching solar microgrid controllers, battery energy storage systems, and power quality analysis. Looking to collaborate with peer developers on smart energy apps.',
    joinedAt: '2024-08-20T00:00:00Z',
    isVerified: true,
    isSuspended: false,
    learningPreferences: ['visual', 'reading'],
    languages: ['English', 'Telugu', 'Hindi'],
    onlineStatus: 'available',
    githubUrl: 'https://github.com/salini-devrapalli',
    linkedinUrl: 'https://linkedin.com/in/devrapalli-salini',
    skillsOffered: [
      { skillName: 'Power Systems', proficiency: 'expert', yearsExperience: 3 },
      { skillName: 'Solar Energy', proficiency: 'advanced', yearsExperience: 2.5 },
      { skillName: 'MATLAB', proficiency: 'advanced', yearsExperience: 2 },
      { skillName: 'Electrical Machines', proficiency: 'advanced', yearsExperience: 2.5 },
    ],
    skillsWanted: [
      { skillName: 'ReactJS', proficiency: 'beginner', yearsExperience: 0 },
      { skillName: 'Data Analytics', proficiency: 'beginner', yearsExperience: 0 },
      { skillName: 'Tailwind CSS', proficiency: 'beginner', yearsExperience: 0 },
    ],
    availableDays: ['tuesday', 'thursday', 'sunday'],
    badges: [
      { id: 'b23', title: 'Clean Tech Scholar', icon: 'Award', tier: 'gold', description: 'Presented solar microgrid study at IEEE student chapter', earnedAt: '2024-09-30' },
    ],
  },

  // 5. Kasturika Narzary (NIT Nagaland - Electrical & Electronics Engineering)
  {
    id: 'user-kasturika',
    email: 'kasturika.narzary@campus.edu',
    fullName: 'Kasturika Narzary',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces',
    role: 'mentor',
    department: 'Electrical & Electronics Engineering',
    year: '2nd Year',
    university: 'National Institute of Technology (NIT) Nagaland',
    headline: 'EEE Student | NIT Nagaland | VLSI Design & Digital Electronics',
    bio: 'Electrical & Electronics Engineering student at NIT Nagaland. Passionate about digital logic design, Verilog RTL, FPGA prototyping, and PCB layout design in KiCAD. Happy to teach digital circuits in exchange for frontend skills.',
    joinedAt: '2024-09-10T00:00:00Z',
    isVerified: true,
    isSuspended: false,
    learningPreferences: ['visual', 'kinesthetic'],
    languages: ['English', 'Assamese', 'Hindi', 'Bodo'],
    onlineStatus: 'available',
    githubUrl: 'https://github.com/kasturika-narzary',
    linkedinUrl: 'https://linkedin.com/in/kasturika-narzary',
    skillsOffered: [
      { skillName: 'Digital Electronics', proficiency: 'expert', yearsExperience: 2.5 },
      { skillName: 'Verilog', proficiency: 'advanced', yearsExperience: 2 },
      { skillName: 'PCB Design', proficiency: 'advanced', yearsExperience: 2 },
      { skillName: 'Circuit Analysis', proficiency: 'advanced', yearsExperience: 2.5 },
    ],
    skillsWanted: [
      { skillName: 'ReactJS', proficiency: 'beginner', yearsExperience: 0 },
      { skillName: 'Python', proficiency: 'beginner', yearsExperience: 0 },
      { skillName: 'Figma', proficiency: 'beginner', yearsExperience: 0 },
    ],
    availableDays: ['monday', 'friday', 'saturday'],
    badges: [
      { id: 'b24', title: 'VLSI Pioneer', icon: 'Zap', tier: 'silver', description: 'Designed 4-bit ALU on Spartan FPGA', earnedAt: '2024-10-18' },
    ],
  },

  // 6. Betimansa S Chang (NIT Nagaland - Electrical & Electronics Engineering)
  {
    id: 'user-betimansa',
    email: 'betimansa.chang@campus.edu',
    fullName: 'Betimansa S Chang',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces',
    role: 'mentor',
    department: 'Electrical & Electronics Engineering',
    year: '2nd Year',
    university: 'National Institute of Technology (NIT) Nagaland',
    headline: 'EEE Student | NIT Nagaland | Electric Vehicle BMS & IoT Hardware',
    bio: 'Electrical & Electronics Engineering student at NIT Nagaland. Building battery management systems (BMS) for electric vehicles and sensor telemetry with ESP32. Eager to swap hardware guidance for modern web dashboard development.',
    joinedAt: '2024-08-25T00:00:00Z',
    isVerified: true,
    isSuspended: false,
    learningPreferences: ['kinesthetic', 'visual'],
    languages: ['English', 'Nagamese', 'Hindi'],
    onlineStatus: 'available',
    githubUrl: 'https://github.com/betimansa-chang',
    linkedinUrl: 'https://linkedin.com/in/betimansa-chang',
    skillsOffered: [
      { skillName: 'Embedded Systems', proficiency: 'expert', yearsExperience: 3 },
      { skillName: 'IoT', proficiency: 'advanced', yearsExperience: 2.5 },
      { skillName: 'Battery Management (BMS)', proficiency: 'advanced', yearsExperience: 2 },
      { skillName: 'Circuit Analysis', proficiency: 'advanced', yearsExperience: 3 },
    ],
    skillsWanted: [
      { skillName: 'ReactJS', proficiency: 'beginner', yearsExperience: 0 },
      { skillName: 'Web Development', proficiency: 'beginner', yearsExperience: 0 },
      { skillName: 'Python', proficiency: 'beginner', yearsExperience: 0 },
    ],
    availableDays: ['wednesday', 'thursday', 'saturday'],
    badges: [
      { id: 'b25', title: 'EV Hardware Specialist', icon: 'Award', tier: 'gold', description: 'Tested multi-cell LiFePO4 BMS rack at NITN lab', earnedAt: '2024-10-25' },
    ],
  },
];

// ==========================================
// AUTHENTIC CAMPUS FEED POSTS (NO FAKE POSTS)
// ==========================================
export const mockPosts: Post[] = [
  {
    id: 'post-rohit-1',
    authorId: 'user-rohit',
    authorName: 'Rohit Gupta',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces',
    authorHeadline: 'Admin • EEE Student | NIT Nagaland',
    authorDepartment: 'Electrical & Electronics Engineering',
    authorRole: 'admin',
    content: `⚡ [NIT NAGALAND EEE HARDWARE WORKSHOP]

Hosting a peer technical workshop on "Buck-Boost Converter Circuit Simulation & MATLAB Modeling" this Thursday at 3:30 PM in the EEE Hardware Lab!

Topics covered:
1. Inductor saturation and MOSFET gate driver selection
2. Closed-loop voltage regulation with PWM in MATLAB Simulink
3. Hardware PCB layout considerations for noise reduction

Open to all batchmates. Feel free to comment or connect if you would like hands-on circuit test points!`,
    createdAt: '2026-11-08T04:00:00Z',
    likesCount: 42,
    commentsCount: 2,
    sharesCount: 6,
    postType: 'STANDARD',
    tags: ['Teaching', 'PowerElectronics', 'MATLAB', 'NITNagaland'],
    comments: [
      {
        id: 'c-r-1',
        postId: 'post-rohit-1',
        authorId: 'user-vidya',
        authorName: 'Vidya Gupta',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces',
        content: 'I will bring the oscilloscope probe calibration kit from the control lab for our demonstration!',
        createdAt: '2026-11-08T04:15:00Z',
      },
      {
        id: 'c-r-2',
        postId: 'post-rohit-1',
        authorId: 'user-nyoimei',
        authorName: 'Nyoimei C Konyak',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
        content: 'Count me in Rohit. I can show the ESP32 ADC sampling setup for output telemetry.',
        createdAt: '2026-11-08T04:22:00Z',
      }
    ],
  },
  {
    id: 'post-vidya-1',
    authorId: 'user-vidya',
    authorName: 'Vidya Gupta',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces',
    authorHeadline: 'EEE Student | NIT Nagaland',
    authorDepartment: 'Electrical & Electronics Engineering',
    authorRole: 'mentor',
    content: `🤝 [PEER SKILL BARTER - NIT NAGALAND EEE]

I can teach Circuit Analysis, Power Electronics (Buck/Boost converters), and MATLAB Simulink modeling for electrical engineering core courses.

In exchange, I want to learn ReactJS or Python programming fundamentals for building our smart grid web monitoring dashboard. Let's connect!`,
    createdAt: '2026-11-07T12:00:00Z',
    likesCount: 38,
    commentsCount: 1,
    sharesCount: 4,
    postType: 'STANDARD',
    tags: ['Teaching', 'PowerElectronics', 'MATLAB', 'SkillBarter'],
    comments: [
      {
        id: 'c-v-1',
        postId: 'post-vidya-1',
        authorId: 'user-rohit',
        authorName: 'Rohit Gupta',
        authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces',
        content: 'Vidya, we can pair on the smart grid dashboard React components after lab hours!',
        createdAt: '2026-11-07T12:30:00Z',
      }
    ],
  },
  {
    id: 'post-nyoimei-1',
    authorId: 'user-nyoimei',
    authorName: 'Nyoimei C Konyak',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
    authorHeadline: 'EEE Student | NIT Nagaland',
    authorDepartment: 'Electrical & Electronics Engineering',
    authorRole: 'mentor',
    content: `🔌 [NIT NAGALAND EEE LAB UPDATE]

Our EEE team just completed testing our ESP32-based multi-channel energy monitoring prototype at the NIT Nagaland electrical lab! Measures voltage, current, and active power with 98.4% accuracy.

Looking for peer feedback on the telemetry rate and data packaging. Open to all batchmates!`,
    createdAt: '2026-11-07T08:30:00Z',
    likesCount: 51,
    commentsCount: 1,
    sharesCount: 8,
    postType: 'PROJECT_SHOWCASE',
    tags: ['Projects', 'Embedded', 'NITNagaland', 'EEE'],
    comments: [
      {
        id: 'c-n-1',
        postId: 'post-nyoimei-1',
        authorId: 'user-salini',
        authorName: 'Devrapalli Salini',
        authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=faces',
        content: 'Awesome precision Nyoimei! We can integrate this sensor directly into our solar inverter test bench.',
        createdAt: '2026-11-07T09:10:00Z',
      }
    ],
  },
  {
    id: 'post-salini-1',
    authorId: 'user-salini',
    authorName: 'Devrapalli Salini',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=faces',
    authorHeadline: 'EEE Student | NIT Nagaland',
    authorDepartment: 'Electrical & Electronics Engineering',
    authorRole: 'mentor',
    content: `☀️ [RENEWABLE ENERGY & SOLAR MPPT TESTING]

Tested our Perturb & Observe (P&O) MPPT tracking algorithm on a 250W solar module today under variable cloud cover. Efficiency improved by 14% compared to fixed-voltage PWM!

Happy to share the MATLAB simulation files and circuit schematics with anyone working on clean energy systems.`,
    createdAt: '2026-11-06T15:00:00Z',
    likesCount: 35,
    commentsCount: 0,
    sharesCount: 5,
    postType: 'STANDARD',
    tags: ['SolarPV', 'RenewableEnergy', 'MPPT', 'MATLAB'],
  },
  {
    id: 'post-kasturika-1',
    authorId: 'user-kasturika',
    authorName: 'Kasturika Narzary',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces',
    authorHeadline: 'EEE Student | NIT Nagaland',
    authorDepartment: 'Electrical & Electronics Engineering',
    authorRole: 'mentor',
    content: `📚 [HANDWRITTEN REFERENCE NOTES - DIGITAL ELECTRONICS & VERILOG]

Uploaded my summarized notes for 2nd Year EEE students:
• Mealy vs. Moore state machine design with state transition tables
• Timing hazard elimination and setup/hold constraints
• Testbench generation in Verilog RTL

Check the files in our Electrical & Electronics Engineering study group!`,
    createdAt: '2026-11-06T10:20:00Z',
    likesCount: 46,
    commentsCount: 0,
    sharesCount: 7,
    postType: 'STANDARD',
    tags: ['Verilog', 'DigitalElectronics', 'Notes', 'NITNagaland'],
  },
  {
    id: 'post-betimansa-1',
    authorId: 'user-betimansa',
    authorName: 'Betimansa S Chang',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces',
    authorHeadline: 'EEE Student | NIT Nagaland',
    authorDepartment: 'Electrical & Electronics Engineering',
    authorRole: 'mentor',
    content: `🔋 [ELECTRIC VEHICLE BMS BENCH PROGRESS]

Finished calibrating the 16-channel thermistor array and cell voltage taps for our LiFePO4 battery pack prototype. CAN-bus message broadcasting at 500 kbps to our display unit is stable!

If anyone wants to learn CAN-bus protocol or battery safety protection design, let me know!`,
    createdAt: '2026-11-05T14:40:00Z',
    likesCount: 49,
    commentsCount: 0,
    sharesCount: 6,
    postType: 'PROJECT_SHOWCASE',
    tags: ['EV', 'BMS', 'BatteryTech', 'Hardware'],
  },
];

// ==========================================
// MENTOR EXPERTISE (NIT NAGALAND EEE PEERS)
// ==========================================
export const mockExpertise: MentorExpertise[] = [
  { id: 'exp-rohit-1', mentorId: 'user-rohit', topic: 'Power Electronics & MATLAB Simulink', category: 'technical', proficiencyLevel: 5, description: 'Power semiconductor converters, inverter modeling, and MATLAB simulations', yearsOfExperience: 2.5 },
  { id: 'exp-rohit-2', mentorId: 'user-rohit', topic: 'Embedded Systems & IoT Hardware', category: 'technical', proficiencyLevel: 5, description: 'ESP32 firmware, sensor telemetry, and microcontrollers', yearsOfExperience: 2 },
  { id: 'exp-vidya-1', mentorId: 'user-vidya', topic: 'Power Electronics & Circuit Analysis', category: 'technical', proficiencyLevel: 5, description: 'Power semiconductor converters, inverter modeling, and MATLAB simulations', yearsOfExperience: 2.5 },
  { id: 'exp-nyoimei-1', mentorId: 'user-nyoimei', topic: 'Embedded Microcontrollers & C', category: 'technical', proficiencyLevel: 5, description: '8051 and ARM microcontroller interfacing, timers, interrupts, and sensors', yearsOfExperience: 2.5 },
  { id: 'exp-salini-1', mentorId: 'user-salini', topic: 'Renewable Solar PV & Smart Grid Systems', category: 'technical', proficiencyLevel: 5, description: 'Solar microgrid architectures, MPPT algorithms, and power quality', yearsOfExperience: 3 },
  { id: 'exp-kasturika-1', mentorId: 'user-kasturika', topic: 'Digital Logic & Verilog RTL Design', category: 'technical', proficiencyLevel: 5, description: 'FPGA programming, FSM state machines, combinational logic, and KiCAD PCB layout', yearsOfExperience: 2.5 },
  { id: 'exp-betimansa-1', mentorId: 'user-betimansa', topic: 'Electric Vehicle BMS & IoT Hardware', category: 'technical', proficiencyLevel: 5, description: 'Lithium battery pack monitoring, ESP32 telemetry, and CAN-bus protocol', yearsOfExperience: 3 },
];

// ==========================================
// AVAILABILITY SLOTS
// ==========================================
export const mockAvailability: TimeSlot[] = [
  { id: 'slot-rohit-1', mentorId: 'user-rohit', dayOfWeek: 'monday', startTime: '16:00', endTime: '18:00', isRecurring: true },
  { id: 'slot-rohit-2', mentorId: 'user-rohit', dayOfWeek: 'wednesday', startTime: '16:00', endTime: '18:00', isRecurring: true },
  { id: 'slot-vidya-1', mentorId: 'user-vidya', dayOfWeek: 'tuesday', startTime: '15:00', endTime: '17:00', isRecurring: true },
  { id: 'slot-vidya-2', mentorId: 'user-vidya', dayOfWeek: 'thursday', startTime: '16:00', endTime: '18:00', isRecurring: true },
  { id: 'slot-nyoimei-1', mentorId: 'user-nyoimei', dayOfWeek: 'wednesday', startTime: '15:00', endTime: '17:00', isRecurring: true },
  { id: 'slot-nyoimei-2', mentorId: 'user-nyoimei', dayOfWeek: 'saturday', startTime: '10:00', endTime: '12:00', isRecurring: true },
  { id: 'slot-salini-1', mentorId: 'user-salini', dayOfWeek: 'tuesday', startTime: '16:00', endTime: '18:00', isRecurring: true },
  { id: 'slot-salini-2', mentorId: 'user-salini', dayOfWeek: 'thursday', startTime: '15:00', endTime: '17:00', isRecurring: true },
  { id: 'slot-kasturika-1', mentorId: 'user-kasturika', dayOfWeek: 'monday', startTime: '15:30', endTime: '17:30', isRecurring: true },
  { id: 'slot-kasturika-2', mentorId: 'user-kasturika', dayOfWeek: 'friday', startTime: '16:00', endTime: '18:00', isRecurring: true },
  { id: 'slot-betimansa-1', mentorId: 'user-betimansa', dayOfWeek: 'wednesday', startTime: '16:30', endTime: '18:30', isRecurring: true },
  { id: 'slot-betimansa-2', mentorId: 'user-betimansa', dayOfWeek: 'saturday', startTime: '14:00', endTime: '16:00', isRecurring: true },
];

// ==========================================
// SESSIONS
// ==========================================
export const mockSessions: TutoringSession[] = [
  {
    id: 'sess-1',
    mentorId: 'user-vidya',
    menteeId: 'user-rohit',
    topic: 'Power Electronics Inverter Harmonics',
    description: 'Reciprocal peer review of single-phase full-bridge SPWM simulations in MATLAB.',
    date: '2026-11-09',
    startTime: '16:00',
    duration: 60,
    sessionType: 'online',
    status: 'accepted',
    meetingLink: 'https://meet.google.com/sb-nitn-eee',
    createdAt: '2026-11-07T10:00:00Z',
    updatedAt: '2026-11-07T10:00:00Z',
  },
  {
    id: 'sess-2',
    mentorId: 'user-nyoimei',
    menteeId: 'user-salini',
    topic: 'ESP32 ADC Calibration for Solar Probes',
    description: 'Setting up attenuation and polynomial fit for accurate solar voltage measurements.',
    date: '2026-11-10',
    startTime: '15:30',
    duration: 60,
    sessionType: 'online',
    status: 'accepted',
    meetingLink: 'https://meet.google.com/sb-nitn-adc',
    createdAt: '2026-11-07T14:00:00Z',
    updatedAt: '2026-11-07T14:00:00Z',
  },
];

// ==========================================
// REVIEWS
// ==========================================
export const mockReviews: SessionReview[] = [
  {
    id: 'rev-1',
    sessionId: 'sess-prev-1',
    mentorId: 'user-vidya',
    menteeId: 'user-rohit',
    overallRating: 5,
    teachingQuality: 5,
    communication: 5,
    subjectKnowledge: 5,
    review: 'Exceptional explanation of Buck converter inductor sizing and continuous conduction mode equations!',
    createdAt: '2026-11-04T18:00:00Z',
  },
  {
    id: 'rev-2',
    sessionId: 'sess-prev-2',
    mentorId: 'user-nyoimei',
    menteeId: 'user-kasturika',
    overallRating: 5,
    teachingQuality: 5,
    communication: 5,
    subjectKnowledge: 5,
    review: 'Great peer mentoring on configuring timer interrupts on the ARM Cortex-M microcontroller.',
    createdAt: '2026-11-05T17:30:00Z',
  },
  {
    id: 'rev-3',
    sessionId: 'sess-prev-3',
    mentorId: 'user-rohit',
    menteeId: 'user-betimansa',
    overallRating: 5,
    teachingQuality: 5,
    communication: 5,
    subjectKnowledge: 5,
    review: 'Very practical walkthrough of microgrid power flow calculations and hardware safety protocols.',
    createdAt: '2026-11-06T19:00:00Z',
  },
];

// ==========================================
// NOTIFICATIONS
// ==========================================
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-rohit',
    type: 'session_request',
    title: 'New Session Scheduled',
    message: 'Vidya Gupta scheduled a peer review on Power Electronics Inverter Harmonics for Monday.',
    linkUrl: '/sessions',
    isRead: false,
    createdAt: '2026-11-08T03:30:00Z',
  },
  {
    id: 'notif-2',
    userId: 'user-rohit',
    type: 'connection_accepted',
    title: 'Campus Peer Network',
    message: 'All 5 EEE department peers are connected and ready for technical skill exchanges.',
    linkUrl: '/network',
    isRead: true,
    createdAt: '2026-11-07T11:00:00Z',
  },
];

// ==========================================
// USER REPORTS (CLEAN)
// ==========================================
export const mockReports: UserReport[] = [];

// ==========================================
// COMMUNITIES (NIT NAGALAND HUBS)
// ==========================================
export const mockCommunities: CommunityItem[] = [
  {
    id: 'comm-1',
    name: 'Electrical & Electronics Engineering (NIT Nagaland)',
    slug: 'eee-nit-nagaland',
    description: 'Official department exchange for power electronics, microcontrollers, VLSI, and EV battery management systems.',
    membersCount: 6,
    isJoined: true,
  },
  {
    id: 'comm-2',
    name: 'Embedded Systems & Hardware Club',
    slug: 'embedded-systems-robotics',
    description: 'Microcontroller programming, PCB design, sensors, and IoT prototyping circle.',
    membersCount: 6,
    isJoined: true,
  },
  {
    id: 'comm-3',
    name: 'Clean Tech & Renewable Energy Circle',
    slug: 'renewable-energy-cleantech',
    description: 'Solar microgrids, battery energy storage systems, and power quality analysis.',
    membersCount: 6,
    isJoined: true,
  },
];

// ==========================================
// SKILLS DIRECTORY
// ==========================================
export const mockSkills: SkillItem[] = [
  { id: 'sk-1', name: 'Power Electronics', category: 'Technical', endorsementsCount: 38 },
  { id: 'sk-2', name: 'MATLAB & Simulink', category: 'Technical', endorsementsCount: 32 },
  { id: 'sk-3', name: 'Circuit Analysis', category: 'Technical', endorsementsCount: 45 },
  { id: 'sk-4', name: 'Embedded C & Microcontrollers', category: 'Technical', endorsementsCount: 29 },
  { id: 'sk-5', name: 'Renewable Solar Energy', category: 'Technical', endorsementsCount: 26 },
  { id: 'sk-6', name: 'Digital Electronics & Verilog', category: 'Technical', endorsementsCount: 24 },
  { id: 'sk-7', name: 'Electric Vehicle BMS', category: 'Technical', endorsementsCount: 28 },
  { id: 'sk-8', name: 'IoT Telemetry & ESP32', category: 'Technical', endorsementsCount: 31 },
];

// ==========================================
// CONNECTIONS (BETWEEN ROHIT AND 5 GIRLS)
// ==========================================
export const mockConnections: Connection[] = [
  { id: 'conn-rohit-1', senderId: 'user-rohit', receiverId: 'user-vidya', status: 'ACCEPTED', createdAt: '2026-11-02T09:00:00Z' },
  { id: 'conn-rohit-2', senderId: 'user-rohit', receiverId: 'user-nyoimei', status: 'ACCEPTED', createdAt: '2026-11-03T10:00:00Z' },
  { id: 'conn-rohit-3', senderId: 'user-rohit', receiverId: 'user-salini', status: 'ACCEPTED', createdAt: '2026-11-04T11:00:00Z' },
  { id: 'conn-rohit-4', senderId: 'user-rohit', receiverId: 'user-kasturika', status: 'ACCEPTED', createdAt: '2026-11-05T14:00:00Z' },
  { id: 'conn-rohit-5', senderId: 'user-rohit', receiverId: 'user-betimansa', status: 'ACCEPTED', createdAt: '2026-11-06T09:30:00Z' },
  { id: 'conn-101', senderId: 'user-vidya', receiverId: 'user-nyoimei', status: 'ACCEPTED', createdAt: '2026-11-02T10:00:00Z' },
  { id: 'conn-102', senderId: 'user-vidya', receiverId: 'user-salini', status: 'ACCEPTED', createdAt: '2026-11-03T11:30:00Z' },
  { id: 'conn-103', senderId: 'user-vidya', receiverId: 'user-kasturika', status: 'ACCEPTED', createdAt: '2026-11-04T09:15:00Z' },
  { id: 'conn-104', senderId: 'user-vidya', receiverId: 'user-betimansa', status: 'ACCEPTED', createdAt: '2026-11-05T14:20:00Z' },
  { id: 'conn-105', senderId: 'user-nyoimei', receiverId: 'user-kasturika', status: 'ACCEPTED', createdAt: '2026-11-04T12:00:00Z' },
  { id: 'conn-106', senderId: 'user-salini', receiverId: 'user-betimansa', status: 'ACCEPTED', createdAt: '2026-11-05T08:00:00Z' },
];

// ==========================================
// CAMPUS HARDWARE PROJECTS
// ==========================================
export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'NIT Nagaland Campus Microgrid Telemetry System',
    tagline: 'IoT sensor network for lab power monitoring',
    description: 'Building an IoT sensor array with ESP32 to monitor active power, voltage drops, and power factor across campus labs in real-time.',
    category: 'Engineering & IoT',
    ownerDepartment: 'Electrical & Electronics Engineering',
    ownerId: 'user-rohit',
    ownerName: 'Rohit Gupta',
    ownerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces',
    currentMembers: [
      { userId: 'user-rohit', name: 'Rohit Gupta', role: 'Hardware & Circuit Lead', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces', skills: ['Power Electronics', 'IoT'] },
      { userId: 'user-vidya', name: 'Vidya Gupta', role: 'Simulation Specialist', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces', skills: ['MATLAB', 'Circuit Analysis'] },
      { userId: 'user-nyoimei', name: 'Nyoimei C Konyak', role: 'Firmware Engineer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces', skills: ['Embedded C', 'Microcontrollers'] },
    ],
    status: 'active',
    requiredSkills: ['Power Electronics', 'ESP32', 'MATLAB', 'ReactJS'],
    openPositions: [],
    milestones: [],
    createdAt: '2026-11-01T09:00:00Z',
  },
  {
    id: 'proj-2',
    title: 'Multi-Cell LiFePO4 Electric Vehicle BMS',
    tagline: 'Smart battery management for electric vehicle prototypes',
    description: 'Hardware protection system with active cell balancing, temperature cutoff, and CAN-bus telemetry for student EV prototypes.',
    category: 'Electric Vehicles',
    ownerDepartment: 'Electrical & Electronics Engineering',
    ownerId: 'user-betimansa',
    ownerName: 'Betimansa S Chang',
    ownerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces',
    currentMembers: [
      { userId: 'user-betimansa', name: 'Betimansa S Chang', role: 'BMS Architect', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces', skills: ['Battery Management', 'ESP32'] },
      { userId: 'user-salini', name: 'Devrapalli Salini', role: 'Power Quality Analyst', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=faces', skills: ['Power Systems', 'Solar Energy'] },
    ],
    status: 'active',
    requiredSkills: ['Battery Management', 'CAN-bus', 'Circuit Analysis'],
    openPositions: [],
    milestones: [],
    createdAt: '2026-11-02T11:00:00Z',
  },
];

export const mockProjectApplications: ProjectApplication[] = [];
export const mockConversations: Conversation[] = [];
export const mockMessages: Message[] = [];
