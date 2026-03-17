import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { ProtectedRoute } from '@/router/ProtectedRoute'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useAuthStore } from '@/store/authStore'
import './index.css'

// Skeleton fallback for lazy pages
function PageLoader() {
  return (
    <div style={{ padding: 32 }}>
      <div style={{ height: 24, width: 200, backgroundColor: '#1A1A1F', borderRadius: 8, marginBottom: 16 }} />
      <div style={{ height: 14, width: 300, backgroundColor: '#1A1A1F', borderRadius: 6, marginBottom: 32 }} />
      <div style={{ height: 180, backgroundColor: '#111113', borderRadius: 14, border: '1px solid #27272A', marginBottom: 12 }} />
      <div style={{ height: 120, backgroundColor: '#111113', borderRadius: 14, border: '1px solid #27272A' }} />
    </div>
  )
}

// Lazy-loaded pages — each gets its own chunk, reducing initial bundle size
const LoginPage = lazy(() => import('@/features/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/features/auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/features/auth/ForgotPasswordPage'))
const SubscribePage = lazy(() => import('@/features/onboarding/SubscribePage'))
const BecomeDriverPage = lazy(() => import('@/features/onboarding/BecomeDriverPage'))
const ClientDashboard = lazy(() => import('@/features/client/ClientDashboard'))
const NewRequestPage = lazy(() => import('@/features/client/NewRequestPage'))
const MyRequestsPage = lazy(() => import('@/features/client/MyRequestsPage'))
const RequestDetailPage = lazy(() => import('@/features/client/RequestDetailPage'))
const SettingsPage = lazy(() => import('@/features/client/SettingsPage'))
const OperatorDashboard = lazy(() => import('@/features/operator/OperatorDashboard'))
const OperatorQueuePage = lazy(() => import('@/features/operator/OperatorQueuePage'))
const OperatorActivePage = lazy(() => import('@/features/operator/OperatorActivePage'))
const OperatorClientManagement = lazy(() => import('@/features/operator/OperatorClientManagement'))
const OperatorDriverManagement = lazy(() => import('@/features/operator/OperatorDriverManagement'))
const DriverDashboard = lazy(() => import('@/features/driver/DriverDashboard'))
const DriverTasksPage = lazy(() => import('@/features/driver/DriverTasksPage'))
const DriverCompletedPage = lazy(() => import('@/features/driver/DriverCompletedPage'))
const TaskDetailPage = lazy(() => import('@/features/driver/TaskDetailPage'))
const DriverSettingsPage = lazy(() => import('@/features/driver/DriverSettingsPage'))
const AdminDashboard = lazy(() => import('@/features/admin/AdminDashboard'))
const AdminUsersPage = lazy(() => import('@/features/admin/AdminUsersPage'))
const AdminRequestsPage = lazy(() => import('@/features/admin/AdminRequestsPage'))
const AdminDriversPage = lazy(() => import('@/features/admin/AdminDriversPage'))
const AdminSubscriptionsPage = lazy(() => import('@/features/admin/AdminSubscriptionsPage'))
const AdminRevenuePage = lazy(() => import('@/features/admin/AdminRevenuePage'))
const AdminSettingsPage = lazy(() => import('@/features/admin/AdminSettingsPage'))
const NotFoundPage = lazy(() => import('@/features/NotFoundPage'))

function RoleRedirect() {
  const { currentUser } = useAuthStore()
  const role = currentUser?.role || 'client'

  const defaultRoutes = {
    client: '/dashboard',
    operator: '/operator',
    driver: '/driver',
    admin: '/admin',
  }

  return <Navigate to={defaultRoutes[role]} replace />
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/subscribe" element={<SubscribePage />} />
            <Route path="/become-driver" element={<BecomeDriverPage />} />

            {/* App Shell (requires auth) */}
            <Route element={<AppShell />}>
              {/* Root redirect */}
              <Route path="/" element={<RoleRedirect />} />

              {/* Client */}
              <Route path="/dashboard" element={<ClientDashboard />} />
              <Route path="/requests/new" element={<NewRequestPage />} />
              <Route path="/requests" element={<MyRequestsPage />} />
              <Route path="/requests/:id" element={<RequestDetailPage />} />
              <Route path="/settings" element={<SettingsPage />} />

              {/* Operator */}
              <Route path="/operator" element={<OperatorDashboard />} />
              <Route path="/operator/queue" element={<OperatorQueuePage />} />
              <Route path="/operator/active" element={<OperatorActivePage />} />
              <Route path="/operator/clients" element={<OperatorClientManagement />} />
              <Route path="/operator/drivers" element={<OperatorDriverManagement />} />

              {/* Driver */}
              <Route path="/driver" element={<DriverDashboard />} />
              <Route path="/driver/tasks" element={<DriverTasksPage />} />
              <Route path="/driver/tasks/:id" element={<TaskDetailPage />} />
              <Route path="/driver/completed" element={<DriverCompletedPage />} />
              <Route path="/driver/settings" element={<DriverSettingsPage />} />

              {/* Admin */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/requests" element={<AdminRequestsPage />} />
              <Route path="/admin/drivers" element={<AdminDriversPage />} />
              <Route path="/admin/subscriptions" element={<AdminSubscriptionsPage />} />
              <Route path="/admin/revenue" element={<AdminRevenuePage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
