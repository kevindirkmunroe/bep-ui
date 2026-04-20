import {Routes, Route, Navigate} from "react-router-dom";
import Dashboard from "./components/dashboard/Dashboard.js";
import PromoteDashboard from "./components/dashboard/events/PromoteDashboard.tsx";
import {MainLayout} from "./MainLayout.js";
import {SubmittedEventsPage} from "./components/dashboard/events/SubmittedEventsPage.js";
import {ActiveEventsPage} from "./components/dashboard/events/ActiveEventsPage.js";
import {ExpiredEventsPage} from "./components/dashboard/events/ExpiredEventsPage.js";
import {WelcomePage} from "./components/WelcomePage.tsx";
import LoginPage from "./components/LoginPage.js";
import {RegisterPage} from "./components/RegisterPage.js";
import ProtectedRoute from "./ProtectedRoute.js";

export default function App() {
  return (
      <MainLayout>
          <Routes>
              {/* Public */}
              <Route path="/" element={<WelcomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected */}
              <Route path="/dashboard/:userId"
                     element={<ProtectedRoute>
                                    <Dashboard />
                            </ProtectedRoute>} >
                  <Route index element={<Navigate to="events" replace />} />
                  {/* Default View */}
                  <Route index element={<ActiveEventsPage />} />

                  <Route path="events" element={<ActiveEventsPage />} />
                  <Route path="expired" element={<ExpiredEventsPage />} />
                  <Route path="submitted" element={<SubmittedEventsPage />} />
              </Route>
              <Route path="/events/:eventId" element={<PromoteDashboard />} />
          </Routes>
      </MainLayout>
  );
}
