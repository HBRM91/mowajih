import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import DashboardLayout from "./components/layout/DashboardLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import { useAuthStore } from "./stores/authStore";

const Login = lazy(() => import("./routes/Login"));
const Dashboard = lazy(() => import("./routes/Dashboard"));
const Profiles = lazy(() => import("./routes/Profiles"));
const StudentDetail = lazy(() => import("./routes/StudentDetail"));
const Seuils = lazy(() => import("./routes/Seuils"));
const Pipeline = lazy(() => import("./routes/Pipeline"));
const Analytics = lazy(() => import("./routes/Analytics"));
const Communications = lazy(() => import("./routes/Communications"));
const Settings = lazy(() => import("./routes/Settings"));

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

const Fallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-950 to-navy-900">
    <div className="w-8 h-8 border-4 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route path="/" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
          <Route path="/profiles" element={<ErrorBoundary><Profiles /></ErrorBoundary>} />
          <Route path="/profiles/:uuid" element={<ErrorBoundary><StudentDetail /></ErrorBoundary>} />
          <Route path="/seuils" element={<ErrorBoundary><Seuils /></ErrorBoundary>} />
          <Route path="/pipeline" element={<ErrorBoundary><Pipeline /></ErrorBoundary>} />
          <Route path="/analytics" element={<ErrorBoundary><Analytics /></ErrorBoundary>} />
          <Route path="/communications" element={<ErrorBoundary><Communications /></ErrorBoundary>} />
          <Route path="/settings" element={<ErrorBoundary><Settings /></ErrorBoundary>} />
        </Route>
        {/* Catch-all: redirect to login if not matched */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
