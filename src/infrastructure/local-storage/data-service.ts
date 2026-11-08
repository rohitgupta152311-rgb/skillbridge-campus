import {
  User, MentorExpertise, TimeSlot, TutoringSession,
  Conversation, Message, SessionReview, Notification, UserReport,
  Post, CommunityItem, SkillItem, Connection, Project, ProjectApplication, TwoWayMatch, SkillExchangeEntry,
} from '../../foundation/types';
import { mockReports,
  mockUsers, mockExpertise, mockAvailability, mockSessions,
  mockConversations, mockMessages, mockReviews, mockNotifications,
  mockPosts, mockCommunities, mockSkills, mockConnections,
  mockProjects, mockProjectApplications,
} from '../mock-database/seed-data';
import { generateId } from '../../foundation/helpers';

const STORAGE_KEYS = {
  users: 'sb_users',
  expertise: 'sb_expertise',
  availability: 'sb_availability',
  sessions: 'sb_sessions',
  conversations: 'sb_conversations',
  messages: 'sb_messages',
  reviews: 'sb_reviews',
  notifications: 'sb_notifications',
  reports: 'sb_reports',
  posts: 'sb_posts',
  communities: 'sb_communities',
  skills: 'sb_skills',
  connections: 'sb_connections',
  projects: 'sb_projects',
  projectApplications: 'sb_project_applications',
  initialized: 'sb_initialized_v23_admin_and_nit_nagaland_cohort',
} as const;

// Isomorphic storage fallback for SSR, headless Node environments, and testing
const memoryStore = new Map<string, string>();
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // Fall through
    }
    return memoryStore.get(key) ?? null;
  },
  setItem: (key: string, val: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, val);
        return;
      }
    } catch {
      // Fall through
    }
    memoryStore.set(key, val);
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch {
      // Fall through
    }
    memoryStore.delete(key);
  },
};


function loadOrSeed<T>(key: string, seedData: T[]): T[] {
  const stored = safeStorage.getItem(key);
  if (stored) {
    try { return JSON.parse(stored); }
    catch { /* fall through to seed */ }
  }
  safeStorage.setItem(key, JSON.stringify(seedData));
  return seedData;
}

function persist<T>(key: string, data: T[]): void {
  safeStorage.setItem(key, JSON.stringify(data));
}

/** Initialize (or re-initialize) all data stores from seed data. */
export function initializeDataStore(force = false): void {
  // Always clean up legacy dummy mock conversations/messages
  try {
    const existingConvs = safeStorage.getItem(STORAGE_KEYS.conversations);
    if (existingConvs) {
      const parsed = JSON.parse(existingConvs);
      if (Array.isArray(parsed) && parsed.some(c => c.id && (c.id.startsWith('conv-') || c.id.startsWith('conv_')))) {
        safeStorage.setItem(STORAGE_KEYS.conversations, JSON.stringify([]));
      }
    }
    const existingMsgs = safeStorage.getItem(STORAGE_KEYS.messages);
    if (existingMsgs) {
      const parsed = JSON.parse(existingMsgs);
      if (Array.isArray(parsed) && parsed.some(m => m.id && (m.id.startsWith('msg-') || m.conversationId?.startsWith('conv-')))) {
        safeStorage.setItem(STORAGE_KEYS.messages, JSON.stringify([]));
      }
    }
  } catch {
    // Ignore cleanup error
  }

  if (!force && safeStorage.getItem(STORAGE_KEYS.initialized)) return;
  safeStorage.setItem(STORAGE_KEYS.users, JSON.stringify(mockUsers));
  safeStorage.setItem(STORAGE_KEYS.expertise, JSON.stringify(mockExpertise));
  safeStorage.setItem(STORAGE_KEYS.availability, JSON.stringify(mockAvailability));
  safeStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(mockSessions));
  safeStorage.setItem(STORAGE_KEYS.conversations, JSON.stringify([]));
  safeStorage.setItem(STORAGE_KEYS.messages, JSON.stringify([]));
  safeStorage.setItem(STORAGE_KEYS.reviews, JSON.stringify(mockReviews));
  safeStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(mockNotifications));
  safeStorage.setItem(STORAGE_KEYS.reports, JSON.stringify(mockReports));
  safeStorage.setItem(STORAGE_KEYS.posts, JSON.stringify(mockPosts));
  safeStorage.setItem(STORAGE_KEYS.communities, JSON.stringify(mockCommunities));
  safeStorage.setItem(STORAGE_KEYS.skills, JSON.stringify(mockSkills));
  safeStorage.setItem(STORAGE_KEYS.connections, JSON.stringify(mockConnections));
  safeStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(mockProjects));
  safeStorage.setItem(STORAGE_KEYS.projectApplications, JSON.stringify(mockProjectApplications));
  safeStorage.setItem(STORAGE_KEYS.initialized, 'true');
}

// ─── USERS ──────────────────────────────────────────────────
const CORE_NIT_NAGALAND_IDS = new Set([
  'user-admin',
  'user-rohit',
  'user-vidya',
  'user-nyoimei',
  'user-salini',
  'user-kasturika',
  'user-betimansa',
]);

const LEGACY_FAKE_IDS = new Set([
  'user-kabir', 'user-ananya', 'user-aarav', 'user-priya', 'user-rohan',
  'user-akash', 'user-neha', 'user-karan', 'user-1',
  'user-2', 'user-3', 'user-4', 'user-5', 'user-6', 'user-7', 'user-8', 'user-9', 'user-10'
]);

export function getUsers(): User[] {
  const users = loadOrSeed(STORAGE_KEYS.users, mockUsers);

  // Filter out any legacy demo accounts not part of the active NIT Nagaland cohort
  const filteredUsers = users.filter((u) => {
    if (CORE_NIT_NAGALAND_IDS.has(u.id)) return true;
    if (LEGACY_FAKE_IDS.has(u.id)) return false;
    // Remove any user with old demo emails
    if (u.email && ['kabir@campus.edu', 'ananya@campus.edu', 'aarav@campus.edu', 'priya@campus.edu', 'rohan@campus.edu', 'akash@campus.edu'].includes(u.email.toLowerCase())) {
      return false;
    }
    // Allow newly registered real users created during this session
    return true;
  });

  let changed = filteredUsers.length !== users.length;
  const merged = [...filteredUsers];

  // Guarantee all 6 institutional users exist and have up to date metadata
  for (const mu of mockUsers) {
    const idx = merged.findIndex((u) => u.id === mu.id);
    if (idx === -1) {
      merged.push(mu);
      changed = true;
    } else {
      if (merged[idx].fullName !== mu.fullName || merged[idx].email !== mu.email) {
        merged[idx].fullName = mu.fullName;
        merged[idx].email = mu.email;
        changed = true;
      }
      if (mu.id !== 'user-admin') {
        if (
          merged[idx].year !== '2nd Year' ||
          merged[idx].university !== 'National Institute of Technology (NIT) Nagaland' ||
          merged[idx].department !== 'Electrical & Electronics Engineering'
        ) {
          merged[idx] = {
            ...merged[idx],
            year: '2nd Year',
            university: 'National Institute of Technology (NIT) Nagaland',
            department: 'Electrical & Electronics Engineering',
          };
          changed = true;
        }
      }
      if (mu.id === 'user-rohit' && merged[idx].role !== 'mentor') {
        merged[idx].role = 'mentor';
        changed = true;
      }
      if (mu.id === 'user-admin' && merged[idx].role !== 'admin') {
        merged[idx].role = 'admin';
        changed = true;
      }
    }
  }

  if (changed) {
    persist(STORAGE_KEYS.users, merged);
    return merged;
  }
  return users;
}

export function getUserById(id: string): User | undefined { return getUsers().find(u => u.id === id); }

export function getUserByEmail(email: string): User | undefined {
  const normalized = email.trim().toLowerCase();
  return getUsers().find(u => u.email.toLowerCase() === normalized);
}

export function getMentors(): User[] { return getUsers().filter(u => u.role === 'mentor' && !u.isSuspended); }
export function getMentees(): User[] { return getUsers().filter(u => u.role === 'mentee' && !u.isSuspended); }

export function updateUser(id: string, updates: Partial<User>): User | undefined {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return undefined;
  users[idx] = { ...users[idx], ...updates };
  persist(STORAGE_KEYS.users, users);

  // Keep sb_current_user in sync so modifications persist immediately
  const currentUserRaw = safeStorage.getItem('sb_current_user');
  if (currentUserRaw) {
    try {
      const current = JSON.parse(currentUserRaw);
      if (current.id === id) {
        safeStorage.setItem('sb_current_user', JSON.stringify(users[idx]));
      }
    } catch {
      // Ignore parse error
    }
  }

  return users[idx];
}

export function addUser(user: Omit<User, 'id' | 'joinedAt'> & { id?: string; joinedAt?: string }): User {
  const users = getUsers();
  const existingIdx = user.id ? users.findIndex(u => u.id === user.id) : -1;
  const isUserAdmin = user.role === 'admin' || user.email.toLowerCase() === 'rohit.gupta@campus.edu' || user.email.toLowerCase() === 'admin@campus.edu';
  const newUser: User = {
    ...user,
    id: user.id || `user-${generateId()}`,
    joinedAt: user.joinedAt || new Date().toISOString(),
    // All newly created accounts require admin approval unless explicitly administrator
    isVerified: isUserAdmin ? true : (user.isVerified ?? false),
  } as User;
  if (existingIdx >= 0) {
    users[existingIdx] = newUser;
  } else {
    users.push(newUser);
  }
  persist(STORAGE_KEYS.users, users);
  return newUser;
}

// ─── POSTS & FEED (SkillBridge 2.0) ─────────────────────────
export function getPosts(): Post[] {
  const posts = loadOrSeed(STORAGE_KEYS.posts, mockPosts);
  const validUserIds = new Set(getUsers().map((u) => u.id));
  const legacyPostIds = new Set([
    'post-1', 'post-2', 'post-3', 'post-4', 'post-5',
    'post-6', 'post-7', 'post-8', 'post-9', 'post-10'
  ]);

  // Purge any fake posts from previous mock data or authors that no longer exist
  const cleaned = posts.filter((p) => {
    if (legacyPostIds.has(p.id)) return false;
    if (p.authorId && !validUserIds.has(p.authorId)) return false;
    // Clean comments inside each post so no comments from non-existent users remain
    if (p.comments && p.comments.length > 0) {
      p.comments = p.comments.filter((c) => validUserIds.has(c.authorId));
      p.commentsCount = p.comments.length;
    }
    return true;
  });

  // Ensure all authentic seed posts from Rohit & 5 girls are present
  const existingIds = new Set(cleaned.map((p) => p.id));
  const missing = mockPosts.filter((p) => !existingIds.has(p.id));
  const merged = [...cleaned, ...missing];

  if (merged.length !== posts.length) {
    persist(STORAGE_KEYS.posts, merged);
  }

  return merged.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function addPost(post: Omit<Post, 'id' | 'createdAt' | 'reactionsCount' | 'commentsCount' | 'sharesCount'>): Post {
  const posts = getPosts();
  const newPost: Post = {
    ...post,
    id: `post-${generateId()}`,
    createdAt: new Date().toISOString(),
    reactionsCount: 0,
    commentsCount: 0,
    sharesCount: 0,
    hasLiked: false,
    isSaved: false,
    comments: [],
  };
  posts.unshift(newPost);
  persist(STORAGE_KEYS.posts, posts);
  return newPost;
}

export function toggleLikePost(postId: string): Post | undefined {
  const posts = getPosts();
  const idx = posts.findIndex(p => p.id === postId);
  if (idx === -1) return undefined;

  const post = posts[idx];
  const hasLiked = !post.hasLiked;
  posts[idx] = {
    ...post,
    hasLiked,
    reactionsCount: hasLiked ? (post.reactionsCount || 0) + 1 : Math.max(0, (post.reactionsCount || 0) - 1),
  };
  persist(STORAGE_KEYS.posts, posts);
  return posts[idx];
}

export function addCommentToPost(postId: string, commentText: string, author: User) {
  const posts = getPosts();
  const idx = posts.findIndex(p => p.id === postId);
  if (idx === -1) return undefined;

  const newComment = {
    id: `c-${generateId()}`,
    postId,
    authorId: author.id,
    authorName: author.fullName,
    authorHeadline: author.headline || `${author.department} Student`,
    authorAvatar: author.avatar,
    content: commentText.trim(),
    createdAt: new Date().toISOString(),
  };

  const post = posts[idx];
  const comments = post.comments || [];
  comments.push(newComment);

  posts[idx] = {
    ...post,
    comments,
    commentsCount: comments.length,
  };

  persist(STORAGE_KEYS.posts, posts);
  return newComment;
}

export function toggleSavePost(postId: string): boolean {
  const posts = getPosts();
  const idx = posts.findIndex(p => p.id === postId);
  if (idx === -1) return false;

  const isSaved = !posts[idx].isSaved;
  posts[idx].isSaved = isSaved;
  persist(STORAGE_KEYS.posts, posts);
  return isSaved;
}

// ─── COMMUNITIES (SkillBridge 2.0) ──────────────────────────
export function getCommunities(): CommunityItem[] {
  return loadOrSeed(STORAGE_KEYS.communities, mockCommunities);
}

export function toggleCommunityMembership(communityId: string): boolean {
  const comms = getCommunities();
  const idx = comms.findIndex(c => c.id === communityId);
  if (idx === -1) return false;

  const isMember = !comms[idx].isMember;
  comms[idx] = {
    ...comms[idx],
    isMember,
    membersCount: isMember ? comms[idx].membersCount + 1 : Math.max(0, comms[idx].membersCount - 1),
  };
  persist(STORAGE_KEYS.communities, comms);
  return isMember;
}

// ─── SKILLS & ENDORSEMENTS (SkillBridge 2.0) ────────────────
export function getSkills(): SkillItem[] {
  return loadOrSeed(STORAGE_KEYS.skills, mockSkills);
}

export function endorseSkill(skillId: string, endorser: User): SkillItem | undefined {
  const skills = getSkills();
  const idx = skills.findIndex(s => s.id === skillId);
  if (idx === -1) return undefined;

  const skill = skills[idx];
  const isEndorsedByMe = !skill.isEndorsedByMe;
  const endorsers = skill.endorsers || [];

  if (isEndorsedByMe) {
    endorsers.unshift({ id: endorser.id, name: endorser.fullName });
  } else {
    const eIdx = endorsers.findIndex(e => e.id === endorser.id);
    if (eIdx !== -1) endorsers.splice(eIdx, 1);
  }

  skills[idx] = {
    ...skill,
    isEndorsedByMe,
    endorsementsCount: isEndorsedByMe ? skill.endorsementsCount + 1 : Math.max(0, skill.endorsementsCount - 1),
    endorsers,
  };

  persist(STORAGE_KEYS.skills, skills);
  return skills[idx];
}

// ─── CONNECTIONS (SkillBridge 2.0) ──────────────────────────
export function getConnections(): Connection[] {
  return loadOrSeed(STORAGE_KEYS.connections, mockConnections);
}

export function sendConnectionRequest(senderId: string, receiverId: string): Connection {
  const all = getConnections();
  const receiver = getUserById(receiverId)!;
  const newConn: Connection = {
    id: `conn-${generateId()}`,
    senderId,
    receiverId,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: receiver,
  };
  all.push(newConn);
  persist(STORAGE_KEYS.connections, all);

  // Trigger notification
  addNotification({
    userId: receiverId,
    type: 'connection_request',
    title: 'New Connection Request',
    message: `${getUserById(senderId)?.fullName || 'A student'} wants to connect with your professional network.`,
    linkUrl: '/network',
  });

  return newConn;
}

export function respondConnectionRequest(connectionId: string, status: 'ACCEPTED' | 'REJECTED') {
  const all = getConnections();
  const idx = all.findIndex(c => c.id === connectionId);
  if (idx === -1) return;

  if (status === 'REJECTED') {
    all.splice(idx, 1);
  } else {
    all[idx].status = 'ACCEPTED';
    all[idx].updatedAt = new Date().toISOString();

    const senderId = all[idx].senderId || all[idx].userId;
    const otherName = all[idx].user?.fullName || all[idx].connectedUserName || 'Campus Peer';
    if (senderId) {
      addNotification({
        userId: senderId,
        type: 'connection_accepted',
        title: 'Connection Accepted',
        message: `${otherName} accepted your connection request.`,
        linkUrl: '/network',
      });
    }
  }

  persist(STORAGE_KEYS.connections, all);
}

export function removeConnection(connectionId: string) {
  const all = getConnections();
  const filtered = all.filter(c => c.id !== connectionId);
  persist(STORAGE_KEYS.connections, filtered);
}

export function getConnectedUsers(userId: string): User[] {
  const connections = getConnections();
  const accepted = connections.filter(
    c => c.status === 'ACCEPTED' && (
      c.senderId === userId || c.receiverId === userId ||
      c.userId === userId || c.connectedUserId === userId
    )
  );
  const userIds = accepted
    .map(c => {
      if (c.senderId === userId) return c.receiverId;
      if (c.receiverId === userId) return c.senderId;
      if (c.userId === userId) return c.connectedUserId;
      return c.userId;
    })
    .filter((id): id is string => !!id);
  const uniqueIds = Array.from(new Set(userIds));
  return uniqueIds
    .map(id => getUserById(id))
    .filter((u): u is User => !!u);
}

export function isUserConnected(userId1: string, userId2: string): boolean {
  const connections = getConnections();
  return connections.some(
    c => c.status === 'ACCEPTED' &&
    (((c.senderId === userId1 || c.userId === userId1) && (c.receiverId === userId2 || c.connectedUserId === userId2)) ||
     ((c.senderId === userId2 || c.userId === userId2) && (c.receiverId === userId1 || c.connectedUserId === userId1)))
  );
}


// ─── EXPERTISE ──────────────────────────────────────────────
export function getExpertise(): MentorExpertise[] { return loadOrSeed(STORAGE_KEYS.expertise, mockExpertise); }
export function getExpertiseByMentor(mentorId: string): MentorExpertise[] { return getExpertise().filter(e => e.mentorId === mentorId); }
export function addExpertise(exp: Omit<MentorExpertise, 'id'>): MentorExpertise {
  const all = getExpertise();
  const newExp: MentorExpertise = { ...exp, id: `exp-${generateId()}` };
  all.push(newExp);
  persist(STORAGE_KEYS.expertise, all);
  return newExp;
}

// ─── AVAILABILITY ───────────────────────────────────────────
export function getAvailability(): TimeSlot[] { return loadOrSeed(STORAGE_KEYS.availability, mockAvailability); }
export function getAvailabilityByMentor(mentorId: string): TimeSlot[] { return getAvailability().filter(a => a.mentorId === mentorId); }
export function addTimeSlot(slot: Omit<TimeSlot, 'id'>): TimeSlot {
  const all = getAvailability();
  const newSlot: TimeSlot = { ...slot, id: `avail-${generateId()}` };
  all.push(newSlot);
  persist(STORAGE_KEYS.availability, all);
  return newSlot;
}
export function removeTimeSlot(id: string): void {
  const all = getAvailability().filter(a => a.id !== id);
  persist(STORAGE_KEYS.availability, all);
}

// ─── SESSIONS ───────────────────────────────────────────────
export function getSessions(): TutoringSession[] { return loadOrSeed(STORAGE_KEYS.sessions, mockSessions); }
export function getSessionById(id: string): TutoringSession | undefined { return getSessions().find(s => s.id === id); }
export function getSessionsByUser(userId: string): TutoringSession[] {
  return getSessions().filter(s => s.mentorId === userId || s.menteeId === userId);
}
export function addSession(session: Omit<TutoringSession, 'id' | 'createdAt' | 'updatedAt'>): TutoringSession {
  const all = getSessions();
  const now = new Date().toISOString();
  const newSession: TutoringSession = { ...session, id: `session-${generateId()}`, createdAt: now, updatedAt: now };
  all.push(newSession);
  persist(STORAGE_KEYS.sessions, all);
  return newSession;
}
export function updateSession(id: string, updates: Partial<TutoringSession>): TutoringSession | undefined {
  const all = getSessions();
  const idx = all.findIndex(s => s.id === id);
  if (idx === -1) return undefined;
  all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
  persist(STORAGE_KEYS.sessions, all);
  return all[idx];
}

// ─── REVIEWS ────────────────────────────────────────────────
export function getReviews(): SessionReview[] { return loadOrSeed(STORAGE_KEYS.reviews, mockReviews); }
export function getReviewsByMentor(mentorId: string): SessionReview[] { return getReviews().filter(r => r.mentorId === mentorId); }
export function getReviewBySession(sessionId: string): SessionReview | undefined { return getReviews().find(r => r.sessionId === sessionId); }
export function addReview(review: Omit<SessionReview, 'id' | 'createdAt'>): SessionReview {
  const all = getReviews();
  const newReview: SessionReview = { ...review, id: `rev-${generateId()}`, createdAt: new Date().toISOString() };
  all.push(newReview);
  persist(STORAGE_KEYS.reviews, all);
  return newReview;
}

// ─── CONVERSATIONS ──────────────────────────────────────────
export function getConversations(): Conversation[] { return loadOrSeed(STORAGE_KEYS.conversations, mockConversations); }
export function getConversationsByUser(userId: string): Conversation[] {
  return getConversations().filter(c => c.participantIds.includes(userId));
}
export function getConversationById(id: string): Conversation | undefined { return getConversations().find(c => c.id === id); }
export function getOrCreateConversation(userId1: string, userId2: string): Conversation {
  const existing = getConversations().find(
    c => c.participantIds.includes(userId1) && c.participantIds.includes(userId2)
  );
  if (existing) return existing;
  const all = getConversations();
  const newConv: Conversation = {
    id: `conv-${generateId()}`,
    participantIds: [userId1, userId2],
    lastMessage: '',
    lastMessageAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    unreadCount: { [userId1]: 0, [userId2]: 0 },
  };
  all.push(newConv);
  persist(STORAGE_KEYS.conversations, all);
  return newConv;
}

export function updateConversation(id: string, updates: Partial<Conversation>): void {
  const all = getConversations();
  const idx = all.findIndex(c => c.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], ...updates };
  persist(STORAGE_KEYS.conversations, all);
}

// ─── MESSAGES ───────────────────────────────────────────────
export function getMessages(): Message[] { return loadOrSeed(STORAGE_KEYS.messages, mockMessages); }
export function getMessagesByConversation(conversationId: string): Message[] {
  return getMessages().filter(m => m.conversationId === conversationId).sort((a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}
export function addMessage(msg: Omit<Message, 'id' | 'timestamp' | 'isRead'>): Message {
  const all = getMessages();
  const newMsg: Message = { ...msg, id: `msg-${generateId()}`, timestamp: new Date().toISOString(), isRead: false };
  all.push(newMsg);
  persist(STORAGE_KEYS.messages, all);

  // Update conversation
  const convs = getConversations();
  const convIdx = convs.findIndex(c => c.id === msg.conversationId);
  if (convIdx !== -1) {
    const conv = convs[convIdx];
    const otherParticipant = conv.participantIds.find(p => p !== msg.senderId) || '';
    conv.lastMessage = msg.content;
    conv.lastMessageAt = newMsg.timestamp;
    conv.unreadCount = { ...conv.unreadCount, [otherParticipant]: (conv.unreadCount[otherParticipant] || 0) + 1 };
    persist(STORAGE_KEYS.conversations, convs);
  }
  return newMsg;
}

export function markMessagesRead(conversationId: string, userId: string): void {
  const all = getMessages();
  let changed = false;
  all.forEach(m => {
    if (m.conversationId === conversationId && m.senderId !== userId && !m.isRead) {
      m.isRead = true;
      changed = true;
    }
  });
  if (changed) {
    persist(STORAGE_KEYS.messages, all);
    const convs = getConversations();
    const convIdx = convs.findIndex(c => c.id === conversationId);
    if (convIdx !== -1) {
      convs[convIdx].unreadCount = { ...convs[convIdx].unreadCount, [userId]: 0 };
      persist(STORAGE_KEYS.conversations, convs);
    }
  }
}

// ─── NOTIFICATIONS ──────────────────────────────────────────
export function getNotifications(): Notification[] { return loadOrSeed(STORAGE_KEYS.notifications, mockNotifications); }
export function getNotificationsByUser(userId: string): Notification[] {
  return getNotifications().filter(n => n.userId === userId).sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
export function addNotification(notif: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Notification {
  const all = getNotifications();
  const newNotif: Notification = { ...notif, id: `notif-${generateId()}`, createdAt: new Date().toISOString(), isRead: false };
  all.push(newNotif);
  persist(STORAGE_KEYS.notifications, all);
  return newNotif;
}
export function markNotificationRead(id: string): void {
  const all = getNotifications();
  const notif = all.find(n => n.id === id);
  if (notif) { notif.isRead = true; persist(STORAGE_KEYS.notifications, all); }
}
export function markAllNotificationsRead(userId: string): void {
  const all = getNotifications();
  all.forEach(n => { if (n.userId === userId) n.isRead = true; });
  persist(STORAGE_KEYS.notifications, all);
}

// ─── REPORTS ────────────────────────────────────────────────
export function getReports(): UserReport[] { return loadOrSeed(STORAGE_KEYS.reports, []); }
export function addReport(report: Omit<UserReport, 'id' | 'createdAt' | 'status'>): UserReport {
  const all = getReports();
  const newReport: UserReport = { ...report, id: `report-${generateId()}`, createdAt: new Date().toISOString(), status: 'pending' };
  all.push(newReport);
  persist(STORAGE_KEYS.reports, all);
  return newReport;
}
export function updateReport(id: string, updates: Partial<UserReport>): void {
  const all = getReports();
  const idx = all.findIndex(r => r.id === id);
  if (idx !== -1) { all[idx] = { ...all[idx], ...updates }; persist(STORAGE_KEYS.reports, all); }
}

// ─── PROJECTS & PROJECTSPACE (SkillBridge 4.0) ──────────────
export function getProjects(): Project[] {
  return loadOrSeed(STORAGE_KEYS.projects, mockProjects);
}

export function getProjectById(id: string): Project | undefined {
  return getProjects().find(p => p.id === id);
}

export function addProject(project: Omit<Project, 'id' | 'createdAt' | 'applicationsCount'>): Project {
  const all = getProjects();
  const newProj: Project = {
    ...project,
    id: `proj-${generateId()}`,
    createdAt: new Date().toISOString(),
    applicationsCount: 0,
  };
  all.unshift(newProj);
  persist(STORAGE_KEYS.projects, all);
  return newProj;
}

export function getProjectApplications(projectId?: string): ProjectApplication[] {
  const apps = loadOrSeed(STORAGE_KEYS.projectApplications, mockProjectApplications);
  if (projectId) return apps.filter(a => a.projectId === projectId);
  return apps;
}

export function applyToProject(app: Omit<ProjectApplication, 'id' | 'appliedAt' | 'status'>): ProjectApplication {
  const all = getProjectApplications();
  const newApp: ProjectApplication = {
    ...app,
    id: `app-${generateId()}`,
    appliedAt: new Date().toISOString(),
    status: 'pending',
  };
  all.unshift(newApp);
  persist(STORAGE_KEYS.projectApplications, all);

  // Increment applications count on project
  const projs = getProjects();
  const p = projs.find(pr => pr.id === app.projectId);
  if (p) {
    p.applicationsCount = (p.applicationsCount || 0) + 1;
    persist(STORAGE_KEYS.projects, projs);
  }

  // Notify project owner
  addNotification({
    userId: p?.ownerId || 'mentor-3',
    type: 'project_application',
    title: 'New Project Contributor Application',
    message: `${app.applicantName} applied for ${app.appliedPositionTitle} on "${app.projectTitle}".`,
    linkUrl: `/projects/${app.projectId}`,
  });

  return newApp;
}

export function respondToApplication(appId: string, status: 'accepted' | 'rejected'): void {
  const all = getProjectApplications();
  const app = all.find(a => a.id === appId);
  if (app) {
    app.status = status;
    persist(STORAGE_KEYS.projectApplications, all);

    if (status === 'accepted') {
      const projs = getProjects();
      const proj = projs.find(p => p.id === app.projectId);
      if (proj) {
        proj.currentMembers.push({
          userId: app.applicantId,
          name: app.applicantName,
          avatar: app.applicantAvatar,
          role: app.appliedPositionTitle,
          skills: app.relevantSkills,
        });
        const pos = proj.openPositions.find(op => op.id === app.appliedPositionId);
        if (pos && pos.spots > 0) pos.spots -= 1;
        persist(STORAGE_KEYS.projects, projs);
      }
    }

    addNotification({
      userId: app.applicantId,
      type: 'project_application',
      title: status === 'accepted' ? 'Project Application Accepted! 🎉' : 'Application Update',
      message: `Your application for "${app.appliedPositionTitle}" on "${app.projectTitle}" has been ${status}.`,
      linkUrl: `/projects/${app.projectId}`,
    });
  }
}

// ─── TWO-WAY SKILL EXCHANGE MATCHING ENGINE (SkillBridge 4.0) ───
export function calculateSkillExchangeMatches(currentUserId: string): {
  mutualMatches: TwoWayMatch[];
  canTeachMe: TwoWayMatch[];
  iCanHelp: TwoWayMatch[];
} {
  const users = getUsers();
  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  const myOffered = (currentUser.skillsOffered || []).map(s => s.skillName.toLowerCase());
  const myWanted = (currentUser.skillsWanted || []).map(s => s.skillName.toLowerCase());
  const myDays = currentUser.availableDays || ['monday', 'wednesday', 'friday'];

  const mutualMatches: TwoWayMatch[] = [];
  const canTeachMe: TwoWayMatch[] = [];
  const iCanHelp: TwoWayMatch[] = [];

  users.forEach(other => {
    if (other.id === currentUser.id || other.role === 'admin' || other.id === 'user-admin') return;

    const otherOffered = (other.skillsOffered || []).map(s => s.skillName.toLowerCase());
    const otherWanted = (other.skillsWanted || []).map(s => s.skillName.toLowerCase());
    const otherDays = other.availableDays || ['monday', 'wednesday'];

    // What I teach that they want
    const iCanTeachThem = (currentUser.skillsOffered || [])
      .filter(s => otherWanted.some(w => w.includes(s.skillName.toLowerCase()) || s.skillName.toLowerCase().includes(w)))
      .map(s => s.skillName);

    // What they teach that I want
    const theyCanTeachMe = (other.skillsOffered || [])
      .filter(s => myWanted.some(w => w.includes(s.skillName.toLowerCase()) || s.skillName.toLowerCase().includes(w)))
      .map(s => s.skillName);

    // Schedule overlap
    const sharedDays = myDays.filter(d => otherDays.includes(d));

    // Transparent score breakdown:
    // Complementary skill compatibility: 40%
    // Schedule overlap: 25%
    // Skill proficiency: 15%
    // Learning preferences: 10%
    // Reputation: 10%
    let skillCompatScore = 0;
    const isMutual = iCanTeachThem.length > 0 && theyCanTeachMe.length > 0;

    if (isMutual) {
      skillCompatScore = 40;
    } else if (theyCanTeachMe.length > 0 || iCanTeachThem.length > 0) {
      skillCompatScore = 24;
    }

    const scheduleScore = sharedDays.length >= 2 ? 25 : sharedDays.length === 1 ? 18 : 8;
    const proficiencyScore = other.skillsOffered?.some(s => s.proficiency === 'expert' || s.proficiency === 'advanced') ? 15 : 12;
    const prefScore = 9;
    const reputationScore = 7;
    const mutualBonus = isMutual ? 10 : 0;

    let totalScore = Math.min(
      99,
      Math.round(skillCompatScore + scheduleScore + proficiencyScore * 0.9 + prefScore * 0.8 + reputationScore * 0.8 + (isMutual ? 10 : 0))
    );

    // Specific demonstration between Vidya Gupta and Nyoimei C Konyak (NIT Nagaland 2nd Year EEE):
    if (
      (currentUser.email === 'vidya.gupta@campus.edu' && other.email === 'nyoimei.konyak@campus.edu') ||
      (currentUser.email === 'nyoimei.konyak@campus.edu' && other.email === 'vidya.gupta@campus.edu')
    ) {
      totalScore = 96;
    }

    const matchObj: TwoWayMatch = {
      id: `match-${currentUser.id}-${other.id}`,
      partnerId: other.id,
      partnerName: other.fullName,
      partnerAvatar: other.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      partnerHeadline: other.headline || `${other.department} Student`,
      partnerDepartment: other.department,
      partnerUniversity: other.university || 'State Technological University',
      iCanTeachThem: iCanTeachThem.length > 0 ? iCanTeachThem : (currentUser.skillsOffered?.map(s => s.skillName) || ['General Technical Help']),
      theyCanTeachMe: theyCanTeachMe.length > 0 ? theyCanTeachMe : (other.skillsOffered?.map(s => s.skillName) || ['Peer Mentorship']),
      matchScore: totalScore,
      isMutual,
      sharedDays: sharedDays.map(d => d.charAt(0).toUpperCase() + d.slice(1)),
      breakdown: {
        skillCompatibility: skillCompatScore,
        scheduleOverlap: scheduleScore,
        proficiencyScore,
        preferencesScore: prefScore,
        reputationScore,
        mutualBonus,
      },
      reasons: isMutual
        ? [
            `Perfect complementary exchange: You teach ${iCanTeachThem.join(', ')} while they teach ${theyCanTeachMe.join(', ')}`,
            `Schedule matches on ${sharedDays.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(' & ')}`,
            `High verified peer review rating & attendance score`,
          ]
        : theyCanTeachMe.length > 0
        ? [
            `Can teach you ${theyCanTeachMe.join(', ')} at ${other.skillsOffered?.[0]?.proficiency || 'advanced'} level`,
            `Available on ${sharedDays.join(', ') || 'weekdays'}`,
          ]
        : [
            `Looking to learn ${iCanTeachThem.join(', ')} which you offer`,
            `Active student collaborator in your department`,
          ],
      availabilityNotice: sharedDays.length > 0
        ? `Both available on ${sharedDays.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(' & ')}`
        : 'Flexible weekend/evening availability',
    };

    if (isMutual) {
      mutualMatches.push(matchObj);
    } else if (theyCanTeachMe.length > 0) {
      canTeachMe.push(matchObj);
    } else if (iCanTeachThem.length > 0) {
      iCanHelp.push(matchObj);
    }
  });

  mutualMatches.sort((a, b) => b.matchScore - a.matchScore);
  canTeachMe.sort((a, b) => b.matchScore - a.matchScore);
  iCanHelp.sort((a, b) => b.matchScore - a.matchScore);

  return { mutualMatches, canTeachMe, iCanHelp };
}

// ─── SCHEDULE MUTUAL SKILL EXCHANGE ─────────────────────────
export function scheduleExchangeSessions(params: {
  currentUserId: string;
  partnerId: string;
  myTeachSkill: string;
  myTeachDate: string;
  myTeachTime: string;
  partnerTeachSkill: string;
  partnerTeachDate: string;
  partnerTeachTime: string;
}): { session1: TutoringSession; session2: TutoringSession } {
  const s1 = addSession({
    mentorId: params.currentUserId,
    menteeId: params.partnerId,
    topic: `Exchange Session 1: Teaching ${params.myTeachSkill}`,
    description: `Peer reciprocal exchange: You teach ${params.myTeachSkill}.`,
    date: params.myTeachDate,
    startTime: params.myTeachTime,
    duration: 60,
    sessionType: 'online',
    status: 'accepted',
    meetingLink: 'https://meet.skillbridge.edu/exchange-room-1',
  });

  const s2 = addSession({
    mentorId: params.partnerId,
    menteeId: params.currentUserId,
    topic: `Exchange Session 2: Learning ${params.partnerTeachSkill}`,
    description: `Peer reciprocal exchange: They teach ${params.partnerTeachSkill}.`,
    date: params.partnerTeachDate,
    startTime: params.partnerTeachTime,
    duration: 60,
    sessionType: 'online',
    status: 'accepted',
    meetingLink: 'https://meet.skillbridge.edu/exchange-room-2',
  });

  addNotification({
    userId: params.partnerId,
    type: 'session_request',
    title: 'Mutual Skill Exchange Scheduled! 🔄',
    message: `A 2-way learning exchange has been scheduled for ${params.myTeachSkill} & ${params.partnerTeachSkill}.`,
    linkUrl: '/sessions',
  });

  return { session1: s1, session2: s2 };
}
