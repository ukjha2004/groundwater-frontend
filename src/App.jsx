import { useState } from "react";
import {
  LayoutDashboard,
  BrainCircuit,
  Map,
  BarChart3,
  Bell,
  Activity,
  Info,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import "./App.css";

import { useServerStatus } from "./api";
import Dashboard from "./pages/Dashboard";
import PredictionPage from "./pages/PredictionPage";
import MonitoringMap from "./pages/MonitoringMap";
import AnalyticsPage from "./pages/AnalyticsPage";
import AlertCenterPage from "./pages/AlertCenterPage";
import ModelInsightsPage from "./pages/ModelInsightsPage";
import AboutProjectPage from "./pages/AboutProjectPage";

const MENU_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "ML Prediction", icon: BrainCircuit },
  { name: "Monitoring Map", icon: Map },
  { name: "Analytics", icon: BarChart3 },
  { name: "Alert Center", icon: Bell },
  { name: "ML Model Insights", icon: Activity },
  { name: "About Project", icon: Info },
];

const STATUS_TEXT = {
  checking: "Connecting…",
  waking: "Waking ML server…",
  online: "Online",
  offline: "Server offline",
};

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const server = useServerStatus();

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">💧</div>
          <div>
            <h2>Groundwater</h2>
            <span>Monitoring System</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                className={activePage === item.name ? "nav-item active" : "nav-item"}
                onClick={() => setActivePage(item.name)}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className={`status-dot ${server.status}`}></span>
            <div>
              <strong>{STATUS_TEXT[server.status]}</strong>
              <small>Research Prototype</small>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>{activePage}</h1>
            <p>Machine Learning Approaches for Water Quality Testing</p>
          </div>

          <div className="topbar-status">
            <span className={`status-dot ${server.status}`}></span>
            {STATUS_TEXT[server.status]}
            {server.status === "offline" && (
              <button type="button" className="status-retry" onClick={server.retry}>
                Retry
              </button>
            )}
          </div>
        </header>

        {server.status === "waking" && (
          <div className="server-banner">
            ⏳ <strong>The ML server is waking up.</strong> It runs on free
            hosting that sleeps when idle, so the first load can take up to a
            minute. Pages will fill in automatically.
          </div>
        )}

        {server.status === "offline" && (
          <div className="server-banner offline">
            ⚠️ <strong>The ML server could not be reached.</strong> Check your
            internet connection or try again in a moment.
          </div>
        )}

        {activePage === "Dashboard" && <Dashboard setActivePage={setActivePage} />}
        {activePage === "ML Prediction" && <PredictionPage />}
        {activePage === "Monitoring Map" && <MonitoringMap />}
        {activePage === "Analytics" && <AnalyticsPage />}
        {activePage === "Alert Center" && <AlertCenterPage />}
        {activePage === "ML Model Insights" && <ModelInsightsPage />}
        {activePage === "About Project" && <AboutProjectPage />}
      </main>
    </div>
  );
}

export default App;
