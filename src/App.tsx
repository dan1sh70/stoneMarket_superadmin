import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { BusinessManagementPage } from './pages/BusinessManagementPage';
import { CatalogueManagementPage } from './pages/CatalogueManagementPage';
import { VerificationCenterPage } from './pages/VerificationCenterPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { LocationManagementPage } from './pages/LocationManagementPage';
import { InquiryManagementPage } from './pages/InquiryManagementPage';
import { LeadManagementPage } from './pages/LeadManagementPage';
import { AdvertisementManagementPage } from './pages/AdvertisementManagementPage';
import { ReportsAndComplaintsPage } from './pages/ReportsAndComplaintsPage';
import { AnalyticsAndReportsPage } from './pages/AnalyticsAndReportsPage';
import { NotificationsAndAnnouncementsPage } from './pages/NotificationsAndAnnouncementsPage';
import { AdminAndStaffPage } from './pages/AdminAndStaffPage';
import { PlatformSettingsPage } from './pages/PlatformSettingsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SystemMonitoringPage } from './pages/SystemMonitoringPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-text-secondary font-medium">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UserManagementPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/businesses"
            element={
              <ProtectedRoute>
                <BusinessManagementPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/catalogue"
            element={
              <ProtectedRoute>
                <CatalogueManagementPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/verifications"
            element={
              <ProtectedRoute>
                <VerificationCenterPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <CategoriesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/locations"
            element={
              <ProtectedRoute>
                <LocationManagementPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inquiries"
            element={
              <ProtectedRoute>
                <InquiryManagementPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/leads"
            element={
              <ProtectedRoute>
                <LeadManagementPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/advertisements"
            element={
              <ProtectedRoute>
                <AdvertisementManagementPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <ReportsAndComplaintsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsAndReportsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsAndAnnouncementsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff"
            element={
              <ProtectedRoute>
                <AdminAndStaffPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <PlatformSettingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/audit-logs"
            element={
              <ProtectedRoute>
                <AuditLogsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/system-monitoring"
            element={
              <ProtectedRoute>
                <SystemMonitoringPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback to Dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
