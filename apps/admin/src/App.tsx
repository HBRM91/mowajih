import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import DashboardLayout from "./components/layout/DashboardLayout";
import ErrorBoundary from "./components/ErrorBoundary";

const Login = lazy(() => import("./routes/Login"));
const Dashboard = lazy(() => import("./routes/Dashboard"));
const Pipeline = lazy(() => import("./routes/Pipeline"));
const Analytics = lazy(() => import("./routes/Analytics"));
const Communications = lazy(() => import("./routes/Communications"));
const Settings = lazy(() => import("./routes/Settings"));

function App() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Chargement...</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
          <Route path="/pipeline" element={<ErrorBoundary><Pipeline /></ErrorBoundary>} />
          <Route path="/analytics" element={<ErrorBoundary><Analytics /></ErrorBoundary>} />
          <Route path="/communications" element={<ErrorBoundary><Communications /></ErrorBoundary>} />
          <Route path="/settings" element={<ErrorBoundary><Settings /></ErrorBoundary>} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
