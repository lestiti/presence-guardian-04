import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import Users from "@/pages/Users";
import Synods from "@/pages/Synods";
import Attendance from "@/pages/Attendance";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import AuthPage from "@/pages/Auth";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/users" element={<Users />} />
          <Route path="/synods" element={<Synods />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;