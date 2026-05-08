import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import EngineerPortal from "./pages/EngineerPortal";
import Dashboard from "./pages/Dashboard";
import ConfigTool from "./pages/ConfigTool";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/engineer-portal" element={<EngineerPortal />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/config-tool" element={<ConfigTool />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
