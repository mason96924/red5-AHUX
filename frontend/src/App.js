import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import EngineerPortal from "./pages/EngineerPortal";
import Dashboard from "./pages/Dashboard";
import ConfigTool from "./pages/ConfigTool";
import AuthCallback from "./pages/AuthCallback";
import AccessControl from "./pages/AccessControl";
import AdminLogin from "./pages/AdminLogin";

/**
 * AppRouter intercepts the Emergent OAuth callback BEFORE the normal route
 * tree runs.  This is checked synchronously during render (not in a
 * useEffect) so that any future ProtectedRoute / AuthProvider checks
 * cannot fire a /api/auth/me call before the session cookie is set.
 *
 * REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
 */
function AppRouter() {
  const location = useLocation();
  if (location.hash && location.hash.includes("session_id=")) {
    return <AuthCallback />;
  }
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/engineer-portal" element={<EngineerPortal />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/config-tool" element={<ConfigTool />} />
      <Route path="/admin/access-control" element={<AccessControl />} />
      <Route path="/admin-login" element={<AdminLogin />} />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </div>
  );
}

export default App;
