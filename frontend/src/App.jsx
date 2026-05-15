import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'

// Sprint 1
import UserManagement from './pages/sprint1/UserManagement'
import DonatePage from './pages/sprint1/DonatePage'
import CategoryManagement from './pages/sprint1/CategoryManagement'
import CreateActivityPage from './pages/sprint1/CreateActivityPage'

// Sprint 2
import SearchPage from './pages/sprint2/SearchPage'
import DonationHistoryPage from './pages/sprint2/DonationHistory'
import ActivityDetailPage from './pages/sprint2/ActivityDetailPage'
import FavouritesPage from './pages/sprint2/FavouritesPage'
import CompletedActivitiesPage from './pages/sprint2/CompletedActivitiesPage'
import OngoingActivitiesPage from './pages/sprint2/OngoingActivitiesPage'
import EditActivityPage from './pages/sprint2/EditActivityPage'
import DonationSearchPage from './pages/sprint2/DonationSearchPage'

// Sprint 3
import PerformanceDashboard from './pages/sprint3/PerformanceDashboard'
import ManageActivityPage from './pages/sprint3/ManageActivityPage'
import ReportPage from './pages/sprint3/ReportPage'
import AnnouncementsPage from './pages/sprint3/AnnouncementsPage'
import ApprovalPage from './pages/sprint3/ApprovalPage'
import RecurringDonationPage from './pages/sprint3/RecurringDonationPage'
import RecommendationsPage from './pages/sprint3/RecommendationsPage'
import SegmentDashboard from './pages/sprint3/SegmentDashboard'

// Other (not in sprint plan but built)
import BrowsePage from './pages/BrowsePage'
import DoneeProfile from './pages/DoneeProfile'
import FeedbackForm from './pages/FeedbackForm'
import FeedbackDashboard from './pages/FeedbackDashboard'

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<BrowsePage />} />

        {/* Sprint 1 */}
        <Route path="/admin/users" element={<ProtectedRoute roles={['user_admin']}><UserManagement /></ProtectedRoute>} />
        <Route path="/donate" element={<ProtectedRoute roles={['donee']}><DonatePage /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute roles={['platform_manager']}><CategoryManagement /></ProtectedRoute>} />
        <Route path="/activity/create" element={<ProtectedRoute roles={['fund_raiser']}><CreateActivityPage /></ProtectedRoute>} />

        {/* Sprint 2 */}
        <Route path="/search" element={<SearchPage />} />
        <Route path="/activity/:id" element={<ActivityDetailPage />} />
        <Route path="/contributions" element={<ProtectedRoute roles={['donee']}><DonationHistoryPage /></ProtectedRoute>} />
        <Route path="/favourites" element={<ProtectedRoute roles={['donee']}><FavouritesPage /></ProtectedRoute>} />
        <Route path="/activity/history" element={<ProtectedRoute roles={['fund_raiser']}><CompletedActivitiesPage /></ProtectedRoute>} />
        <Route path="/activity/ongoing" element={<ProtectedRoute roles={['fund_raiser']}><OngoingActivitiesPage /></ProtectedRoute>} />
        <Route path="/activity/edit/:id" element={<ProtectedRoute roles={['fund_raiser']}><EditActivityPage /></ProtectedRoute>} />
        <Route path="/donation-history" element={<ProtectedRoute roles={['donee']}><DonationSearchPage /></ProtectedRoute>} />

        {/* Sprint 3 */}
        <Route path="/activity/performance" element={<ProtectedRoute roles={['fund_raiser']}><PerformanceDashboard /></ProtectedRoute>} />
        <Route path="/activity/manage" element={<ProtectedRoute roles={['fund_raiser']}><ManageActivityPage /></ProtectedRoute>} />
        <Route path="/activity/segments" element={<ProtectedRoute roles={['fund_raiser']}><SegmentDashboard /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute roles={['platform_manager']}><ReportPage /></ProtectedRoute>} />
        <Route path="/announcements" element={<ProtectedRoute roles={['platform_manager']}><AnnouncementsPage /></ProtectedRoute>} />
        <Route path="/approval" element={<ProtectedRoute roles={['platform_manager']}><ApprovalPage /></ProtectedRoute>} />
        <Route path="/recurring-donations" element={<ProtectedRoute roles={['donee']}><RecurringDonationPage /></ProtectedRoute>} />
        <Route path="/recommendations" element={<ProtectedRoute roles={['donee']}><RecommendationsPage /></ProtectedRoute>} />

        {/* Other */}
        <Route path="/profile" element={<ProtectedRoute roles={['donee']}><DoneeProfile /></ProtectedRoute>} />
        <Route path="/feedback" element={<ProtectedRoute roles={['donee']}><FeedbackForm /></ProtectedRoute>} />
        <Route path="/feedback/trends" element={<ProtectedRoute roles={['platform_manager']}><FeedbackDashboard /></ProtectedRoute>} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
