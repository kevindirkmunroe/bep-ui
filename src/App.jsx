import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/dashboard/Dashboard.js";
import PromoteDashboard from "./components/dashboard/events/PromoteDashboard.tsx";
import {MainLayout} from "./MainLayout.js";

export default function App() {
  return (
      <MainLayout>
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<LoginPage />} />
                  <Route path="/dashboard/:userId" element={<Dashboard />} />
                  <Route path="/events/:eventId" element={<PromoteDashboard />} />
              </Routes>
          </BrowserRouter>
      </MainLayout>
  );
}
