import { ExplorePage } from '../experiences/explore/ExplorePage';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../shared/layouts/DashboardLayout';
import { ProtectedRoute, RoleRedirect } from '../identity/authorization/ProtectedRoute';
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
import { AdminDashboard, AdminUsersPage, AdminReportsPage } from '../experiences/admin-panel/AdminPages';

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
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/redirect', element: <RoleRedirect /> },

  // Universal Authenticated Campus Network Routes (Mentee, Mentor, Admin)
  {
    element: <ProtectedRoute allowedRoles={['mentee', 'mentor', 'admin']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/feed', element: <ActivityFeedPage /> },
          { path: '/explore', element: <ExplorePage /> },
          { path: '/exchange', element: <SkillExchangePage /> },
          { path: '/projects', element: <ProjectSpacePage /> },
          { path: '/projects/:id', element: <ProjectDetailPage /> },
          { path: '/network', element: <NetworkPage /> },
          { path: '/communities', element: <CommunitiesPage /> },
          { path: '/notifications', element: <NotificationsPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/settings', element: <SettingsPage /> },
          { path: '/messages', element: <ConversationCenterPage /> },
          { path: '/messages/:conversationId', element: <ConversationCenterPage /> },
        ],
      },
    ],
  },

  // Mentee & Student Routes
  {
    element: <ProtectedRoute allowedRoles={['mentee']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: <LearnerDashboard /> },
          { path: '/discover', element: <MentorDiscoveryPage /> },
          { path: '/discover/:mentorId', element: <MentorProfilePage /> },
          { path: '/match', element: <SmartMatchingPage /> },
          { path: '/book/:mentorId', element: <SessionBookingPage /> },
          { path: '/sessions', element: <SessionsPage /> },
          { path: '/review/:sessionId', element: <FeedbackPage /> },
        ],
      },
    ],
  },

  // Mentor Routes
  {
    element: <ProtectedRoute allowedRoles={['mentor']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/mentor/dashboard', element: <MentorDashboard /> },
          { path: '/mentor/sessions', element: <SessionsPage /> },
          { path: '/mentor/availability', element: <AvailabilityPage /> },
          { path: '/mentor/reviews', element: <MentorReviewsPage /> },
        ],
      },
    ],
  },

  // Admin Routes
  {
    element: <ProtectedRoute allowedRoles={['admin']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/admin', element: <AdminDashboard /> },
          { path: '/admin/users', element: <AdminUsersPage /> },
          { path: '/admin/reports', element: <AdminReportsPage /> },
          {
            path: '/admin/settings',
            element: (
              <div className="max-w-4xl mx-auto p-6 animate-fade-in">
                <h1 className="text-2xl font-bold text-slate-900">Platform Settings & Governance</h1>
                <p className="text-slate-500 mt-2">Manage campus SSO, OAuth integrations, safety thresholds, and AI matchmaker weights.</p>
                <div className="mt-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="font-semibold text-slate-800">Auto-verify Student Campus Email</h3>
                      <p className="text-xs text-slate-500">Require @campus.edu email domain verification on registration</p>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="font-semibold text-slate-800">AI Matchmaking Engine (5-factor weighting)</h3>
                      <p className="text-xs text-slate-500">Active weights: Topic 35%, Skill 25%, Schedule 20%, Rating 15%, College 5%</p>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-violet-100 text-violet-800">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-800">Render Production Backend</h3>
                      <p className="text-xs text-slate-500">PostgreSQL + Socket.IO Web Service Status</p>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Ready</span>
                  </div>
                </div>
              </div>
            ),
          },
        ],
      },
    ],
  },

  // Catch-all
  { path: '*', element: <Navigate to="/feed" replace /> },
]);

export function ApplicationRoutes() {
  return <RouterProvider router={router} />;
}
