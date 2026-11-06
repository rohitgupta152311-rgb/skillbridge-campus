import { useState } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  Newspaper,
  Users,
  Compass,
  Calendar,
  MessageSquare,
  Bell,
  User as UserIcon,
  Sparkles,
  Clock,
  Star,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Search,
  Building2,
  Shield,
  Briefcase,
  ChevronRight,
  Settings,
  Rocket,
  ArrowLeftRight,
  ChevronDown,
  Check,
} from 'lucide-react';
import { useAuthStore } from '../../identity/authentication/auth-store';
import { Avatar, Badge } from '../../shared/components';
import { getNotificationsByUser, getUsers } from '../../infrastructure/local-storage/data-service';
import { useToastStore } from '../../shared/notifications/toast-store';
import clsx from 'clsx';
import { UserRole, User } from '../../foundation/types';

interface NavSection {
  title: string;
  items: {
    label: string;
    icon: React.ElementType;
    path: string;
    badge?: number;
    badgeText?: string;
    highlight?: boolean;
  }[];
}

export function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [personaMenuOpen, setPersonaMenuOpen] = useState(false);

  if (!user) return null;

  const notifications = getNotificationsByUser(user.id);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/feed') return location.pathname === '/feed';
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path) && path.length > 1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Demo Persona Switcher handler
  const handleSwitchPersona = (targetEmail: string) => {
    const allUsers = getUsers();
    const targetUser = allUsers.find(u => u.email === targetEmail);
    if (targetUser) {
      localStorage.setItem('sb_current_user', JSON.stringify(targetUser));
      useAuthStore.setState({ user: targetUser, isAuthenticated: true });
      addToast({
        type: 'info',
        title: `Switched Persona to ${targetUser.fullName}`,
        message: `Now viewing platform as ${targetUser.headline || targetUser.role}`,
      });
      setPersonaMenuOpen(false);
    }
  };

  // Build role-specific navigation sections
  const getNavSections = (): NavSection[] => {
    const isMentor = user.role === 'mentor';
    const isAdmin = user.role === 'admin';

    const sections: NavSection[] = [
      {
        title: 'CAMPUS NETWORK & EXCHANGE',
        items: [
          { label: 'Campus Feed', icon: Newspaper, path: '/feed' },
          { label: 'Explore Campus', icon: Compass, path: '/explore', highlight: true },
          {
            label: 'Skill Exchange',
            icon: ArrowLeftRight,
            path: '/exchange',
            highlight: true,
            badgeText: '96% Match',
          },
          {
            label: 'ProjectSpace',
            icon: Rocket,
            path: '/projects',
            highlight: true,
          },
          { label: 'My Network', icon: Users, path: '/network' },
          { label: 'Communities', icon: Building2, path: '/communities' },
        ],
      },
      {
        title: 'MENTORSHIP & SESSIONS',
        items: [
          { label: 'Find Mentors', icon: Compass, path: '/discover' },
          { label: 'Smart Matchmaker', icon: Sparkles, path: '/match' },
          {
            label: isMentor ? 'Mentorship Sessions' : 'My Sessions',
            icon: Calendar,
            path: isMentor ? '/mentor/sessions' : '/sessions',
          },
          ...(isMentor
            ? [
                { label: 'Set Availability', icon: Clock, path: '/mentor/availability' },
                { label: 'Reviews & Ratings', icon: Star, path: '/mentor/reviews' },
              ]
            : []),
          {
            label: 'Messages',
            icon: MessageSquare,
            path: '/messages',
            badge: 2,
          },
          {
            label: isMentor ? 'Mentor Dashboard' : 'Academic Dashboard',
            icon: LayoutDashboard,
            path: isMentor ? '/mentor/dashboard' : '/dashboard',
          },
        ],
      },
      {
        title: 'ACCOUNT & SAFETY',
        items: [
          { label: 'Professional Profile', icon: UserIcon, path: '/profile' },
          {
            label: 'Notifications',
            icon: Bell,
            path: '/notifications',
            badge: unreadCount,
          },
          { label: 'Settings', icon: Settings, path: '/settings' },
          ...(isAdmin
            ? [
                { label: 'Admin Console', icon: Shield, path: '/admin' },
                { label: 'User Directory', icon: Users, path: '/admin/users' },
                { label: 'Safety Reports', icon: Shield, path: '/admin/reports' },
              ]
            : []),
        ],
      },
    ];

    return sections;
  };

  const navSections = getNavSections();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
        <Link to="/feed" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-blue-500 flex items-center justify-center shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-slate-900">SkillBridge</span>
              
            </div>
            <p className="text-[11px] text-slate-500">Peer Network & Exchange</p>
          </div>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navSections.map((section, sIdx) => (
          <div key={sIdx}>
            <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-2">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={clsx(
                      'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all group duration-150',
                      active
                        ? 'bg-[#151e4e] text-white font-bold shadow-pill-active'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-semibold'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={clsx(
                          'w-4 h-4 transition-colors',
                          active
                            ? 'text-white'
                            : item.highlight
                            ? 'text-[#151e4e] group-hover:text-slate-900'
                            : 'text-slate-400 group-hover:text-slate-600'
                        )}
                      />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badgeText && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 animate-pulse">
                          {item.badgeText}
                        </span>
                      )}
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="px-1.5 py-0.5 text-[11px] font-semibold rounded-full bg-violet-600 text-white min-w-[18px] text-center">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Current User Quick Footer */}
      <div className="p-3 border-t border-slate-200/80 bg-slate-50/60">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200/60 shadow-xs mb-2">
          <Avatar name={user.fullName} size="sm" showStatus status={user.onlineStatus} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">{user.fullName}</p>
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-500 truncate capitalize">{user.role}</span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] text-violet-600 font-medium truncate">{user.department}</span>
            </div>
          </div>
          <Link
            to="/profile"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            title="View Profile"
          >
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Floating SkillSwap Metric Card (as seen in theme reference) */}
        <div className="p-3 mb-2 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-600 font-bold">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 tracking-tight leading-none">1,245</p>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">Total Peer Exchanges</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded-md">
            +18%
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#EEF2F9]">
      {/* Desktop Floating Sidebar matching SkillSwap theme */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:top-4 lg:bottom-4 lg:left-4 lg:w-[260px] bg-white rounded-3xl shadow-soft border border-slate-200/70 z-40 overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl flex flex-col z-10 animate-slide-right">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Container */}
      <div className="lg:pl-[288px] flex flex-col min-h-screen">
        {/* Top Floating Navigation Bar matching modern theme */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/70 lg:mx-4 lg:mt-3 lg:rounded-2xl lg:shadow-soft lg:border">
          <div className="flex items-center justify-between h-14 lg:h-16 px-4 lg:px-6">
            {/* Left: Mobile Toggle & Search */}
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search peers, skills, projects (React, Python)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100 hover:bg-slate-200/70 focus:bg-white rounded-xl border border-transparent focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/10 transition-all text-slate-900 placeholder:text-slate-400"
                />
              </form>
            </div>

            {/* Right: Quick Links, Persona Switcher, & Profile */}
            <div className="flex items-center gap-1 sm:gap-2.5">
              {/* Skill Exchange Shortcut */}
              <Link
                to="/exchange"
                className={clsx(
                  'hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                  isActive('/exchange')
                    ? 'bg-violet-100 text-violet-700'
                    : 'text-slate-600 hover:bg-slate-100'
                )}
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-violet-600" />
                <span>Exchange</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                  96%
                </span>
              </Link>

              {/* Projects Shortcut */}
              <Link
                to="/projects"
                className={clsx(
                  'hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                  isActive('/projects')
                    ? 'bg-violet-100 text-violet-700'
                    : 'text-slate-600 hover:bg-slate-100'
                )}
              >
                <Rocket className="w-3.5 h-3.5 text-violet-600" />
                <span>Projects</span>
              </Link>

              {/* Messages Shortcut */}
              <Link
                to="/messages"
                className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                title="Direct Messages"
              >
                <MessageSquare className="w-5 h-5 text-slate-500" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-600 ring-2 ring-white" />
              </Link>

              {/* Notifications */}
              <Link
                to="/notifications"
                className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5 text-slate-500" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 px-1 min-w-[16px] h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </Link>

              {/* Professional Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setPersonaMenuOpen(!personaMenuOpen)}
                  className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200/80 hover:opacity-90 transition-opacity"
                >
                  <Avatar name={user.fullName} size="sm" showStatus status={user.onlineStatus} />
                  <div className="hidden xl:block text-left">
                    <p className="text-xs font-bold text-slate-800 leading-tight">{user.fullName}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{user.role || 'Student'}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {personaMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.fullName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setPersonaMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-xl mb-1"
                        >
                          <Shield className="w-3.5 h-3.5 text-violet-600" />
                          <span>Admin Console</span>
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => setPersonaMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                        <span>View Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setPersonaMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-500" />
                        <span>Account Settings</span>
                      </Link>
                    </div>
                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setPersonaMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl text-left"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 pb-16 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 lg:hidden z-30">
        <div className="flex items-center justify-around h-14 px-2">
          <Link
            to="/feed"
            className={clsx(
              'flex flex-col items-center justify-center flex-1 py-1 transition-colors',
              isActive('/feed') ? 'text-violet-600' : 'text-slate-400 hover:text-slate-600'
            )}
          >
            <Newspaper className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-0.5">Feed</span>
          </Link>

          <Link
            to="/exchange"
            className={clsx(
              'flex flex-col items-center justify-center flex-1 py-1 transition-colors',
              isActive('/exchange') ? 'text-violet-600' : 'text-slate-400 hover:text-slate-600'
            )}
          >
            <ArrowLeftRight className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-0.5">Exchange</span>
          </Link>

          <Link
            to="/projects"
            className={clsx(
              'flex flex-col items-center justify-center flex-1 py-1 transition-colors',
              isActive('/projects') ? 'text-violet-600' : 'text-slate-400 hover:text-slate-600'
            )}
          >
            <div className="w-7 h-7 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-sm">
              <Rocket className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium mt-0.5">Projects</span>
          </Link>

          <Link
            to="/messages"
            className={clsx(
              'flex flex-col items-center justify-center flex-1 py-1 transition-colors',
              isActive('/messages') ? 'text-violet-600' : 'text-slate-400 hover:text-slate-600'
            )}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-0.5">Messages</span>
          </Link>

          <Link
            to="/profile"
            className={clsx(
              'flex flex-col items-center justify-center flex-1 py-1 transition-colors',
              isActive('/profile') ? 'text-violet-600' : 'text-slate-400 hover:text-slate-600'
            )}
          >
            <UserIcon className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-0.5">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
