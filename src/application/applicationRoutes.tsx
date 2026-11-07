import { ExplorePage } from '../experiences/explore/ExplorePage';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../shared/layouts/DashboardLayout';
import { ProtectedRoute, RoleRedirect } from '../identity/authorization/ProtectedRoute';
import { RouteErrorBoundary } from '../shared/components';
import { LandingPage } from '../experiences/landing/LandingPage';
import { LoginPage } from '../identity/authentication/LoginPage';
import { RegisterPage } from '../identity/authentication/RegisterPage';
import { LearnerDashboard } from '../experiences/learner-dashboard/LearnerDashboard';
import { MentorDashboard } from '../experiences/mentor-dashboard/MentorDashboard';
import { AvailabilityPage } from '../experiences/mentor-dashboard/AvailabilityPage';
import { MentorDiscoveryPage } from '../experiences/mentor-discovery/MentorDiscoveryPage';
import { MentorProfilePage } from '../experiences/mentor-discovery/MentorProfilePage';
import { SmartMatchingPage } from '../experiences/smart-matching/SmartMatchingPage';
import { SessionBookingPage } from '../experiences/session-booking/SessionBookingPage';
import { SessionsPage } from '../experiences/session-booking/SessionsPage';
import { ConversationCenterPage } from '../experiences/conversation-center/ConversationCenterPage';
import { FeedbackPage } from '../experiences/feedback-center/FeedbackPage';
import { MentorReviewsPage } from '../experiences/feedback-center/MentorReviewsPage';
import { ProfilePage } from '../experiences/personal-profile/ProfilePage';
import {
  AdminDashboard,
  AdminUsersPage,
  AdminConversationsPage,
  AdminActivityPage,
  AdminAnalyticsPage,
  AdminReportsPage,
  AdminAuditLogsPage,
  AdminSettingsPage,
} from '../experiences/admin-panel/AdminPages';

// SkillBridge 2.0 Ecosystem Pages
import { ActivityFeedPage } from '../experiences/activity-feed/ActivityFeedPage';
import { NetworkPage } from '../experiences/networking/NetworkPage';
import { CommunitiesPage } from '../experiences/communities/CommunitiesPage';
import { NotificationsPage } from '../experiences/notifications/NotificationsPage';
import { SettingsPage } from '../experiences/settings/SettingsPage';

// SkillBridge 4.0 Peer-to-Peer & Collaboration Pages
import { SkillExchangePage } from '../experiences/skill-exchange/SkillExchangePage';
import { ProjectSpacePage } from '../experiences/projects/ProjectSpacePage';
import { ProjectDetailPage } from '../experiences/projects/ProjectDetailPage';

const router = createBrowserRouter([
  // Public routes
  { path: '/', element: <LandingPage />, errorElement: <RouteErrorBoundary /> },
  { path: '/login', element: <LoginPage />, errorElement: <RouteErrorBoundary /> },
  { path: '/register', element: <RegisterPage />, errorElement: <RouteErrorBoundary /> },
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
          { path: '/feed', element: <ActivityFeedPage />, errorElement: <RouteErrorBoundary /> },
          { path: '/explore', element: <ExplorePage />, errorElement: <RouteErrorBoundary /> },
          { path: '/exchange', element: <SkillExchangePage />, errorElement: <RouteErrorBoundary /> },
          { path: '/projects', element: <ProjectSpacePage />, errorElement: <RouteErrorBoundary /> },
          { path: '/projects/:id', element: <ProjectDetailPage />, errorElement: <RouteErrorBoundary /> },
          { path: '/network', element: <NetworkPage />, errorElement: <RouteErrorBoundary /> },
          { path: '/communities', element: <CommunitiesPage />, errorElement: <RouteErrorBoundary /> },
          { path: '/notifications', element: <NotificationsPage />, errorElement: <RouteErrorBoundary /> },
          { path: '/profile', element: <ProfilePage />, errorElement: <RouteErrorBoundary /> },
          { path: '/settings', element: <SettingsPage />, errorElement: <RouteErrorBoundary /> },
          { path: '/messages', element: <ConversationCenterPage />, errorElement: <RouteErrorBoundary /> },
          { path: '/messages/:conversationId', element: <ConversationCenterPage />, errorElement: <RouteErrorBoundary /> },
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
          { path: '/dashboard', element: <LearnerDashboard />, errorElement: <RouteErrorBoundary /> },
          { path: '/discover', element: <MentorDiscoveryPage />, errorElement: <RouteErrorBoundary /> },
          { path: '/discover/:mentorId', element: <MentorProfilePage />, errorElement: <RouteErrorBoundary /> },
          { path: '/match', element: <SmartMatchingPage />, errorElement: <RouteErrorBoundary /> },
          { path: '/book/:mentorId', element: <SessionBookingPage />, errorElement: <RouteErrorBoundary /> },
          { path: '/sessions', element: <SessionsPage />, errorElement: <RouteErrorBoundary /> },
          { path: '/review/:sessionId', element: <FeedbackPage />, errorElement: <RouteErrorBoundary /> },
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
          { path: '/mentor/dashboard', element: <MentorDashboard />, errorElement: <RouteErrorBoundary /> },
          { path: '/mentor/sessions', element: <SessionsPage />, errorElement: <RouteErrorBoundary /> },
          { path: '/mentor/availability', element: <AvailabilityPage />, errorElement: <RouteErrorBoundary /> },
          { path: '/mentor/reviews', element: <MentorReviewsPage />, errorElement: <RouteErrorBoundary /> },
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
          { path: '/admin', element: <AdminDashboard />, errorElement: <RouteErrorBoundary /> },
          { path: '/admin/users', element: <AdminUsersPage />, errorElement: <RouteErrorBoundary /> },
          { path: '/admin/conversations', element: <AdminConversationsPage />, errorElement: <RouteErrorBoundary /> },
          { path: '/admin/activity', element: <AdminActivityPage />, errorElement: <RouteErrorBoundary /> },
          { path: '/admin/analytics', element: <AdminAnalyticsPage />, errorElement: <RouteErrorBoundary /> },
          { path: '/admin/reports', element: <AdminReportsPage />, errorElement: <RouteErrorBoundary /> },
          { path: '/admin/audit-logs', element: <AdminAuditLogsPage />, errorElement: <RouteErrorBoundary /> },
          { path: '/admin/settings', element: <AdminSettingsPage />, errorElement: <RouteErrorBoundary /> },
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
