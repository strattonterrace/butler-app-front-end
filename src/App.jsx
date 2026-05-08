import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { ProtectedRoute } from '@/router/ProtectedRoute'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useAuthStore } from '@/store/authStore'
import './index.css'

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

// Restores session from localStorage before rendering any protected route.
// Shows a full-page loader while the /users/me/ call is in flight.
function AuthInitializer({ children }) {
  const initialize = useAuthStore((s) => s.initialize)
  const isLoading = useAuthStore((s) => s.isLoading)

  useEffect(() => {
    initialize()
  }, [initialize])

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PageLoader />
      </div>
    )
  }

  return children
}

const LoginPage = lazy(() => import('@/features/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/features/auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/features/auth/ForgotPasswordPage'))
const SubscribePage = lazy(() => import('@/features/onboarding/SubscribePage'))
const BecomeDriverPage = lazy(() => import('@/features/onboarding/BecomeDriverPage'))
const DriverPendingPage = lazy(() => import('@/features/driver/DriverPendingPage'))
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
        <AuthInitializer>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/subscribe" element={<SubscribePage />} />
              <Route path="/become-driver" element={<BecomeDriverPage />} />
              <Route path="/driver/pending" element={<DriverPendingPage />} />

              {/* App Shell (requires auth) */}
              <Route element={<AppShell />}>
                <Route path="/" element={<RoleRedirect />} />

                {/* Client */}
                <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['client']}><ClientDashboard /></ProtectedRoute>} />
                <Route path="/requests/new" element={<ProtectedRoute allowedRoles={['client']}><NewRequestPage /></ProtectedRoute>} />
                <Route path="/requests" element={<ProtectedRoute allowedRoles={['client']}><MyRequestsPage /></ProtectedRoute>} />
                <Route path="/requests/:id" element={<ProtectedRoute allowedRoles={['client']}><RequestDetailPage /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute allowedRoles={['client']}><SettingsPage /></ProtectedRoute>} />

                {/* Operator */}
                <Route path="/operator" element={<ProtectedRoute allowedRoles={['operator']}><OperatorDashboard /></ProtectedRoute>} />
                <Route path="/operator/queue" element={<ProtectedRoute allowedRoles={['operator']}><OperatorQueuePage /></ProtectedRoute>} />
                <Route path="/operator/active" element={<ProtectedRoute allowedRoles={['operator']}><OperatorActivePage /></ProtectedRoute>} />
                <Route path="/operator/clients" element={<ProtectedRoute allowedRoles={['operator']}><OperatorClientManagement /></ProtectedRoute>} />
                <Route path="/operator/drivers" element={<ProtectedRoute allowedRoles={['operator']}><OperatorDriverManagement /></ProtectedRoute>} />

                {/* Driver */}
                <Route path="/driver" element={<ProtectedRoute allowedRoles={['driver']}><DriverDashboard /></ProtectedRoute>} />
                <Route path="/driver/tasks" element={<ProtectedRoute allowedRoles={['driver']}><DriverTasksPage /></ProtectedRoute>} />
                <Route path="/driver/tasks/:id" element={<ProtectedRoute allowedRoles={['driver']}><TaskDetailPage /></ProtectedRoute>} />
                <Route path="/driver/completed" element={<ProtectedRoute allowedRoles={['driver']}><DriverCompletedPage /></ProtectedRoute>} />
                <Route path="/driver/settings" element={<ProtectedRoute allowedRoles={['driver']}><DriverSettingsPage /></ProtectedRoute>} />

                {/* Admin */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsersPage /></ProtectedRoute>} />
                <Route path="/admin/requests" element={<ProtectedRoute allowedRoles={['admin']}><AdminRequestsPage /></ProtectedRoute>} />
                <Route path="/admin/drivers" element={<ProtectedRoute allowedRoles={['admin']}><AdminDriversPage /></ProtectedRoute>} />
                <Route path="/admin/subscriptions" element={<ProtectedRoute allowedRoles={['admin']}><AdminSubscriptionsPage /></ProtectedRoute>} />
                <Route path="/admin/revenue" element={<ProtectedRoute allowedRoles={['admin']}><AdminRevenuePage /></ProtectedRoute>} />
                <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSettingsPage /></ProtectedRoute>} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </AuthInitializer>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
