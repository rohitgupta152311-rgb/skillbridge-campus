import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SkillBridge 2.0 PostgreSQL database...');

  const passwordHash = await bcrypt.hash('demo1234', 10);
  const adminPasswordHash = await bcrypt.hash('admin1234', 10);

  // 1. Mentee: Alex Turner
  const alex = await prisma.user.upsert({
    where: { email: 'alex.student@campus.edu' },
    update: {},
    create: {
      email: 'alex.student@campus.edu',
      passwordHash,
      role: UserRole.MENTEE,
      isVerified: true,
      profile: {
        create: {
          fullName: 'Alex Turner',
          department: 'Computer Science',
          currentYear: '2nd Year',
          university: 'State Technological University',
          headline: 'Aspiring Full-Stack Software Engineer | React & Systems',
          bio: 'Sophomore CS student passionate about building performant web apps and mastering data structures. Currently working on open source projects.',
          portfolioUrl: 'https://alexturner.dev',
          githubUrl: 'https://github.com/alexturner',
          linkedinUrl: 'https://linkedin.com/in/alexturner',
          languages: ['English', 'Spanish'],
          learningPreferences: ['visual', 'kinesthetic'],
          onlineStatus: 'available',
        },
      },
    },
  });

  // 2. Mentor: Sarah Chen
  const sarah = await prisma.user.upsert({
    where: { email: 'sarah.mentor@campus.edu' },
    update: {},
    create: {
      email: 'sarah.mentor@campus.edu',
      passwordHash,
      role: UserRole.MENTOR,
      isVerified: true,
      profile: {
        create: {
          fullName: 'Sarah Chen',
          department: 'Computer Science',
          currentYear: '4th Year',
          university: 'State Technological University',
          headline: 'Senior CS Student & Frontend Architect | Incoming SWE Intern',
          bio: 'Passionate about teaching web development and helping juniors build real-world projects. Full-stack developer with internship experience at two tech startups.',
          portfolioUrl: 'https://sarahchen.me',
          githubUrl: 'https://github.com/sarahchen',
          linkedinUrl: 'https://linkedin.com/in/sarahchen',
          languages: ['English', 'Mandarin'],
          onlineStatus: 'available',
        },
      },
      mentorExpertise: {
        create: [
          { topic: 'ReactJS', category: 'technical', proficiencyLevel: 5, yearsOfExperience: 3.0 },
          { topic: 'Web Development', category: 'technical', proficiencyLevel: 5, yearsOfExperience: 3.0 },
          { topic: 'TypeScript', category: 'technical', proficiencyLevel: 4, yearsOfExperience: 2.0 },
        ],
      },
      mentorAvailability: {
        create: [
          { dayOfWeek: 'monday', startTime: '10:00', endTime: '12:00' },
          { dayOfWeek: 'wednesday', startTime: '14:00', endTime: '16:00' },
          { dayOfWeek: 'friday', startTime: '09:00', endTime: '11:00' },
        ],
      },
    },
  });

  // 3. Admin: Admin Officer
  await prisma.user.upsert({
    where: { email: 'admin@campus.edu' },
    update: {},
    create: {
      email: 'admin@campus.edu',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
      isVerified: true,
      profile: {
        create: {
          fullName: 'Campus Admin Officer',
          department: 'Academic Affairs',
          currentYear: 'Faculty',
          university: 'State Technological University',
          headline: 'Platform Administrator & Campus Safety Director',
          onlineStatus: 'available',
        },
      },
    },
  });

  // Communities
  const csCommunity = await prisma.community.upsert({
    where: { slug: 'cs-community' },
    update: {},
    create: {
      name: 'Computer Science & Engineering',
      slug: 'cs-community',
      description: 'The official campus hub for algorithms, systems, software engineering, and hackathon project teams.',
      iconImage: '💻',
    },
  });

  const aiClub = await prisma.community.upsert({
    where: { slug: 'ai-ml-club' },
    update: {},
    create: {
      name: 'AI & Machine Learning Club',
      slug: 'ai-ml-club',
      description: 'Discussing neural networks, PyTorch, computer vision, and foundation model research papers.',
      iconImage: '🤖',
    },
  });

  // Sample Posts in Feed
  await prisma.post.create({
    data: {
      authorId: sarah.id,
      communityId: csCommunity.id,
      content: 'Excited to announce our upcoming campus workshop on "Building Full-Stack TypeScript Apps with React & Node.js"! We will be walking through production deployment patterns and clean architecture. Who is interested in joining?',
      postType: 'ACHIEVEMENT',
      tags: ['WebDev', 'TypeScript', 'CampusWorkshop', 'React'],
    },
  });

  await prisma.post.create({
    data: {
      authorId: alex.id,
      content: 'Just deployed my first open-source data structures visualizer using React and Canvas! Huge thanks to Sarah Chen for the mentorship sessions on state architecture. Check out the demo and let me know your thoughts!',
      postType: 'PROJECT_SHOWCASE',
      tags: ['OpenSource', 'React', 'MentorshipWins', 'DataStructures'],
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
