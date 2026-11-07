// SkillBridge Core Type Definitions

export type UserRole = 'mentee' | 'mentor' | 'admin' | 'faculty' | 'alumni';
export type SessionStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
export type SessionType = 'online' | 'in-person';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type LearningPreference = 'visual' | 'auditory' | 'reading' | 'kinesthetic';
export type AvailabilityStatus = 'available' | 'busy' | 'offline';
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';
export type NotificationType =
  | 'session_request'
  | 'session_accepted'
  | 'session_rejected'
  | 'session_reminder'
  | 'new_message'
  | 'new_review'
  | 'connection_request'
  | 'connection_accepted'
  | 'post_like'
  | 'post_comment'
  | 'skill_endorsed'
  | 'system'
  | 'exchange_match'
  | 'project_invite'
  | 'project_application';

export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type SkillIntention = 'teach' | 'learn' | 'both';
export type LearningFormat = '1-on-1' | 'pair-programming' | 'project-collab' | 'async-review';

export interface SkillExchangeEntry {
  id?: string;
  userId?: string;
  skillName: string;
  category?: string;
  proficiency: ProficiencyLevel;
  intention?: SkillIntention;
  yearsOfExperience?: number;
  yearsExperience?: number;
  preferredFormat?: LearningFormat;
  preferredTeachingFormats?: string[];
  targetGoal?: string;
}

export interface ReputationBadge {
  id: string;
  name?: string;
  title?: string;
  badgeType?: string;
  description: string;
  icon?: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'bronze' | 'silver' | 'gold';
  dateEarned?: string;
  earnedAt?: string;
  points?: number;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar: string;
  role: UserRole;
  department: string;
  year: string; // e.g., "3rd Year", "Alumni", "Faculty"
  bio: string;
  joinedAt: string;
  isVerified: boolean;
  isSuspended: boolean;
  learningPreferences: LearningPreference[];
  languages: string[];
  onlineStatus: AvailabilityStatus;
  headline?: string;
  coverImage?: string;
  university?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  token?: string;
  // SkillBridge 4.0 additions:
  skillsOffered?: SkillExchangeEntry[];
  skillsWanted?: SkillExchangeEntry[];
  badges?: ReputationBadge[];
  availableDays?: DayOfWeek[];
}

export interface MentorExpertise {
  id: string;
  mentorId: string;
  topic: string;
  category: 'technical' | 'academic';
  proficiencyLevel: number; // 1-5
  description: string;
  yearsOfExperience: number;
}

export interface TimeSlot {
  id: string;
  mentorId: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isRecurring: boolean;
  specificDate?: string; // ISO date for non-recurring
}

export interface LearningRequest {
  id: string;
  menteeId: string;
  topic: string;
  description: string;
  preferredSessionType: SessionType;
  preferredLanguage: string;
  preferredDays: DayOfWeek[];
  urgency: 'low' | 'medium' | 'high';
  createdAt: string;
  status: 'open' | 'matched' | 'closed';
}

export interface MentorMatch {
  id: string;
  requestId: string;
  menteeId: string;
  mentorId: string;
  matchScore: number;
  topicRelevance: number;
  availabilityScore: number;
  ratingScore: number;
  proficiencyScore: number;
  preferenceScore: number;
  reasons: string[];
  createdAt: string;
}

export interface TutoringSession {
  id: string;
  mentorId: string;
  menteeId: string;
  topic: string;
  description: string;
  date: string;
  startTime: string;
  duration: number; // minutes
  sessionType: SessionType;
  location?: string;
  meetingLink?: string;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
  cancelledBy?: string;
  cancellationReason?: string;
  notes?: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage: string;
  lastMessageAt: string;
  createdAt: string;
  unreadCount: Record<string, number>;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface SessionReview {
  id: string;
  sessionId: string;
  mentorId: string;
  menteeId: string;
  overallRating: number; // 1-5
  teachingQuality: number;
  communication: number;
  subjectKnowledge: number;
  review: string;
  createdAt: string;
}

export interface UserReport {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reason: string;
  description: string;
  status: ReportStatus;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  relatedId?: string;
  linkUrl?: string;
  createdAt: string;
}

// ─── Professional Networking & Feed Types (SkillBridge 2.0 / 4.0) ───

export type PostType =
  | 'STANDARD'
  | 'PROJECT_SHOWCASE'
  | 'ACHIEVEMENT'
  | 'ACADEMIC_QUESTION'
  | 'OPPORTUNITY'
  | 'LEARNING_PROGRESS'
  | 'COLLABORATION_SEARCH';

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorHeadline?: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorHeadline: string;
  authorDepartment: string;
  authorRole: UserRole;
  content: string;
  postType: PostType;
  tags: string[];
  mediaUrls?: string[];
  projectLink?: string;
  likesCount?: number;
  reactionsCount?: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  hasLiked?: boolean;
  isSaved?: boolean;
  comments?: PostComment[];
  communityId?: string;
  communityName?: string;
  createdAt: string;
}

export interface Connection {
  id: string;
  userId?: string;
  connectedUserId?: string;
  connectedUserName?: string;
  connectedUserAvatar?: string;
  connectedUserHeadline?: string;
  connectedUserDepartment?: string;
  senderId?: string;
  receiverId?: string;
  user?: User;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  endorsementsCount: number;
  isEndorsed?: boolean;
  isEndorsedByMe?: boolean;
  endorsers?: {
    id: string;
    name: string;
    avatar?: string;
  }[];
}

export interface CommunityItem {
  id: string;
  name: string;
  slug?: string;
  description: string;
  category?: string;
  coverImage?: string;
  avatarImage?: string;
  avatar?: string;
  icon?: string;
  membersCount: number;
  postsCount?: number;
  isMember?: boolean;
  isJoined?: boolean;
}

// ─── SkillBridge 4.0: Two-Way Skill Exchange & ProjectSpace Types ───

export interface TwoWayMatch {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar: string;
  partnerHeadline: string;
  partnerDepartment: string;
  partnerUniversity: string;
  iCanTeachThem: string[];
  theyCanTeachMe: string[];
  matchScore: number; // e.g. 96
  isMutual: boolean; // true for 2-way, false for 1-way
  sharedDays: string[];
  breakdown: {
    skillCompatibility: number; // Max 40
    scheduleOverlap: number; // Max 25
    proficiencyScore: number; // Max 15
    preferencesScore: number; // Max 10
    reputationScore: number; // Max 10
    mutualBonus: number; // Bonus points e.g. 10
  };
  reasons: string[];
  availabilityNotice: string;
}

export interface ProjectMember {
  userId: string;
  name: string;
  avatar: string;
  role: string;
  skills: string[];
}

export interface ProjectOpenPosition {
  id: string;
  title: string;
  requiredSkills: string[];
  spots: number;
  description?: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  dueDate?: string;
  completed?: boolean;
  isCompleted?: boolean;
}

export interface Project {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerHeadline?: string;
  ownerDepartment: string;
  ownerUniversity?: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  status: 'recruiting' | 'in-progress' | 'completed' | 'active';
  teamSize?: number;
  teamSizeMax?: number;
  currentMembers: ProjectMember[];
  requiredSkills: string[];
  openPositions: ProjectOpenPosition[];
  duration?: string;
  estimatedDuration?: string;
  milestones: ProjectMilestone[];
  applicationsCount?: number;
  repoUrl?: string;
  githubUrl?: string;
  createdAt: string;
}

export interface ProjectApplication {
  id: string;
  projectId: string;
  projectTitle: string;
  applicantId: string;
  applicantName: string;
  applicantAvatar: string;
  applicantHeadline?: string;
  applicantDepartment?: string;
  applicantYear?: string;
  appliedPositionId: string;
  appliedPositionTitle: string;
  pitch: string;
  relevantSkills: string[];
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
}

// Computed/display types
export interface MentorProfile extends User {
  expertise: MentorExpertise[];
  availability: TimeSlot[];
  averageRating: number;
  totalReviews: number;
  completedSessions: number;
  matchScore?: number;
  matchReasons?: string[];
}

export interface SessionWithDetails extends TutoringSession {
  mentor: User;
  mentee: User;
  review?: SessionReview;
}

export interface ConversationWithDetails extends Conversation {
  participants: User[];
  messages: Message[];
}

export interface MentorStats {
  totalSessions: number;
  completedSessions: number;
  averageRating: number;
  totalReviews: number;
  upcomingSessions: number;
  totalMentees: number;
  ratingDistribution: Record<number, number>;
}

export interface PlatformStats {
  totalUsers: number;
  totalMentors: number;
  totalMentees: number;
  totalSessions: number;
  completedSessions: number;
  averageRating: number;
  activeConversations: number;
}

export interface MatchingCriteria {
  topic: string;
  preferredSessionType?: SessionType;
  preferredDays?: DayOfWeek[];
  preferredLanguage?: string;
  learningPreferences?: LearningPreference[];
  minimumRating?: number;
}

export interface FilterOptions {
  subject?: string;
  skill?: string;
  minRating?: number;
  availableDay?: DayOfWeek;
  sessionType?: SessionType;
  language?: string;
  sortBy?: 'match' | 'rating' | 'sessions' | 'name';
  sortOrder?: 'asc' | 'desc';
}
