import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Package,
  ShieldCheck,
  Grid,
  MapPin,
  MessageSquare,
  TrendingUp,
  Megaphone,
  AlertTriangle,
  BarChart3,
  Bell,
  UserCheck,
  Settings,
  FileText,
  Activity,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Search,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { superAdminService } from '../services/superAdminService';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badgeKey?: string;
  badgeStatic?: string;
  badgeColor?: string;
}

const navigationConfig: SidebarItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'User Management', path: '/users', icon: Users },
  { name: 'Business Management', path: '/businesses', icon: Building2 },
  { name: 'Catalogue & Listings', path: '/catalogue', icon: Package },
  { name: 'Verification Center', path: '/verifications', icon: ShieldCheck, badgeKey: 'pendingVerifications', badgeColor: 'bg-amber-500' },
  { name: 'Categories & Business Types', path: '/categories', icon: Grid },
  { name: 'Location Management', path: '/locations', icon: MapPin },
  { name: 'Inquiry Management', path: '/inquiries', icon: MessageSquare, badgeKey: 'totalInquiries', badgeColor: 'bg-blue-500' },
  { name: 'Lead Management', path: '/leads', icon: TrendingUp, badgeKey: 'totalLeads', badgeColor: 'bg-purple-500' },
  { name: 'Advertisement Management', path: '/advertisements', icon: Megaphone },
  { name: 'Reports & Complaints', path: '/reports', icon: AlertTriangle, badgeKey: 'pendingSupport', badgeColor: 'bg-red-500' },
  { name: 'Analytics & Reports', path: '/analytics', icon: BarChart3 },
  { name: 'Notifications & Announcements', path: '/notifications', icon: Bell },
  { name: 'Admin & Staff Management', path: '/staff', icon: UserCheck },
  { name: 'Vision OCR & AI Lab', path: '/vision-ocr', icon: Sparkles, badgeStatic: 'AI', badgeColor: 'bg-purple-600 text-white' },
  { name: 'Custom Pages & CMS', path: '/custom-pages', icon: FileText },
  { name: 'Platform Settings', path: '/settings', icon: Settings },
  { name: 'Audit Logs', path: '/audit-logs', icon: FileText },
  { name: 'System Monitoring', path: '/system-monitoring', icon: Activity, badgeStatic: '●', badgeColor: 'text-emerald-400 bg-transparent' },
];

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [badgeCounts, setBadgeCounts] = useState<Record<string, number>>({});
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await superAdminService.getDashboardAnalytics();
        if (res?.kpi) {
          setBadgeCounts({
            pendingVerifications: res.kpi.pendingVerifications || 0,
            pendingSupport: res.kpi.pendingSupport || 0,
            totalInquiries: res.kpi.totalInquiries || 0,
            totalLeads: res.kpi.totalLeads || 0
          });
        }
        if (res?.notifications) {
          setNotifications(res.notifications);
        }
      } catch (err) {
        console.error('Failed to load live notification badges', err);
      }
    };

    fetchBadges();
    const interval = setInterval(fetchBadges, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const totalUnreadNotifications = (badgeCounts.pendingVerifications || 0) + (badgeCounts.pendingSupport || 0);

  return (
    <div className="min-h-screen flex bg-surface-bg text-text-primary antialiased">
      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-navy-900 text-white z-50 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-navy-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
              SM
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-sm tracking-wider uppercase text-white">STONE MARKET</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-600 text-white rounded">INDIA</span>
              </div>
              <div className="flex items-center space-x-1 text-[11px] text-amber-400 font-medium">
                <span>👑 Super Admin Panel</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Nav Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navigationConfig.map((item) => {
            const Icon = item.icon;
            const dynamicBadgeValue = item.badgeKey ? badgeCounts[item.badgeKey] : undefined;
            const badgeValue = item.badgeStatic || (dynamicBadgeValue && dynamicBadgeValue > 0 ? dynamicBadgeValue : null);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-primary text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" />
                  <span className="truncate">{item.name}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  {badgeValue !== null && badgeValue !== undefined && (
                    <span
                      className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                        item.badgeColor || 'bg-blue-500 text-white'
                      }`}
                    >
                      {badgeValue}
                    </span>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
              </NavLink>
            );
          })}
        </div>

        {/* Footer Admin User & Logout */}
        <div className="p-3 border-t border-navy-800 flex items-center justify-between bg-navy-900/60">
          <div className="flex items-center space-x-2.5 truncate">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-white">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div className="truncate text-left">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Super Admin'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@stonemarket.in'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-navy-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-surface-border sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shadow-sm">
          <div className="flex items-center space-x-3 flex-1 max-w-xl">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Global Search Bar */}
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search business, user, listing, inquiry..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-surface-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all text-text-primary"
              />
            </div>
          </div>

          {/* Right Header Icons & Admin Profile */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell with Live Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
                title="Platform Notifications"
              >
                <Bell className="w-5 h-5" />
                {totalUnreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center min-w-[16px]">
                    {totalUnreadNotifications}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-surface-border z-50 overflow-hidden">
                  <div className="p-3.5 border-b border-surface-border flex items-center justify-between bg-slate-50">
                    <span className="text-xs font-bold text-text-primary">Platform Live Alerts</span>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      MongoDB Live
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-surface-border">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No pending administrative alerts.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            setIsNotificationOpen(false);
                            if (n.type === 'verification') navigate('/verifications');
                            else if (n.type === 'report') navigate('/reports');
                            else if (n.type === 'lead') navigate('/leads');
                            else navigate('/users');
                          }}
                          className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-text-primary">{n.title}</span>
                            <span className="text-[10px] text-slate-400">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-600">{n.desc}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 border-t border-surface-border bg-slate-50 text-center">
                    <button
                      onClick={() => {
                        setIsNotificationOpen(false);
                        navigate('/dashboard');
                      }}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      View All Platform Tasks
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="h-8 w-px bg-surface-border hidden sm:block" />

            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center font-bold text-xs text-white shadow-sm">
                SA
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-text-primary">Super Admin</p>
                <p className="text-[10px] text-text-secondary">Platform Owner</p>
              </div>
            </div>
          </div>
        </header>

        {/* Workspace Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
