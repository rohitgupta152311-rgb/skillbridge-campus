import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../shared/layouts/DashboardLayout';
import { ProtectedRoute, RoleRedirect } from '../identity/authorization/ProtectedRoute';
import { RouteErrorBoundary, PageSkeleton } from '../shared/components';

// Helper for route fallback suspense
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageSkeleton />}>
    <Component />
  </Suspense>
);

// Lazy-loaded Public Pages
const LandingPage = lazy(() => import('../experiences/landing/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('../identity/authentication/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../identity/authentication/RegisterPage').then(m => ({ default: m.RegisterPage })));
const DownloadAppPage = lazy(() => import('../experiences/download-app/DownloadAppPage').then(m => ({ default: m.DownloadAppPage })));

// Lazy-loaded Universal Authenticated Campus Network Pages
const ActivityFeedPage = lazy(() => import('../experiences/activity-feed/ActivityFeedPage').then(m => ({ default: m.ActivityFeedPage })));
const ExplorePage = lazy(() => import('../experiences/explore/ExplorePage').then(m => ({ default: m.ExplorePage })));
const SkillExchangePage = lazy(() => import('../experiences/skill-exchange/SkillExchangePage').then(m => ({ default: m.SkillExchangePage })));
const ProjectSpacePage = lazy(() => import('../experiences/projects/ProjectSpacePage').then(m => ({ default: m.ProjectSpacePage })));
const ProjectDetailPage = lazy(() => import('../experiences/projects/ProjectDetailPage').then(m => ({ default: m.ProjectDetailPage })));
const NetworkPage = lazy(() => import('../experiences/networking/NetworkPage').then(m => ({ default: m.NetworkPage })));
const CommunitiesPage = lazy(() => import('../experiences/communities/CommunitiesPage').then(m => ({ default: m.CommunitiesPage })));
const NotificationsPage = lazy(() => import('../experiences/notifications/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const ProfilePage = lazy(() => import('../experiences/personal-profile/ProfilePage').then(m => ({ default: m.ProfilePage })));
const OnboardingPage = lazy(() => import('../experiences/onboarding/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const SettingsPage = lazy(() => import('../experiences/settings/SettingsPage').then(m => ({ default: m.SettingsPage })));
const ConversationCenterPage = lazy(() => import('../experiences/conversation-center/ConversationCenterPage').then(m => ({ default: m.ConversationCenterPage })));

// Lazy-loaded Mentee & Student Pages
const LearnerDashboard = lazy(() => import('../experiences/learner-dashboard/LearnerDashboard').then(m => ({ default: m.LearnerDashboard })));
const MentorDiscoveryPage = lazy(() => import('../experiences/mentor-discovery/MentorDiscoveryPage').then(m => ({ default: m.MentorDiscoveryPage })));
const MentorProfilePage = lazy(() => import('../experiences/mentor-discovery/MentorProfilePage').then(m => ({ default: m.MentorProfilePage })));
const SmartMatchingPage = lazy(() => import('../experiences/smart-matching/SmartMatchingPage').then(m => ({ default: m.SmartMatchingPage })));
const SessionBookingPage = lazy(() => import('../experiences/session-booking/SessionBookingPage').then(m => ({ default: m.SessionBookingPage })));
const SessionsPage = lazy(() => import('../experiences/session-booking/SessionsPage').then(m => ({ default: m.SessionsPage })));
const FeedbackPage = lazy(() => import('../experiences/feedback-center/FeedbackPage').then(m => ({ default: m.FeedbackPage })));

// Lazy-loaded Mentor Pages
const MentorDashboard = lazy(() => import('../experiences/mentor-dashboard/MentorDashboard').then(m => ({ default: m.MentorDashboard })));
const AvailabilityPage = lazy(() => import('../experiences/mentor-dashboard/AvailabilityPage').then(m => ({ default: m.AvailabilityPage })));
const MentorReviewsPage = lazy(() => import('../experiences/feedback-center/MentorReviewsPage').then(m => ({ default: m.MentorReviewsPage })));

// Lazy-loaded Admin Panel Pages (recharts & deep telemetry)
const AdminDashboard = lazy(() => import('../experiences/admin-panel/AdminPages').then(m => ({ default: m.AdminDashboard })));
const AdminUsersPage = lazy(() => import('../experiences/admin-panel/AdminPages').then(m => ({ default: m.AdminUsersPage })));
const AdminConversationsPage = lazy(() => import('../experiences/admin-panel/AdminPages').then(m => ({ default: m.AdminConversationsPage })));
const AdminActivityPage = lazy(() => import('../experiences/admin-panel/AdminPages').then(m => ({ default: m.AdminActivityPage })));
const AdminAnalyticsPage = lazy(() => import('../experiences/admin-panel/AdminPages').then(m => ({ default: m.AdminAnalyticsPage })));
const AdminReportsPage = lazy(() => import('../experiences/admin-panel/AdminPages').then(m => ({ default: m.AdminReportsPage })));
const AdminAuditLogsPage = lazy(() => import('../experiences/admin-panel/AdminPages').then(m => ({ default: m.AdminAuditLogsPage })));
const AdminSettingsPage = lazy(() => import('../experiences/admin-panel/AdminPages').then(m => ({ default: m.AdminSettingsPage })));

const router = createBrowserRouter([
  // Public routes
  { path: '/', element: withSuspense(LandingPage), errorElement: <RouteErrorBoundary /> },
  { path: '/login', element: withSuspense(LoginPage), errorElement: <RouteErrorBoundary /> },
  { path: '/register', element: withSuspense(RegisterPage), errorElement: <RouteErrorBoundary /> },
  { path: '/download', element: withSuspense(DownloadAppPage), errorElement: <RouteErrorBoundary /> },
  { path: '/download-app', element: withSuspense(DownloadAppPage), errorElement: <RouteErrorBoundary /> },
  { path: '/redirect', element: <RoleRedirect />, errorElement: <RouteErrorBoundary /> },

  // Universal Authenticated Campus Network Routes (Mentee, Mentor, Admin)
  {
    element: <ProtectedRoute allowedRoles={['mentee', 'mentor', 'admin']} />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <DashboardLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
          { path: '/feed', element: withSuspense(ActivityFeedPage), errorElement: <RouteErrorBoundary /> },
          { path: '/explore', element: withSuspense(ExplorePage), errorElement: <RouteErrorBoundary /> },
          { path: '/exchange', element: withSuspense(SkillExchangePage), errorElement: <RouteErrorBoundary /> },
          { path: '/projects', element: withSuspense(ProjectSpacePage), errorElement: <RouteErrorBoundary /> },
          { path: '/projects/:id', element: withSuspense(ProjectDetailPage), errorElement: <RouteErrorBoundary /> },
          { path: '/network', element: withSuspense(NetworkPage), errorElement: <RouteErrorBoundary /> },
          { path: '/communities', element: withSuspense(CommunitiesPage), errorElement: <RouteErrorBoundary /> },
          { path: '/notifications', element: withSuspense(NotificationsPage), errorElement: <RouteErrorBoundary /> },
          { path: '/profile', element: withSuspense(ProfilePage), errorElement: <RouteErrorBoundary /> },
          { path: '/onboarding', element: withSuspense(OnboardingPage), errorElement: <RouteErrorBoundary /> },
          { path: '/settings', element: withSuspense(SettingsPage), errorElement: <RouteErrorBoundary /> },
          { path: '/messages', element: withSuspense(ConversationCenterPage), errorElement: <RouteErrorBoundary /> },
          { path: '/messages/:conversationId', element: withSuspense(ConversationCenterPage), errorElement: <RouteErrorBoundary /> },
        ],
      },
    ],
  },

  // Mentee & Student Routes
  {
    element: <ProtectedRoute allowedRoles={['mentee']} />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <DashboardLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
          { path: '/dashboard', element: withSuspense(LearnerDashboard), errorElement: <RouteErrorBoundary /> },
          { path: '/discover', element: withSuspense(MentorDiscoveryPage), errorElement: <RouteErrorBoundary /> },
          { path: '/discover/:mentorId', element: withSuspense(MentorProfilePage), errorElement: <RouteErrorBoundary /> },
          { path: '/match', element: withSuspense(SmartMatchingPage), errorElement: <RouteErrorBoundary /> },
          { path: '/book/:mentorId', element: withSuspense(SessionBookingPage), errorElement: <RouteErrorBoundary /> },
          { path: '/sessions', element: withSuspense(SessionsPage), errorElement: <RouteErrorBoundary /> },
          { path: '/review/:sessionId', element: withSuspense(FeedbackPage), errorElement: <RouteErrorBoundary /> },
        ],
      },
    ],
  },

  // Mentor Routes
  {
    element: <ProtectedRoute allowedRoles={['mentor']} />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <DashboardLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
          { path: '/mentor/dashboard', element: withSuspense(MentorDashboard), errorElement: <RouteErrorBoundary /> },
          { path: '/mentor/sessions', element: withSuspense(SessionsPage), errorElement: <RouteErrorBoundary /> },
          { path: '/mentor/availability', element: withSuspense(AvailabilityPage), errorElement: <RouteErrorBoundary /> },
          { path: '/mentor/reviews', element: withSuspense(MentorReviewsPage), errorElement: <RouteErrorBoundary /> },
        ],
      },
    ],
  },

  // Admin Routes
  {
    element: <ProtectedRoute allowedRoles={['admin']} />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <DashboardLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
          { path: '/admin', element: withSuspense(AdminDashboard), errorElement: <RouteErrorBoundary /> },
          { path: '/admin/users', element: withSuspense(AdminUsersPage), errorElement: <RouteErrorBoundary /> },
          { path: '/admin/conversations', element: withSuspense(AdminConversationsPage), errorElement: <RouteErrorBoundary /> },
          { path: '/admin/activity', element: withSuspense(AdminActivityPage), errorElement: <RouteErrorBoundary /> },
          { path: '/admin/analytics', element: withSuspense(AdminAnalyticsPage), errorElement: <RouteErrorBoundary /> },
          { path: '/admin/reports', element: withSuspense(AdminReportsPage), errorElement: <RouteErrorBoundary /> },
          { path: '/admin/audit-logs', element: withSuspense(AdminAuditLogsPage), errorElement: <RouteErrorBoundary /> },
          { path: '/admin/settings', element: withSuspense(AdminSettingsPage), errorElement: <RouteErrorBoundary /> },
        ],
      },
    ],
  },

  // Catch-all
  { path: '*', element: <Navigate to="/" replace /> },
]);

export function ApplicationRoutes() {
  return <RouterProvider router={router} />;
}
