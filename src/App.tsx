import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "./components/layout/Layout";
import { Suspense } from 'react';
import { LoadingSpinner } from "./components/ui/loading";
import { useAccess } from "./hooks/useAccess";

// Import pages
import Index from "./pages/Index";
import Users from "./pages/Users";
import Synods from "./pages/Synods";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Attendance from "./pages/Attendance";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
  const { role } = useAccess();
  
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route 
                path="/users" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin']}>
                    <Users />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/synods" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin']}>
                    <Synods />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reports" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                    <Reports />
                  </ProtectedRoute>
                } 
              />
              <Route path="/attendance" element={<Attendance />} />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin']}>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;