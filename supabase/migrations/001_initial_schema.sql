-- SkillBridge Database Schema
-- PostgreSQL / Supabase Migration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar TEXT DEFAULT '',
  role TEXT NOT NULL CHECK (role IN ('mentee', 'mentor', 'admin')),
  department TEXT NOT NULL DEFAULT '',
  year TEXT NOT NULL DEFAULT '',
  bio TEXT DEFAULT '',
  is_verified BOOLEAN DEFAULT FALSE,
  is_suspended BOOLEAN DEFAULT FALSE,
  learning_preferences TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{English}',
  online_status TEXT DEFAULT 'offline' CHECK (online_status IN ('available', 'busy', 'offline')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- ============================================================
-- MENTOR EXPERTISE
-- ============================================================
CREATE TABLE mentor_expertise (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('technical', 'academic')),
  proficiency_level INT NOT NULL CHECK (proficiency_level BETWEEN 1 AND 5),
  description TEXT DEFAULT '',
  years_of_experience INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_expertise_mentor ON mentor_expertise(mentor_id);
CREATE INDEX idx_expertise_topic ON mentor_expertise(topic);

-- ============================================================
-- MENTOR AVAILABILITY
-- ============================================================
CREATE TABLE mentor_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('monday','tuesday','wednesday','thursday','friday','saturday','sunday')),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_recurring BOOLEAN DEFAULT TRUE,
  specific_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

CREATE INDEX idx_availability_mentor ON mentor_availability(mentor_id);

-- ============================================================
-- LEARNING REQUESTS
-- ============================================================
CREATE TABLE learning_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  description TEXT DEFAULT '',
  preferred_session_type TEXT DEFAULT 'online' CHECK (preferred_session_type IN ('online', 'in-person')),
  preferred_language TEXT DEFAULT 'English',
  preferred_days TEXT[] DEFAULT '{}',
  urgency TEXT DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'matched', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_requests_mentee ON learning_requests(mentee_id);

-- ============================================================
-- MENTOR MATCHES
-- ============================================================
CREATE TABLE mentor_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES learning_requests(id) ON DELETE SET NULL,
  mentee_id UUID NOT NULL REFERENCES profiles(id),
  mentor_id UUID NOT NULL REFERENCES profiles(id),
  match_score INT NOT NULL CHECK (match_score BETWEEN 0 AND 100),
  topic_relevance INT DEFAULT 0,
  availability_score INT DEFAULT 0,
  rating_score INT DEFAULT 0,
  proficiency_score INT DEFAULT 0,
  preference_score INT DEFAULT 0,
  reasons TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_matches_mentee ON mentor_matches(mentee_id);
CREATE INDEX idx_matches_mentor ON mentor_matches(mentor_id);

-- ============================================================
-- TUTORING SESSIONS
-- ============================================================
CREATE TABLE tutoring_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES profiles(id),
  mentee_id UUID NOT NULL REFERENCES profiles(id),
  topic TEXT NOT NULL,
  description TEXT DEFAULT '',
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration INT NOT NULL DEFAULT 60,
  session_type TEXT NOT NULL DEFAULT 'online' CHECK (session_type IN ('online', 'in-person')),
  location TEXT,
  meeting_link TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
  cancelled_by UUID REFERENCES profiles(id),
  cancellation_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_mentor ON tutoring_sessions(mentor_id);
CREATE INDEX idx_sessions_mentee ON tutoring_sessions(mentee_id);
CREATE INDEX idx_sessions_status ON tutoring_sessions(status);
CREATE INDEX idx_sessions_date ON tutoring_sessions(session_date);

-- ============================================================
-- CONVERSATIONS
-- ============================================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_ids UUID[] NOT NULL,
  last_message TEXT DEFAULT '',
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MESSAGES
-- ============================================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);

-- ============================================================
-- SESSION REVIEWS
-- ============================================================
CREATE TABLE session_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL UNIQUE REFERENCES tutoring_sessions(id),
  mentor_id UUID NOT NULL REFERENCES profiles(id),
  mentee_id UUID NOT NULL REFERENCES profiles(id),
  overall_rating INT NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  teaching_quality INT NOT NULL CHECK (teaching_quality BETWEEN 1 AND 5),
  communication INT NOT NULL CHECK (communication BETWEEN 1 AND 5),
  subject_knowledge INT NOT NULL CHECK (subject_knowledge BETWEEN 1 AND 5),
  review TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_mentor ON session_reviews(mentor_id);
CREATE UNIQUE INDEX idx_reviews_session ON session_reviews(session_id);

-- ============================================================
-- USER REPORTS
-- ============================================================
CREATE TABLE user_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES profiles(id),
  reported_user_id UUID NOT NULL REFERENCES profiles(id),
  reason TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reports_status ON user_reports(status);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  related_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, is_read);

-- ============================================================
-- ROW LEVEL SECURITY (when Supabase is configured)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_expertise ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutoring_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid()::text = id::text);

-- Expertise: viewable by everyone, mentors manage own
CREATE POLICY "Expertise viewable by everyone" ON mentor_expertise FOR SELECT USING (true);
CREATE POLICY "Mentors manage own expertise" ON mentor_expertise FOR ALL USING (auth.uid()::text = mentor_id::text);

-- Sessions: participants can view and manage
CREATE POLICY "Session participants can view" ON tutoring_sessions FOR SELECT
  USING (auth.uid()::text = mentor_id::text OR auth.uid()::text = mentee_id::text);

-- Messages: conversation participants only
CREATE POLICY "Message participants can view" ON messages FOR SELECT
  USING (auth.uid()::text = sender_id::text OR
    EXISTS (SELECT 1 FROM conversations c WHERE c.id = conversation_id AND auth.uid()::text = ANY(c.participant_ids::text[])));

-- Notifications: users can view own
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid()::text = user_id::text);
