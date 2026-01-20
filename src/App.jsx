import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/hooks/useAuth'
import { ToastProvider } from '@/hooks/useToast'
import { MessagesProvider } from '@/hooks/useMessages'
import { MissionsProvider } from '@/hooks/useMissions'
import { NotificationsProvider } from '@/hooks/useNotifications'
import { OnboardingProvider } from '@/hooks/useOnboarding'
import { AppShell } from '@/components/layout/AppShell'
import { ROLES } from '@/lib/constants'

// Pages
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import NotFound from '@/pages/NotFound'

// Cleaner Pages
import CleanerDashboard from '@/pages/cleaner/Dashboard'
import CleanerMissions from '@/pages/cleaner/Missions'
import CleanerMissionDetail from '@/pages/cleaner/MissionDetail'
import CleanerPlanning from '@/pages/cleaner/Planning'
import CleanerEarnings from '@/pages/cleaner/Earnings'
import CleanerProfile from '@/pages/cleaner/Profile'
import CleanerSettings from '@/pages/cleaner/Settings'
import CleanerMessages from '@/pages/cleaner/Messages'

// Host Pages
import HostDashboard from '@/pages/host/Dashboard'
import HostProperties from '@/pages/host/Properties'
import HostPropertyDetail from '@/pages/host/PropertyDetail'
import HostAddProperty from '@/pages/host/AddProperty'
import HostBookings from '@/pages/host/Bookings'
import HostBookingDetail from '@/pages/host/BookingDetail'
import HostCleaners from '@/pages/host/Cleaners'
import HostBilling from '@/pages/host/Billing'
import HostSettings from '@/pages/host/Settings'
import HostMessages from '@/pages/host/Messages'

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <MessagesProvider>
            <MissionsProvider>
              <NotificationsProvider>
                <OnboardingProvider>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Cleaner Routes */}
                    <Route path="/cleaner" element={<AppShell role={ROLES.CLEANER} />}>
                      <Route index element={<CleanerDashboard />} />
                      <Route path="missions" element={<CleanerMissions />} />
                      <Route path="missions/:id" element={<CleanerMissionDetail />} />
                      <Route path="planning" element={<CleanerPlanning />} />
                      <Route path="earnings" element={<CleanerEarnings />} />
                      <Route path="profile" element={<CleanerProfile />} />
                      <Route path="settings" element={<CleanerSettings />} />
                      <Route path="messages" element={<CleanerMessages />} />
                    </Route>

                    {/* Host Routes */}
                    <Route path="/host" element={<AppShell role={ROLES.HOST} />}>
                      <Route index element={<HostDashboard />} />
                      <Route path="properties" element={<HostProperties />} />
                      <Route path="properties/new" element={<HostAddProperty />} />
                      <Route path="properties/:id" element={<HostPropertyDetail />} />
                      <Route path="bookings" element={<HostBookings />} />
                      <Route path="bookings/:id" element={<HostBookingDetail />} />
                      <Route path="cleaners" element={<HostCleaners />} />
                      <Route path="billing" element={<HostBilling />} />
                      <Route path="settings" element={<HostSettings />} />
                      <Route path="messages" element={<HostMessages />} />
                    </Route>

                    {/* 404 - Page not found */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </OnboardingProvider>
              </NotificationsProvider>
            </MissionsProvider>
          </MessagesProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
