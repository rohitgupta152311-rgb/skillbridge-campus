import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SkillBridge PostgreSQL database with NIT Nagaland cohort...');

  const passwordHash = await bcrypt.hash('demo1234', 10);
  const adminPasswordHash = await bcrypt.hash('admin1234', 10);

  // 0. Administrator: Admin (Platform Administrator)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@campus.edu' },
    update: {
      role: UserRole.ADMIN,
      isVerified: true,
      profile: {
        update: {
          fullName: 'Admin',
          department: 'Campus Administration',
          headline: 'Platform Administrator & Safety Governance',
        },
      },
    },
    create: {
      email: 'admin@campus.edu',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
      isVerified: true,
      profile: {
        create: {
          fullName: 'Admin',
          department: 'Campus Administration',
          currentYear: 'System Administrator',
          university: 'SkillBridge Campus Governance',
          headline: 'Platform Administrator & Safety Governance',
          bio: 'Institutional Administrator for SkillBridge campus ecosystem. Oversees student safety, verification, report audits, and direct announcements.',
          languages: ['English', 'Hindi'],
          onlineStatus: 'available',
        },
      },
    },
  });

  // 1. Vidya Gupta (2nd Year, NIT Nagaland, EEE)
  const vidya = await prisma.user.upsert({
    where: { email: 'vidya.gupta@campus.edu' },
    update: {},
    create: {
      email: 'vidya.gupta@campus.edu',
      passwordHash,
      role: UserRole.MENTOR,
      isVerified: true,
      profile: {
        create: {
          fullName: 'Vidya Gupta',
          department: 'Electrical & Electronics Engineering',
          currentYear: '2nd Year',
          university: 'National Institute of Technology (NIT) Nagaland',
          headline: 'EEE Student | NIT Nagaland | Power Electronics & MATLAB Simulink',
          bio: 'Electrical & Electronics Engineering student at NIT Nagaland. Passionate about power electronics, circuit simulations in MATLAB, and control systems.',
          githubUrl: 'https://github.com/vidyagupta-dev',
          linkedinUrl: 'https://linkedin.com/in/vidyagupta-nitn',
          languages: ['English', 'Hindi'],
          learningPreferences: ['visual', 'reading'],
          onlineStatus: 'available',
        },
      },
      mentorExpertise: {
        create: [
          { topic: 'Power Electronics', category: 'technical', proficiencyLevel: 5, yearsOfExperience: 2.5 },
          { topic: 'MATLAB', category: 'technical', proficiencyLevel: 5, yearsOfExperience: 2.0 },
          { topic: 'Circuit Analysis', category: 'technical', proficiencyLevel: 5, yearsOfExperience: 2.5 },
        ],
      },
      mentorAvailability: {
        create: [
          { dayOfWeek: 'tuesday', startTime: '10:00', endTime: '12:00' },
          { dayOfWeek: 'thursday', startTime: '14:00', endTime: '16:00' },
          { dayOfWeek: 'saturday', startTime: '09:00', endTime: '11:00' },
        ],
      },
    },
  });

  // 2. Nyoimei C Konyak (2nd Year, NIT Nagaland, EEE)
  const nyoimei = await prisma.user.upsert({
    where: { email: 'nyoimei.konyak@campus.edu' },
    update: {},
    create: {
      email: 'nyoimei.konyak@campus.edu',
      passwordHash,
      role: UserRole.MENTOR,
      isVerified: true,
      profile: {
        create: {
          fullName: 'Nyoimei C Konyak',
          department: 'Electrical & Electronics Engineering',
          currentYear: '2nd Year',
          university: 'National Institute of Technology (NIT) Nagaland',
          headline: 'EEE Student | NIT Nagaland | Embedded Systems & Microcontrollers',
          bio: 'Electrical & Electronics Engineering student at NIT Nagaland. Specializing in microcontrollers (8051, ARM), embedded C programming, and smart grid automation.',
          githubUrl: 'https://github.com/nyoimei-konyak',
          linkedinUrl: 'https://linkedin.com/in/nyoimei-konyak',
          languages: ['English', 'Hindi', 'Nagamese'],
          learningPreferences: ['kinesthetic', 'visual'],
          onlineStatus: 'available',
        },
      },
      mentorExpertise: {
        create: [
          { topic: 'Embedded C', category: 'technical', proficiencyLevel: 5, yearsOfExperience: 2.5 },
          { topic: 'Microcontrollers', category: 'technical', proficiencyLevel: 5, yearsOfExperience: 2.0 },
          { topic: 'Circuit Analysis', category: 'technical', proficiencyLevel: 5, yearsOfExperience: 2.5 },
        ],
      },
      mentorAvailability: {
        create: [
          { dayOfWeek: 'monday', startTime: '10:00', endTime: '12:00' },
          { dayOfWeek: 'wednesday', startTime: '14:00', endTime: '16:00' },
          { dayOfWeek: 'saturday', startTime: '13:00', endTime: '15:00' },
        ],
      },
    },
  });

  // 3. Devrapalli Salini (2nd Year, NIT Nagaland, EEE)
  await prisma.user.upsert({
    where: { email: 'devrapalli.salini@campus.edu' },
    update: {},
    create: {
      email: 'devrapalli.salini@campus.edu',
      passwordHash,
      role: UserRole.MENTOR,
      isVerified: true,
      profile: {
        create: {
          fullName: 'Devrapalli Salini',
          department: 'Electrical & Electronics Engineering',
          currentYear: '2nd Year',
          university: 'National Institute of Technology (NIT) Nagaland',
          headline: 'EEE Student | NIT Nagaland | Renewable Energy & Solar PV Systems',
          bio: 'Electrical & Electronics Engineering student at NIT Nagaland. Researching solar microgrid controllers, battery energy storage systems, and power quality analysis.',
          githubUrl: 'https://github.com/salini-devrapalli',
          linkedinUrl: 'https://linkedin.com/in/devrapalli-salini',
          languages: ['English', 'Telugu', 'Hindi'],
          learningPreferences: ['visual', 'reading'],
          onlineStatus: 'available',
        },
      },
    },
  });

  // 4. Kasturika Narzary (2nd Year, NIT Nagaland, EEE)
  await prisma.user.upsert({
    where: { email: 'kasturika.narzary@campus.edu' },
    update: {},
    create: {
      email: 'kasturika.narzary@campus.edu',
      passwordHash,
      role: UserRole.MENTOR,
      isVerified: true,
      profile: {
        create: {
          fullName: 'Kasturika Narzary',
          department: 'Electrical & Electronics Engineering',
          currentYear: '2nd Year',
          university: 'National Institute of Technology (NIT) Nagaland',
          headline: 'EEE Student | NIT Nagaland | VLSI Design & Digital Electronics',
          bio: 'Electrical & Electronics Engineering student at NIT Nagaland. Passionate about digital logic design, Verilog RTL, FPGA prototyping, and PCB layout design.',
          githubUrl: 'https://github.com/kasturika-narzary',
          linkedinUrl: 'https://linkedin.com/in/kasturika-narzary',
          languages: ['English', 'Assamese', 'Hindi'],
          learningPreferences: ['visual', 'kinesthetic'],
          onlineStatus: 'available',
        },
      },
    },
  });

  // 5. Betimansa S Chang (2nd Year, NIT Nagaland, EEE)
  await prisma.user.upsert({
    where: { email: 'betimansa.chang@campus.edu' },
    update: {},
    create: {
      email: 'betimansa.chang@campus.edu',
      passwordHash,
      role: UserRole.MENTOR,
      isVerified: true,
      profile: {
        create: {
          fullName: 'Betimansa S Chang',
          department: 'Electrical & Electronics Engineering',
          currentYear: '2nd Year',
          university: 'National Institute of Technology (NIT) Nagaland',
          headline: 'EEE Student | NIT Nagaland | Electric Vehicle BMS & IoT Hardware',
          bio: 'Electrical & Electronics Engineering student at NIT Nagaland. Building battery management systems (BMS) for electric vehicles and sensor telemetry with ESP32.',
          githubUrl: 'https://github.com/betimansa-chang',
          linkedinUrl: 'https://linkedin.com/in/betimansa-chang',
          languages: ['English', 'Nagamese', 'Hindi'],
          learningPreferences: ['kinesthetic', 'visual'],
          onlineStatus: 'available',
        },
      },
    },
  });

  
  // 6. Rohit Gupta (2nd Year, NIT Nagaland, EEE - Peer Mentor)
  const rohit = await prisma.user.upsert({
    where: { email: 'rohit.gupta@campus.edu' },
    update: { role: UserRole.MENTOR },
    create: {
      email: 'rohit.gupta@campus.edu',
      passwordHash,
      role: UserRole.ADMIN,
      isVerified: true,
      profile: {
        create: {
          fullName: 'Rohit Gupta',
          department: 'Electrical & Electronics Engineering',
          currentYear: '2nd Year',
          university: 'National Institute of Technology (NIT) Nagaland',
          headline: 'EEE Student | NIT Nagaland | Power Electronics, IoT & Embedded Systems',
          bio: 'Electrical & Electronics Engineering student at NIT Nagaland. Specializing in power electronics, IoT telemetry, and embedded circuits.',
          githubUrl: 'https://github.com/rohitgupta-nitn',
          linkedinUrl: 'https://linkedin.com/in/rohitgupta-nitn',
          languages: ['English', 'Hindi'],
          learningPreferences: ['visual', 'kinesthetic'],
          onlineStatus: 'available',
        },
      },
      mentorExpertise: {
        create: [
          { topic: 'Power Electronics', category: 'technical', proficiencyLevel: 5, yearsOfExperience: 2.5 },
          { topic: 'MATLAB', category: 'technical', proficiencyLevel: 5, yearsOfExperience: 2.0 },
          { topic: 'Circuit Analysis', category: 'technical', proficiencyLevel: 5, yearsOfExperience: 2.5 },
          { topic: 'Embedded Systems & IoT', category: 'technical', proficiencyLevel: 5, yearsOfExperience: 2.0 },
        ],
      },
      mentorAvailability: {
        create: [
          { dayOfWeek: 'monday', startTime: '10:00', endTime: '12:00' },
          { dayOfWeek: 'wednesday', startTime: '14:00', endTime: '16:00' },
          { dayOfWeek: 'saturday', startTime: '10:00', endTime: '12:00' },
        ],
      },
    },
  });

  // Communities
  const eeeCommunity = await prisma.community.upsert({
    where: { slug: 'eee-nit-nagaland' },
    update: {},
    create: {
      name: 'Electrical & Electronics Engineering (NIT Nagaland)',
      slug: 'eee-nit-nagaland',
      description: 'Official department exchange for power electronics, microcontrollers, VLSI, and EV battery management systems.',
      iconImage: '⚡',
    },
  });

  const embeddedClub = await prisma.community.upsert({
    where: { slug: 'embedded-systems-robotics' },
    update: {},
    create: {
      name: 'Embedded Systems & Hardware Club',
      slug: 'embedded-systems-robotics',
      description: 'Microcontroller programming, PCB design, sensors, and IoT prototyping circle.',
      iconImage: '🔌',
    },
  });

  // Sample Posts in Feed
  await prisma.post.create({
    data: {
      authorId: vidya.id,
      communityId: eeeCommunity.id,
      content: 'Leading a peer study sprint on MATLAB Simulink modeling for power electronic DC-DC converters this Wednesday. Happy to swap with anyone working on Python control system scripts!',
      postType: 'ACHIEVEMENT',
      tags: ['MATLAB', 'PowerElectronics', 'NITNagaland', 'EEE'],
    },
  });

  await prisma.post.create({
    data: {
      authorId: nyoimei.id,
      communityId: embeddedClub.id,
      content: 'Successfully flashed custom FreeRTOS firmware on our ARM Cortex-M board for the campus weather telemetry node. Shoutout to Vidya Gupta for the circuit analysis review!',
      postType: 'PROJECT_SHOWCASE',
      tags: ['EmbeddedSystems', 'ARM', 'FreeRTOS', 'PeerReview'],
    },
  });

  console.log('SkillBridge NIT Nagaland database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
