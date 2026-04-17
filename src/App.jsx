import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/dashboard/Dashboard.js";
import PromoteDashboard from "./components/dashboard/events/PromoteDashboard.tsx";
import {MainLayout} from "./MainLayout.js";
import {SubmittedEventsPage} from "./components/dashboard/events/SubmittedEventsPage.js";
import {ActiveEventsPage} from "./components/dashboard/events/ActiveEventsPage.js";

export default function App() {
  return (
      <MainLayout>
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<LoginPage />} />
                  <Route path="/dashboard/:userId" element={<Dashboard />} >
                      <Route path="events" element={<ActiveEventsPage />} />
                      <Route path="submitted" element={<SubmittedEventsPage />} />
                  </Route>
                  <Route path="/events/:eventId" element={<PromoteDashboard />} />
              </Routes>
          </BrowserRouter>
      </MainLayout>
  );
}
