import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/ui/PageTransition";

import { useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import BrowseJobs from "./pages/BrowseJobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import SeekerDashboard from "./pages/SeekerDashboard";
import Jobs from "./pages/Jobs";
import Apply from "./pages/Apply";
import Candidates from "./pages/Candidates";
import CandidateDetail from "./pages/CandidateDetail";
import Placeholder from "./pages/Placeholder";
import ProfilePage from "./pages/ProfilePage";
import SavedJobsPage from "./pages/SavedJobsPage";
import RecommendedJobs from "./pages/RecommendedJobs";
import Applications from "./pages/Applications";
import MyApplications from "./pages/MyApplications";
import Company from "./pages/Company";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

const ApplyWrapper = () => {
  const { user } = useAuth();
  return (
    <DashboardLayout role={user?.role === "seeker" ? "seeker" : "employer"}>
      <Apply />
    </DashboardLayout>
  );
};

/** Redirect /jobs to role-specific route so seekers stay in seeker dashboard */
const JobsRedirect = () => {
  const { user } = useAuth();
  return (
    <Navigate
      to={user?.role === "seeker" ? "/dashboard/seeker/jobs" : "/dashboard/employer/jobs"}
      replace
    />
  );
};


const SeekerPlaceholder = ({ title }) => (
  <DashboardLayout role="seeker">
    <Placeholder title={title} />
  </DashboardLayout>
);

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <PageTransition><Home /></PageTransition>
          </ProtectedRoute>
        }
      />
      <Route
        path="/browse-jobs"
        element={
          <ProtectedRoute>
            <PageTransition><BrowseJobs /></PageTransition>
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobs/:id"
        element={
          <ProtectedRoute>
            <PageTransition><JobDetails /></PageTransition>
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
      <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/employer"
        element={
          <ProtectedRoute>
            <DashboardLayout role="employer">
              <EmployerDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/employer/jobs"
        element={
          <ProtectedRoute>
            <DashboardLayout role="employer">
              <Jobs />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/employer/applications"
        element={
          <ProtectedRoute>
            <DashboardLayout role="employer">
              <Applications />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/employer/company"
        element={
          <ProtectedRoute>
            <DashboardLayout role="employer">
              <Company />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/employer/messages"
        element={
          <ProtectedRoute>
            <DashboardLayout role="employer">
              <Messages />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/employer/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout role="employer">
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/seeker"
        element={
          <ProtectedRoute>
            <DashboardLayout role="seeker">
              <SeekerDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/seeker/recommended"
        element={
          <ProtectedRoute>
            <DashboardLayout role="seeker">
              <RecommendedJobs />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/seeker/jobs"
        element={
          <ProtectedRoute>
            <DashboardLayout role="seeker">
              <Jobs />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/seeker/applied"
        element={
          <ProtectedRoute>
            <DashboardLayout role="seeker">
              <MyApplications />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/seeker/saved"
        element={
          <ProtectedRoute>
            <DashboardLayout role="seeker">
              <SavedJobsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/seeker/interviews"
        element={
          <ProtectedRoute>
            <SeekerPlaceholder title="Interviews" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/seeker/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout role="seeker">
              <ProfilePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/seeker/messages"
        element={
          <ProtectedRoute>
            <DashboardLayout role="seeker">
              <Messages />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/seeker/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout role="seeker">
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobs"
        element={
          <ProtectedRoute>
            <JobsRedirect />
          </ProtectedRoute>
        }
      />
      <Route
        path="/apply/:id"
        element={
          <ProtectedRoute>
            <ApplyWrapper />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidates"
        element={
          <ProtectedRoute>
            <DashboardLayout role="employer">
              <Candidates />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidates/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout role="employer">
              <CandidateDetail />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return <AnimatedRoutes />;
}


export default App;
