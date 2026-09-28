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
import PaymentSuccessPage from "./components/dashboard/events/payments/PaymentSuccessPage.js";
import PaymentCancelledPage from "./components/dashboard/events/payments/PaymentCancelledPage.js";
import HistoryView from "./components/HistoryView.tsx";

export default function App() {

    function isSafari() {
        const ua = navigator.userAgent;
        // Safari contains "Safari" and "AppleWebKit", but NOT "Chrome" or "Chromium"
        return ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") === -1;
    }

    function isChrome() {
        const ua = navigator.userAgent;
        const vendor = navigator.vendor;

        // 1. Must contain "Chrome" or "Chromium"
        const isChromium = ua.indexOf("Chrome") > -1 || ua.indexOf("Chromium") > -1;

        // 2. Exclude Edge, Opera, and Brave which use the Chromium engine
        const isEdge = ua.indexOf("Edg") > -1;
        const isOpera = ua.indexOf("OPR") > -1 || ua.indexOf("Opera") > -1;

        // 3. Exclude Safari (Apple vendor) to prevent false positives
        const isApple = vendor && vendor.indexOf("Apple") > -1;

        return isChromium && !isEdge && !isOpera && !isApple;
    }

    window.addEventListener("DOMContentLoaded", () => {
        if (!isChrome()) {
            const warning = document.getElementById("browser-warning");
            if (warning) {
                warning.style.display = "block";
            }
        }
    });

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
              <Route path="/payment-success" element={<PaymentSuccessPage />} />
              <Route path="/payment-cancelled" element={<PaymentCancelledPage />} />


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

              {/* HistoryTab */}
              <Route
                  path="/dashboard/:userId/history"
                  element={
                      <ProtectedRoute>
                          <HistoryView />
                      </ProtectedRoute>
                  }
              />

          </Routes>
      </MainLayout>
  );
}
