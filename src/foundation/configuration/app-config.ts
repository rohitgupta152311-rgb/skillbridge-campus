export const APP_CONFIG = {
  version: '1.0.0',
  name: 'SkillBridge',
  campusDomain: 'campus.edu',
  sessionDefaults: {
    minDuration: 30,
    maxDuration: 120,
    defaultDuration: 60,
  },
  matchingWeights: {
    topicRelevance: 0.35,
    availabilityCompatibility: 0.25,
    mentorRating: 0.20,
    skillProficiency: 0.10,
    learningPreference: 0.10,
  },
  pagination: {
    defaultPageSize: 12,
  },
  safety: {
    maxReportsBeforeAutoReview: 3,
    allowAnonymousReports: false,
  },
  features: {
    enableSupabaseBackend: true,
    fallbackToLocalStorage: true,
    enableRealtimeChat: true,
  }
} as const;
