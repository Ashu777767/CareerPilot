import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";

import Dashboard from "./pages/Dashboard";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import InterviewPrep from "./pages/InterviewPrep";
import CareerRoadmap from "./pages/CareerRoadmap";
import Profile from "./pages/Profile";

import Sidebar from "./components/Sidebar";

// Layout with Sidebar
const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <Sidebar />

      <div className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />

<Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        {/* Protected Layout Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume-analysis" element={<ResumeAnalysis />} />
          <Route path="/interview-prep" element={<InterviewPrep />} />
          <Route path="/career-roadmap" element={<CareerRoadmap />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;