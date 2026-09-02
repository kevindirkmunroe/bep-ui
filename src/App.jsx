import {Routes, Route, Navigate} from "react-router-dom";
import Dashboard from "./components/dashboard/Dashboard.js";
import PromoteDashboard from "./components/dashboard/events/PromoteDashboard.tsx";
import {MainLayout} from "./MainLayout.js";
import {ActiveEventsPage} from "./components/dashboard/events/ActiveEventsPage.js";
import {WelcomePage} from "./components/WelcomePage.tsx";
import LoginPage from "./components/LoginPage.js";
import {RegisterPage} from "./components/RegisterPage.js";
import ProtectedRoute from "./ProtectedRoute.js";
import ForgotPasswordPage from "./components/ForgotPasswordPage.js";
import ResetPasswordPage from "./components/ResetPasswordPage.js";
import RequestInvitePage from "./components/RequestInvitePage.js";
import {AboutPage} from "./components/AboutPage.js";
import CalendarView from "./components/dashboard/CalendarView.js";
import PromoteCompleteDashboard from "./components/dashboard/events/PromoteCompleteDashboard.tsx";
import AdminPage from "./components/admin/AdminPage.js";

export default function App() {
  return (
      <MainLayout>
          <Routes>
              {/* Public */}
              <Route path="/" element={<WelcomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
              <Route path="/resetpassword" element={<ResetPasswordPage />} />
              <Route path="/invite" element={<RequestInvitePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/admin" element={<AdminPage />} />

              {/* Dashboard */}
              <Route
                  path="/dashboard/:userId"
                  element={
                      <ProtectedRoute>
                          <Dashboard />
                      </ProtectedRoute>
                  }
                  >
                  <Route path="events" element={<ActiveEventsPage />} />
                  <Route path=":state/calendar" element={<CalendarView />} />
              </Route>

              {/* One Event */}
              <Route
                  path="/dashboard/:userId/events/:eventId"
                  element={
                      <ProtectedRoute>
                          <PromoteDashboard />
                      </ProtectedRoute>
                  }
              />

              {/* Completion Log */}
              <Route
                  path="/dashboard/:userId/events/:eventId/promoted"
                  element={
                      <ProtectedRoute>
                          <PromoteCompleteDashboard />
                      </ProtectedRoute>
                  }
              />

          </Routes>
      </MainLayout>
  );
}
