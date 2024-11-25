import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Toaster } from "@/components/ui/sonner";
import { Suspense, lazy, useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading";

// Lazy load pages with preloading
const Index = lazy(() => import("@/pages/Index"));
const Users = lazy(() => import("@/pages/Users"));
const Synods = lazy(() => import("@/pages/Synods"));
const Attendance = lazy(() => import("@/pages/Attendance"));
const Reports = lazy(() => import("@/pages/Reports"));
const Settings = lazy(() => import("@/pages/Settings"));

// Preload components
const preloadComponents = () => {
  const components = [Index, Users, Synods, Attendance, Reports, Settings];
  components.forEach(component => {
    // @ts-ignore - TypeScript doesn't know about the _payload property
    component._payload?._result?.preload?.();
  });
};

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <LoadingSpinner />
  </div>
);

function App() {
  useEffect(() => {
    // Preload components after initial render
    preloadComponents();
  }, []);

  return (
    <Router>
      <Layout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/users" element={<Users />} />
            <Route path="/synods" element={<Synods />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            {/* Catch all route for 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
      <Toaster />
    </Router>
  );
}

export default App;