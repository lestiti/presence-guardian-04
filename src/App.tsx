import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "./components/layout/Layout";
import { Suspense } from 'react';
import { LoadingSpinner } from "./components/ui/loading";

// Import pages directly to avoid dynamic import issues
import Index from "./pages/Index";
import Users from "./pages/Users";
import Synods from "./pages/Synods";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Attendance from "./pages/Attendance";

// Optimized React Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

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
              <Route path="/users" element={<Users />} />
              <Route path="/synods" element={<Synods />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;