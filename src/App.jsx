import { useState, useEffect } from "react";
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
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";
import "./App.css";
const API_URL = import.meta.env.VITE_API_URL;
function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "ML Prediction", icon: BrainCircuit },
    { name: "Monitoring Map", icon: Map },
    { name: "Analytics", icon: BarChart3 },
    { name: "Alert Center", icon: Bell },
    { name: "ML Model Insights", icon: Activity },
    { name: "About Project", icon: Info },
  ];

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

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={
                  activePage === item.name
                    ? "nav-item active"
                    : "nav-item"
                }
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
            <span className="status-dot"></span>

            <div>
              <strong>System Online</strong>
              <small>Research Prototype</small>
            </div>
          </div>

        </div>

      </aside>


      <main className="main-content">

        <header className="topbar">

          <div>
            <h1>{activePage}</h1>

            <p>
              Machine Learning Approaches for Water Quality Testing
            </p>
          </div>

          <div className="topbar-status">
            <span className="status-dot"></span>
            Online
          </div>

        </header>


{activePage === "Dashboard" && (
  <Dashboard setActivePage={setActivePage} />
)}

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


/* =====================================================
   DASHBOARD
===================================================== */

/* =====================================================
   STAT CARD
===================================================== */

function Dashboard({ setActivePage }) {
  const [stats, setStats] = useState({
    total_samples: 0,
    total_wells: 0,
    average_uranium_ppm: 0,
    maximum_uranium_ppm: 0,
  });

  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/monitoring-data`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        return res.json();
      })

      .then((data) => {
        setStats({
          total_samples: data.total_samples,
          total_wells: data.total_wells,
          average_uranium_ppm: data.average_uranium_ppm,
          maximum_uranium_ppm: data.maximum_uranium_ppm,
        });

        setLoadingStats(false);
      })
      .catch((error) => {
        console.error("Dashboard stats error:", error);
        setLoadingStats(false);
      });
  }, []);

  return (
    <div className="dashboard">

      {/* =====================================================
          WELCOME SECTION
      ===================================================== */}

      <section className="welcome-card">

        <div>

          <span className="section-label">
            RESEARCH MONITORING PLATFORM
          </span>

          <h2>
            Groundwater Quality Monitoring Dashboard
          </h2>

          <p>
            Monitor groundwater quality, predict uranium
            concentration, analyze monitoring wells, and
            identify potential risk areas using machine learning.
          </p>

        </div>

        <div className="ml-badge">
          🤖 ML Powered
        </div>

      </section>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <section className="stats-grid">

        <StatCard
          icon="📊"
          title="Total Samples"
          value={
            loadingStats
              ? "..."
              : stats.total_samples.toLocaleString()
          }
          description="Monitoring observations"
        />

        <StatCard
          icon="📍"
          title="Monitoring Wells"
          value={
            loadingStats
              ? "..."
              : stats.total_wells
          }
          description="Hypothetical wells"
        />

        <StatCard
          icon="🧪"
          title="Average Uranium"
          value={
            loadingStats
              ? "..."
              : stats.average_uranium_ppm.toFixed(2)
          }
          description="Dataset average"
        />

        <StatCard
          icon="🎯"
          title="Model R²"
          value="0.949"
          description="5-Fold Group CV"
        />

      </section>


      {/* =====================================================
          MODULE CARDS
      ===================================================== */}

      <section className="module-grid">

  <ModuleCard
    icon="🧠"
    title="ML Prediction"
    description="Predict uranium concentration using groundwater and hydrogeological parameters."
    button="Open Prediction"
    onClick={() => setActivePage("ML Prediction")}
  />

  <ModuleCard
    icon="🗺️"
    title="Monitoring Map"
    description="Explore monitoring wells and their current prototype risk classification."
    button="Open Map"
    onClick={() => setActivePage("Monitoring Map")}
  />

  <ModuleCard
    icon="🚨"
    title="Alert Center"
    description="View monitoring alerts and identify wells requiring additional attention."
    button="View Alerts"
    onClick={() => setActivePage("Alert Center")}
  />

</section>


      {/* =====================================================
          PROJECT INFORMATION
      ===================================================== */}

      <section className="project-info">

        <div className="info-header">

          <span>
            ABOUT THE SYSTEM
          </span>

          <h2>
            Research Prototype
          </h2>

        </div>

        <p>
          This system uses machine learning to estimate groundwater
          uranium concentration from environmental and
          hydrogeological parameters.
        </p>

        <p>
          The current system is based on synthetic/hypothetical
          monitoring data and is intended for research and
          demonstration purposes.
        </p>

        <div className="prototype-warning">

          ⚠️ <strong>Prototype Notice:</strong> Predictions and
          risk classifications are not field-validated or
          regulatory assessments.

        </div>

      </section>

    </div>
  );
}


/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  icon,
  title,
  value,
  description,
}) {
  return (
    <div className="stat-card">

      <div className="stat-icon">
        {icon}
      </div>

      <div className="stat-title">
        {title}
      </div>

      <div className="stat-value">
        {value}
      </div>

      <div className="stat-description">
        {description}
      </div>

    </div>
  );
}


/* =====================================================
   MODULE CARD
===================================================== */

function ModuleCard({
  icon,
  title,
  description,
  button,
  onClick,
}) {
  return (
    <div className="module-card">

      <div className="module-icon">
        {icon}
      </div>

      <h2>{title}</h2>

      <p>{description}</p>

      <button onClick={onClick}>
        {button}
        <span>→</span>
      </button>

    </div>
  );
}

/* =====================================================
   ANALYTICS PAGE
===================================================== */
function AnalyticsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/monitoring-data`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch analytics data");
        }

        return res.json();
      })
      .then((result) => {
        setData(result.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Analytics error:", err);
        setError("Could not load analytics data.");
        setLoading(false);
      });
  }, []);

  // Risk classification using project-defined prototype thresholds
  const getRisk = (uranium) => {
    if (uranium >= 10) return "High Risk";
    if (uranium >= 5) return "Moderate Risk";
    return "Low Risk";
  };

  // Risk distribution
  const riskData = [
    {
      name: "Low Risk",
      count: data.filter((row) => row.Uranium_ppm < 5).length,
    },
    {
      name: "Moderate Risk",
      count: data.filter(
        (row) =>
          row.Uranium_ppm >= 5 &&
          row.Uranium_ppm < 10
      ).length,
    },
    {
      name: "High Risk",
      count: data.filter(
        (row) => row.Uranium_ppm >= 10
      ).length,
    },
  ];

  // Distance vs uranium data
  const distanceData = data
    .map((row) => ({
      distance: Number(row.Distance_km),
      uranium: Number(row.Uranium_ppm),
    }))
    .sort((a, b) => a.distance - b.distance);

  // Average uranium by monitoring well
  const wellMap = {};

  data.forEach((row) => {
    const well = row.Well_ID;

    if (!wellMap[well]) {
      wellMap[well] = {
        total: 0,
        count: 0,
      };
    }

    wellMap[well].total += Number(row.Uranium_ppm);
    wellMap[well].count += 1;
  });

  const wellData = Object.entries(wellMap)
    .map(([well, values]) => ({
      well,
      uranium: Number(
        (values.total / values.count).toFixed(2)
      ),
    }))
    .sort((a, b) => b.uranium - a.uranium);

  return (
    <div className="dashboard">

      <section className="welcome-card">
        <div>
          <span className="section-label">
            DATA ANALYTICS
          </span>

          <h2>
            Groundwater Quality Analytics
          </h2>

          <p>
            Analyze uranium concentration patterns,
            monitoring wells, and prototype risk
            classifications.
          </p>
        </div>

        <div className="ml-badge">
          📊 {data.length.toLocaleString()} Observations
        </div>
      </section>

      {loading && (
        <div className="map-loading">
          Loading analytics...
        </div>
      )}

      {error && (
        <div className="prototype-warning">
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Summary Cards */}

          <section className="stats-grid">

            <div className="stat-card">
              <div className="stat-icon">🧪</div>

              <div>
                <span>Average Uranium</span>
                <strong>
                  {(
                    data.reduce(
                      (sum, row) =>
                        sum + Number(row.Uranium_ppm),
                      0
                    ) / data.length
                  ).toFixed(2)}{" "}
                  ppm
                </strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⬆️</div>

              <div>
                <span>Maximum Uranium</span>
                <strong>
                  {Math.max(
                    ...data.map(
                      (row) => Number(row.Uranium_ppm)
                    )
                  ).toFixed(2)}{" "}
                  ppm
                </strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📍</div>

              <div>
                <span>Monitoring Wells</span>
                <strong>
                  {new Set(
                    data.map((row) => row.Well_ID)
                  ).size}
                </strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📊</div>

              <div>
                <span>Total Observations</span>
                <strong>
                  {data.length.toLocaleString()}
                </strong>
              </div>
            </div>

          </section>

          {/* Distance vs Uranium */}

          <section className="analytics-card">

            <div className="section-title">
              <div>
                <h2>
                  Uranium Concentration vs Distance
                </h2>

                <p className="card-description">
                  Relationship between monitoring distance
                  and uranium concentration.
                </p>
              </div>
            </div>

            <div className="chart-container">

              <ResponsiveContainer
                width="100%"
                height={350}
              >

                <LineChart data={distanceData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis
                    dataKey="distance"
                    label={{
                      value: "Distance (km)",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />

                  <YAxis
                    label={{
                      value: "Uranium (ppm)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="uranium"
                    strokeWidth={2}
                    dot={false}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </section>

          {/* Risk Distribution */}

          <section className="analytics-grid">

            <div className="analytics-card">

              <div className="section-title">
                <div>
                  <h2>
                    Prototype Risk Distribution
                  </h2>

                  <p className="card-description">
                    Observations grouped using the
                    project-defined prototype thresholds.
                  </p>
                </div>
              </div>

              <div className="chart-container">

                <ResponsiveContainer
                  width="100%"
                  height={320}
                >

                  <BarChart data={riskData}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="name" />

                    <YAxis />

                    <Tooltip />

                    <Bar
                      dataKey="count"
                      name="Observations"
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </div>

            {/* Well Analysis */}

            <div className="analytics-card">

              <div className="section-title">
                <div>
                  <h2>
                    Average Uranium by Well
                  </h2>

                  <p className="card-description">
                    Average concentration across
                    monitoring wells.
                  </p>
                </div>
              </div>

              <div className="well-analysis-list">

                {wellData.map((well) => (

                  <div
                    className="well-analysis-row"
                    key={well.well}
                  >

                    <span>
                      {well.well}
                    </span>

                    <div className="well-bar">
                      <div
                        className="well-bar-fill"
                        style={{
                          width: `${Math.min(
                            (well.uranium / 20) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>

                    <strong>
                      {well.uranium.toFixed(2)} ppm
                    </strong>

                  </div>

                ))}

              </div>

            </div>

          </section>

          <div className="prediction-note">
            ⚠️ <strong>Prototype Notice:</strong>{" "}
            Analytics are calculated from the
            synthetic/hypothetical research dataset.
            Risk categories use project-defined prototype
            thresholds and should not be interpreted as
            regulatory assessments.
          </div>

        </>
      )}

    </div>
  );
}

/* =====================================================
   ALERT CENTER
===================================================== */
function AlertCenterPage() {
  const [wells, setWells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/monitoring-data`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch alert data");
        }

        return res.json();
      })
      .then((data) => {
        const latestByWell = {};

        data.data.forEach((row) => {
          const wellId = row.Well_ID;

          if (
            !latestByWell[wellId] ||
            new Date(row.Date) >
              new Date(latestByWell[wellId].Date)
          ) {
            latestByWell[wellId] = row;
          }
        });

        const latestWells = Object.values(latestByWell)
          .map((row) => {
            const uranium = Number(row.Uranium_ppm);

            let risk = "Low Risk";

            if (uranium >= 10) {
              risk = "High Risk";
            } else if (uranium >= 5) {
              risk = "Moderate Risk";
            }

            return {
              id: row.Well_ID,
              uranium,
              distance: Number(row.Distance_km),
              date: row.Date,
              risk,
            };
          })
          .sort((a, b) => b.uranium - a.uranium);

        setWells(latestWells);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Alert data error:", err);
        setError("Could not load alert data.");
        setLoading(false);
      });
  }, []);

  const highRisk = wells.filter(
    (well) => well.risk === "High Risk"
  ).length;

  const moderateRisk = wells.filter(
    (well) => well.risk === "Moderate Risk"
  ).length;

  const lowRisk = wells.filter(
    (well) => well.risk === "Low Risk"
  ).length;

  const getRiskIcon = (risk) => {
    if (risk === "High Risk") return "🔴";
    if (risk === "Moderate Risk") return "🟠";
    return "🟢";
  };

  const getActionText = (risk) => {
    if (risk === "High Risk") {
      return "Attention Required";
    }

    if (risk === "Moderate Risk") {
      return "Continue Monitoring";
    }

    return "Prototype Normal";
  };

  return (
    <div className="dashboard">

      {/* Header */}

      <section className="welcome-card">
        <div>
          <span className="section-label">
            ALERT MANAGEMENT
          </span>

          <h2>
            Groundwater Alert Center
          </h2>

          <p>
            Monitor prototype risk classifications and
            identify monitoring wells that may require
            additional attention.
          </p>
        </div>

        <div className="ml-badge">
          🚨 Alert System
        </div>
      </section>

      {loading && (
        <div className="map-loading">
          Loading alerts...
        </div>
      )}

      {error && (
        <div className="prototype-warning">
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Alert Statistics */}

          <section className="stats-grid">

            <div className="stat-card">
              <div className="stat-icon">
                🚨
              </div>

              <div>
                <span>Total Alerts</span>

                <strong>
                  {highRisk + moderateRisk}
                </strong>

                <small>
                  Monitoring locations
                </small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                🔴
              </div>

              <div>
                <span>High Risk</span>

                <strong>
                  {highRisk}
                </strong>

                <small>
                  Attention required
                </small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                🟠
              </div>

              <div>
                <span>Moderate Risk</span>

                <strong>
                  {moderateRisk}
                </strong>

                <small>
                  Continue monitoring
                </small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                🟢
              </div>

              <div>
                <span>Low Risk</span>

                <strong>
                  {lowRisk}
                </strong>

                <small>
                  Prototype normal
                </small>
              </div>
            </div>

          </section>

          {/* Alerts */}

          <section className="alert-section">

            <div className="section-title">
              <div>
                <h2>
                  Monitoring Alerts
                </h2>

                <p className="card-description">
                  Latest prototype risk classification
                  for each monitoring well.
                </p>
              </div>

              <span>
                {wells.length} locations
              </span>
            </div>

            <div className="alert-list">

              {wells.map((well) => (

                <div
                  className={`alert-card ${well.risk
                    .toLowerCase()
                    .replace(" ", "-")}`}
                  key={well.id}
                >

                  <div className="alert-icon">
                    {getRiskIcon(well.risk)}
                  </div>

                  <div className="alert-content">

                    <div className="alert-header">

                      <h3>
                        {well.id}
                      </h3>

                      <span
                        className={`alert-risk ${well.risk
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {well.risk}
                      </span>

                    </div>

                    <p>
                      <strong>
                        Observed uranium concentration:
                      </strong>{" "}
                      {well.uranium.toFixed(2)} ppm
                    </p>

                    <p>
                      <strong>
                        Distance from study site:
                      </strong>{" "}
                      {well.distance.toFixed(2)} km
                    </p>

                    <p>
                      <strong>
                        Latest observation:
                      </strong>{" "}
                      {new Date(
                        well.date
                      ).toLocaleDateString()}
                    </p>

                    <div className="alert-action">
                      {getRiskIcon(well.risk)}{" "}
                      {getActionText(well.risk)}
                    </div>

                  </div>

                </div>

              ))}

            </div>

          </section>

          {/* Risk Classification */}

          <section className="risk-logic-card">

            <div className="section-title">
              <div>
                <span className="section-label">
                  RISK CLASSIFICATION
                </span>

                <h2>
                  Prototype Alert Logic
                </h2>
              </div>
            </div>

            <div className="risk-logic-grid">

              <div>
                <span>🔴</span>

                <h3>
                  High Risk
                </h3>

                <p>
                  Uranium ≥ 10 ppm
                </p>
              </div>

              <div>
                <span>🟠</span>

                <h3>
                  Moderate Risk
                </h3>

                <p>
                  Uranium ≥ 5 ppm and &lt; 10 ppm
                </p>
              </div>

              <div>
                <span>🟢</span>

                <h3>
                  Low Risk
                </h3>

                <p>
                  Uranium &lt; 5 ppm
                </p>
              </div>

            </div>

          </section>

          <div className="prediction-note">
            ⚠️ <strong>Prototype Notice:</strong>{" "}
            These thresholds are project-defined prototype
            classifications and are not regulatory limits.
            The displayed well data are synthetic/hypothetical.
          </div>

        </>
      )}

    </div>
  );
}


   
function ModelInsightsPage() {
  const featureImportance = [
    { feature: "Distance from Site", value: 75.11 },
    { feature: "TDS", value: 20.43 },
    { feature: "Rainfall", value: 2.37 },
    { feature: "Conductivity", value: 0.96 },
    { feature: "Hydraulic K", value: 0.73 },
    { feature: "Nitrate", value: 0.18 },
    { feature: "pH", value: 0.10 },
    { feature: "Aquifer Depth", value: 0.04 },
    { feature: "Temperature", value: 0.03 },
    { feature: "Soil Permeability", value: 0.02 },
    { feature: "Porosity", value: 0.02 },
    { feature: "Dissolved Oxygen", value: 0.02 },
  ];

  return (
    <div className="dashboard">

      <section className="welcome-card">
        <div>
          <span className="section-label">
            MODEL EXPLAINABILITY
          </span>

          <h2>ML Model Insights</h2>

          <p>
            Understand the machine learning model, input
            features, validation strategy, and factors
            associated with uranium concentration prediction.
          </p>
        </div>

        <div className="ml-badge">
          🧠 Explainable ML
        </div>
      </section>

      {/* Model Statistics */}

      <section className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon">🤖</div>

          <div>
            <span>Algorithm</span>
            <strong>GBR</strong>
            <small>Gradient Boosting Regression</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🌳</div>

          <div>
            <span>Estimators</span>
            <strong>200</strong>
            <small>Boosting stages</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>

          <div>
            <span>Input Features</span>
            <strong>12</strong>
            <small>Environmental parameters</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔄</div>

          <div>
            <span>Validation</span>
            <strong>5-Fold</strong>
            <small>Group K-Fold CV</small>
          </div>
        </div>

      </section>

      {/* Validation Metrics */}

      <section className="analytics-card">

        <div className="section-title">
          <div>
            <span className="section-label">
              MODEL PERFORMANCE
            </span>

            <h2>Group K-Fold Validation</h2>

            <p className="card-description">
              Performance averaged across five well-grouped
              validation folds.
            </p>
          </div>
        </div>

        <div className="model-metrics-grid">

          <div className="model-metric">
            <span>MAE</span>
            <strong>0.626</strong>
            <small>ppm</small>
          </div>

          <div className="model-metric">
            <span>RMSE</span>
            <strong>0.787</strong>
            <small>ppm</small>
          </div>

          <div className="model-metric">
            <span>R²</span>
            <strong>0.949</strong>
            <small>coefficient of determination</small>
          </div>

        </div>

      </section>

      {/* ML Pipeline */}

      <section className="analytics-card">

        <div className="section-title">
          <div>
            <span className="section-label">
              MACHINE LEARNING PIPELINE
            </span>

            <h2>From Monitoring Data to Prediction</h2>
          </div>
        </div>

        <div className="pipeline-grid">

          <div className="pipeline-step">
            <span>1</span>
            <h3>Monitoring Data</h3>
            <p>
              Environmental and hydrogeological parameters
            </p>
          </div>

          <div className="pipeline-arrow">→</div>

          <div className="pipeline-step">
            <span>2</span>
            <h3>Preprocessing</h3>
            <p>
              Cleaning and feature preparation
            </p>
          </div>

          <div className="pipeline-arrow">→</div>

          <div className="pipeline-step">
            <span>3</span>
            <h3>Gradient Boosting</h3>
            <p>
              Trained regression model
            </p>
          </div>

          <div className="pipeline-arrow">→</div>

          <div className="pipeline-step">
            <span>4</span>
            <h3>Prediction</h3>
            <p>
              Estimated uranium concentration
            </p>
          </div>

          <div className="pipeline-arrow">→</div>

          <div className="pipeline-step">
            <span>5</span>
            <h3>Risk Classification</h3>
            <p>
              Prototype monitoring category
            </p>
          </div>

        </div>

      </section>

      {/* Feature Importance */}

      <section className="analytics-card">

        <div className="section-title">
          <div>
            <span className="section-label">
              FEATURE IMPORTANCE
            </span>

            <h2>Model Feature Importance</h2>

            <p className="card-description">
              Relative contribution of input features to
              the trained Gradient Boosting model.
            </p>
          </div>
        </div>

        <div className="feature-importance-list">

          {featureImportance.map((item) => (

            <div
              className="feature-row"
              key={item.feature}
            >

              <div className="feature-name">
                {item.feature}
              </div>

              <div className="feature-bar">
                <div
                  className="feature-bar-fill"
                  style={{
                    width: `${Math.max(
                      item.value,
                      1
                    )}%`,
                  }}
                />
              </div>

              <strong>
                {item.value.toFixed(2)}%
              </strong>

            </div>

          ))}

        </div>

        <div className="interpretation-note">
          <strong>⚠️ Interpretation:</strong>

          <p>
            Feature importance indicates how useful a
            feature was to the trained model's predictions.
            It does not establish that the feature causes
            changes in uranium concentration.
          </p>
        </div>

      </section>

      {/* Model Configuration */}

      <section className="analytics-grid">

        <div className="analytics-card">

          <span className="section-label">
            MODEL CONFIGURATION
          </span>

          <h2>Gradient Boosting Regressor</h2>

          <div className="config-list">

            <div>
              <span>Estimators</span>
              <strong>200</strong>
            </div>

            <div>
              <span>Learning Rate</span>
              <strong>0.05</strong>
            </div>

            <div>
              <span>Maximum Tree Depth</span>
              <strong>3</strong>
            </div>

            <div>
              <span>Random State</span>
              <strong>42</strong>
            </div>

          </div>

        </div>

        <div className="analytics-card">

          <span className="section-label">
            TRAINING DATASET
          </span>

          <h2>Research Dataset</h2>

          <p className="card-description">
            The current research dataset contains:
          </p>

          <div className="dataset-highlights">

            <div>
              <strong>3,000</strong>
              <span>Observations</span>
            </div>

            <div>
              <strong>30</strong>
              <span>Hypothetical Wells</span>
            </div>

            <div>
              <strong>12</strong>
              <span>Input Features</span>
            </div>

          </div>

        </div>

      </section>

      {/* Validation Strategy */}

      <section className="analytics-card">

        <span className="section-label">
          VALIDATION STRATEGY
        </span>

        <h2>Group-Based Cross Validation</h2>

        <p className="card-description">
          Group-based validation keeps observations from
          the same monitoring well within the same fold.
          This helps evaluate how the model generalizes
          to monitoring wells that were not represented in
          the corresponding training fold.
        </p>

      </section>

      {/* Research Limitations */}

      <section className="analytics-card limitation-card">

        <span className="section-label">
          RESEARCH LIMITATIONS
        </span>

        <h2>Important Considerations</h2>

        <ul>
          <li>
            The current model was developed using a
            synthetic/hypothetical groundwater dataset.
          </li>

          <li>
            Reported performance should not be interpreted
            as evidence of field performance.
          </li>

          <li>
            Feature importance describes model behavior
            and should not be interpreted as causal
            relationships.
          </li>

          <li>
            Additional real-world monitoring data,
            independent validation, sensor integration,
            and field testing would be required before
            operational use.
          </li>
        </ul>

      </section>

      <div className="prediction-note">
        ⚠️ <strong>Prototype Notice:</strong>{" "}
        This system is a research and demonstration
        prototype and is not a regulatory or field-validated
        environmental monitoring system.
      </div>

    </div>
  );
}

function AboutProjectPage() {
  return (
    <div className="dashboard">

      <section className="welcome-card">
        <div>
          <span className="section-label">
            ABOUT THE SYSTEM
          </span>

          <h2>
            Machine Learning Approaches for Water Quality Testing
          </h2>

          <p>
            A research and demonstration platform for
            groundwater quality monitoring using machine
            learning, spatial analysis, and data visualization.
          </p>
        </div>

        <div className="ml-badge">
          🔬 Research Prototype
        </div>
      </section>

      {/* Project Overview */}

      <section className="analytics-card">

        <span className="section-label">
          PROJECT OVERVIEW
        </span>

        <h2>Groundwater Quality Monitoring</h2>

        <p className="card-description">
          This project explores the use of machine learning
          approaches to estimate groundwater uranium
          concentration from environmental and hydrogeological
          parameters.
        </p>

        <p className="card-description">
          The platform combines machine learning prediction,
          monitoring-well visualization, analytics, prototype
          risk classification, and model explainability into
          a single research monitoring interface.
        </p>

      </section>

      {/* Objectives */}

      <section className="analytics-grid">

        <div className="analytics-card">

          <span className="section-label">
            OBJECTIVES
          </span>

          <h2>Research Objectives</h2>

          <ul className="about-list">
            <li>
              Develop a machine learning approach for
              groundwater uranium concentration estimation.
            </li>

            <li>
              Analyze environmental and hydrogeological
              parameters associated with water quality.
            </li>

            <li>
              Explore spatial patterns across hypothetical
              monitoring wells.
            </li>

            <li>
              Develop a dashboard for monitoring,
              visualization, and research analysis.
            </li>

            <li>
              Evaluate model generalization using
              group-based cross-validation.
            </li>
          </ul>

        </div>

        <div className="analytics-card">

          <span className="section-label">
            SYSTEM CAPABILITIES
          </span>

          <h2>Platform Modules</h2>

          <div className="about-module-list">

            <div>
              <span>🧠</span>
              <strong>ML Prediction</strong>
              <small>
                Uranium concentration estimation
              </small>
            </div>

            <div>
              <span>🗺️</span>
              <strong>Monitoring Map</strong>
              <small>
                Spatial visualization of wells
              </small>
            </div>

            <div>
              <span>📊</span>
              <strong>Analytics</strong>
              <small>
                Dataset trends and statistics
              </small>
            </div>

            <div>
              <span>🚨</span>
              <strong>Alert Center</strong>
              <small>
                Prototype risk classification
              </small>
            </div>

            <div>
              <span>🔬</span>
              <strong>Model Insights</strong>
              <small>
                Model performance and explainability
              </small>
            </div>

          </div>

        </div>

      </section>

      {/* Methodology */}

      <section className="analytics-card">

        <span className="section-label">
          METHODOLOGY
        </span>

        <h2>Research Workflow</h2>

        <div className="about-workflow">

          <div>
            <span>01</span>
            <strong>Data Collection</strong>
            <p>
              Groundwater and hydrogeological parameters
              are organized into the research dataset.
            </p>
          </div>

          <div>
            <span>02</span>
            <strong>Data Preparation</strong>
            <p>
              Data are cleaned and prepared for machine
              learning analysis.
            </p>
          </div>

          <div>
            <span>03</span>
            <strong>Model Training</strong>
            <p>
              A Gradient Boosting regression model is
              trained using 12 input features.
            </p>
          </div>

          <div>
            <span>04</span>
            <strong>Model Validation</strong>
            <p>
              Group-based cross-validation is used to
              evaluate generalization across wells.
            </p>
          </div>

          <div>
            <span>05</span>
            <strong>Dashboard Integration</strong>
            <p>
              Predictions and monitoring information are
              exposed through the web platform.
            </p>
          </div>

        </div>

      </section>

      {/* Technology Stack */}

      <section className="analytics-card">

        <span className="section-label">
          TECHNOLOGY STACK
        </span>

        <h2>Tools & Technologies</h2>

        <div className="tech-grid">

          <div>
            <strong>Python</strong>
            <span>Machine learning & data processing</span>
          </div>

          <div>
            <strong>Scikit-learn</strong>
            <span>Model training & evaluation</span>
          </div>

          <div>
            <strong>Pandas</strong>
            <span>Dataset processing</span>
          </div>

          <div>
            <strong>FastAPI</strong>
            <span>ML prediction backend</span>
          </div>

          <div>
            <strong>React</strong>
            <span>Interactive web interface</span>
          </div>

          <div>
            <strong>Leaflet</strong>
            <span>Monitoring map visualization</span>
          </div>

        </div>

      </section>

      {/* Dataset */}

      <section className="analytics-card">

        <span className="section-label">
          RESEARCH DATASET
        </span>

        <h2>Dataset Overview</h2>

        <div className="dataset-highlights">

          <div>
            <strong>3,000</strong>
            <span>Observations</span>
          </div>

          <div>
            <strong>30</strong>
            <span>Hypothetical Wells</span>
          </div>

          <div>
            <strong>12</strong>
            <span>ML Features</span>
          </div>

        </div>

        <p className="card-description about-dataset-text">
          The current dataset represents synthetic/hypothetical
          groundwater monitoring observations collected across
          multiple monitoring wells and dates.
        </p>

      </section>

      {/* Future Scope */}

      <section className="analytics-card">

        <span className="section-label">
          FUTURE SCOPE
        </span>

        <h2>Future Development</h2>

        <div className="future-grid">

          <div>
            <span>📡</span>
            <h3>Real-Time Sensors</h3>
            <p>
              Integrate real-world monitoring sensors and
              streaming environmental data.
            </p>
          </div>

          <div>
            <span>🧪</span>
            <h3>Field Validation</h3>
            <p>
              Evaluate model performance using independent
              real-world groundwater measurements.
            </p>
          </div>

          <div>
            <span>🔔</span>
            <h3>Automated Alerts</h3>
            <p>
              Develop notification workflows for monitoring
              events requiring additional review.
            </p>
          </div>

          <div>
            <span>☁️</span>
            <h3>Cloud Deployment</h3>
            <p>
              Deploy the monitoring platform for remote
              research access and continuous analysis.
            </p>
          </div>

        </div>

      </section>

      {/* Limitations */}

      <section className="analytics-card limitation-card">

        <span className="section-label">
          RESEARCH LIMITATIONS
        </span>

        <h2>Important Considerations</h2>

        <ul>
          <li>
            The current dataset is synthetic/hypothetical
            and does not represent field measurements.
          </li>

          <li>
            Model performance metrics should not be interpreted
            as evidence of field performance.
          </li>

          <li>
            Feature importance describes model behavior and
            does not establish causal relationships.
          </li>

          <li>
            Real-world monitoring data and independent
            validation would be required before operational use.
          </li>

          <li>
            Prototype risk categories are project-defined
            classifications and are not regulatory limits.
          </li>
        </ul>

      </section>

      <div className="prediction-note">
        ⚠️ <strong>Prototype Notice:</strong>{" "}
        This platform is intended for research and
        demonstration purposes. It is not a field-validated
        or regulatory environmental monitoring system.
      </div>

    </div>
  );
}
/* =====================================================
   COMING SOON PAGE
===================================================== */

function ComingSoonPage({ pageName }) {
  return (
    <div className="coming-soon">

      <div className="coming-icon">
        🚧
      </div>

      <h2>{pageName}</h2>

      <p>
        This section will be developed next.
      </p>

      <span>
        Groundwater Quality Monitoring System
      </span>

    </div>
  );
}


/* =====================================================
   ML PREDICTION PAGE
===================================================== */

function PredictionPage() {

  const [formData, setFormData] = useState({
    Distance_km: 10,
    pH: 7,
    TDS: 900,
    Conductivity: 580,
    Hydraulic_K: 25,
    Temperature_C: 25,
    Dissolved_Oxygen: 5.5,
    Nitrate: 25,
    Rainfall_mm: 80,
    Aquifer_Depth_m: 110,
    Soil_Permeability: 0.0001,
    Porosity: 0.22,
  });


  const [prediction, setPrediction] = useState(null);

  const [risk, setRisk] = useState("");

  const [loading, setLoading] = useState(false);


  /* -------------------------------------------------
     HANDLE INPUT
  ------------------------------------------------- */

  const handleChange = (e) => {

    const name = e.target.name;

    const value = e.target.value;

    setFormData({
      ...formData,
      [name]: value,
    });

  };


  /* -------------------------------------------------
     SEND DATA TO FASTAPI
  ------------------------------------------------- */

  const handlePredict = async () => {

    try {

      setLoading(true);

      const requestData = {
        Distance_km: Number(formData.Distance_km),
        pH: Number(formData.pH),
        TDS: Number(formData.TDS),
        Conductivity: Number(formData.Conductivity),
        Hydraulic_K: Number(formData.Hydraulic_K),
        Temperature_C: Number(formData.Temperature_C),
        Dissolved_Oxygen: Number(formData.Dissolved_Oxygen),
        Nitrate: Number(formData.Nitrate),
        Rainfall_mm: Number(formData.Rainfall_mm),
        Aquifer_Depth_m: Number(formData.Aquifer_Depth_m),
        Soil_Permeability: Number(formData.Soil_Permeability),
        Porosity: Number(formData.Porosity),
      };


      console.log(
        "Sending data to FastAPI:",
        requestData
      );


      
        const response = await fetch(`${API_URL}/predict`, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(requestData),
        }
      );


      if (!response.ok) {

        throw new Error(
          "Prediction request failed"
        );

      }


      const result = await response.json();


      console.log(
        "FastAPI response:",
        result
      );


      setPrediction(
        result.predicted_uranium_ppm
      );

      setRisk(
        result.risk
      );


    } catch (error) {

      console.error(
        "Prediction Error:",
        error
      );

      alert(
        "Could not connect to the ML server. Make sure FastAPI is running on port 8000."
      );

    } finally {

      setLoading(false);

    }

  };


  /* -------------------------------------------------
     FORM SUBMIT
  ------------------------------------------------- */

  const handleSubmit = (e) => {

    e.preventDefault();

    handlePredict();

  };


  return (
    <div className="prediction-page">


      {/* PAGE INTRODUCTION */}

      <div className="page-intro">

        <div>

          <span className="section-label">
            MACHINE LEARNING
          </span>

          <h2>
            Uranium Concentration Prediction
          </h2>

          <p>
            Enter groundwater and hydrogeological parameters
            to estimate uranium concentration using the trained
            Gradient Boosting Regression model.
          </p>

        </div>


        <div className="model-badge">
          🤖 Gradient Boosting
        </div>

      </div>


      <div className="prediction-layout">


        {/* =================================================
           INPUT CARD
        ================================================= */}

        <div className="prediction-card">

          <h3>
            📋 Monitoring Parameters
          </h3>

          <p className="card-description">
            Enter the values measured from the monitoring location.
          </p>


          <form onSubmit={handleSubmit}>

            <div className="input-grid">


              <InputField
                label="Distance from ISR Site (km)"
                name="Distance_km"
                value={formData.Distance_km}
                onChange={handleChange}
              />


              <InputField
                label="pH"
                name="pH"
                value={formData.pH}
                onChange={handleChange}
              />


              <InputField
                label="TDS"
                name="TDS"
                value={formData.TDS}
                onChange={handleChange}
              />


              <InputField
                label="Conductivity"
                name="Conductivity"
                value={formData.Conductivity}
                onChange={handleChange}
              />


              <InputField
                label="Hydraulic K"
                name="Hydraulic_K"
                value={formData.Hydraulic_K}
                onChange={handleChange}
              />


              <InputField
                label="Temperature (°C)"
                name="Temperature_C"
                value={formData.Temperature_C}
                onChange={handleChange}
              />


              <InputField
                label="Dissolved Oxygen"
                name="Dissolved_Oxygen"
                value={formData.Dissolved_Oxygen}
                onChange={handleChange}
              />


              <InputField
                label="Nitrate"
                name="Nitrate"
                value={formData.Nitrate}
                onChange={handleChange}
              />


              <InputField
                label="Rainfall (mm)"
                name="Rainfall_mm"
                value={formData.Rainfall_mm}
                onChange={handleChange}
              />


              <InputField
                label="Aquifer Depth (m)"
                name="Aquifer_Depth_m"
                value={formData.Aquifer_Depth_m}
                onChange={handleChange}
              />


              <InputField
                label="Soil Permeability"
                name="Soil_Permeability"
                value={formData.Soil_Permeability}
                onChange={handleChange}
              />


              <InputField
                label="Porosity"
                name="Porosity"
                value={formData.Porosity}
                onChange={handleChange}
              />

            </div>


            <button
              type="submit"
              className="predict-button"
              disabled={loading}
            >

              {loading
                ? "⏳ Predicting..."
                : "🔮 Predict Uranium Concentration"}

            </button>

          </form>

        </div>


        {/* =================================================
           RESULT CARD
        ================================================= */}

        <div className="result-card">

          <div className="result-header">

            <span>
              MODEL OUTPUT
            </span>

            <div className="prediction-status">
              Prototype
            </div>

          </div>


          <h3>
            Predicted Uranium
          </h3>


          <div className="prediction-value">

            {prediction !== null
              ? prediction
              : "—"}

          </div>


          <p className="prediction-unit">
            ppm
          </p>


          <div className="result-placeholder">

            {prediction !== null
              ? "Prediction generated successfully."
              : "Enter the monitoring parameters and run the prediction."}

          </div>


          <div className="risk-placeholder">

            {risk
              ? "⚠️ " + risk
              : "Risk classification will appear here."}

          </div>

        </div>

      </div>


      {/* PROTOTYPE NOTICE */}

      <div className="prediction-note">

        ⚠️ <strong>Prototype Notice:</strong>{" "}

        This prediction is generated by the trained Gradient
        Boosting model through FastAPI. The current dataset
        and model are synthetic/hypothetical and have not
        been field validated.

      </div>

    </div>
  );
}


/* =====================================================
   INPUT FIELD
===================================================== */

function InputField({
  label,
  name,
  value,
  onChange,
}) {

  return (
    <div className="input-field">

      <label>
        {label}
      </label>

      <input
        type="number"
        step="any"
        name={name}
        value={value}
        onChange={onChange}
      />

    </div>
  );
}


function MonitoringMap() {

  const [wells, setWells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {

    fetch(`${API_URL}/monitoring-data`)

      .then((res) => {

        if (!res.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        return res.json();

      })

      .then((data) => {

        /*
          Find the latest observation
          for every monitoring well.
        */

        const latestByWell = {};

        data.data.forEach((row) => {

          const wellId = row.Well_ID;

          if (
            !latestByWell[wellId] ||
            new Date(row.Date) >
              new Date(latestByWell[wellId].Date)
          ) {

            latestByWell[wellId] = row;

          }

        });


        /*
          Convert latest observations
          into map-friendly objects.
        */

        const latestWells = Object.values(
          latestByWell
        ).map((row) => {

          let risk = "Low Risk";

          if (row.Uranium_ppm >= 10) {
            risk = "High Risk";
          }
          else if (row.Uranium_ppm >= 5) {
            risk = "Moderate Risk";
          }

          return {

            id: row.Well_ID,

            lat: Number(row.Latitude),

            lon: Number(row.Longitude),

            uranium: Number(row.Uranium_ppm),

            distance: Number(row.Distance_km),

            date: row.Date,

            risk: risk,

          };

        });


        setWells(latestWells);

        setLoading(false);

      })

      .catch((err) => {

        console.error(
          "Monitoring data error:",
          err
        );

        setError(
          "Could not load monitoring data."
        );

        setLoading(false);

      });

  }, []);


  /*
    Risk color
  */

  const getRiskColor = (risk) => {

    if (risk === "High Risk") {
      return "red";
    }

    if (risk === "Moderate Risk") {
      return "orange";
    }

    return "green";

  };


  return (

    <div className="dashboard">


      {/* PAGE HEADER */}

      <section className="welcome-card">

        <div>

          <span className="section-label">
            MONITORING WELLS
          </span>

          <h2>
            Groundwater Monitoring Map
          </h2>

          <p>
            Interactive visualization of monitoring wells
            from the groundwater monitoring dataset.
          </p>

        </div>


        <div className="ml-badge">
          🗺️ {wells.length || 30} Wells
        </div>

      </section>


      {/* MAP CARD */}

      <section className="prediction-card">

        <div className="section-title">

          <div>

            <h2>
              Monitoring Network
            </h2>

            <p className="card-description">
              Latest available observation for each
              monitoring well.
            </p>

          </div>


          <div className="map-legend">

            <span>
              <i
                style={{
                  background: "green"
                }}
              ></i>
              Low Risk
            </span>

            <span>
              <i
                style={{
                  background: "orange"
                }}
              ></i>
              Moderate Risk
            </span>

            <span>
              <i
                style={{
                  background: "red"
                }}
              ></i>
              High Risk
            </span>

          </div>

        </div>


        {/* LOADING */}

        {loading && (

          <div className="map-loading">

            Loading monitoring wells...

          </div>

        )}


        {/* ERROR */}

        {error && (

          <div className="prototype-warning">

            ⚠️ {error}

          </div>

        )}


        {/* MAP */}

        {!loading && !error && (

          <div className="real-map">

            <MapContainer

              center={[23.7, 86.4]}

              zoom={9}

              scrollWheelZoom={true}

              style={{
                height: "600px",
                width: "100%"
              }}

            >

              <TileLayer

                attribution="&copy; OpenStreetMap contributors"

                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

              />


              {wells.map((well) => (

                <CircleMarker

                  key={well.id}

                  center={[
                    well.lat,
                    well.lon
                  ]}

                  radius={9}

                  pathOptions={{

                    color:
                      getRiskColor(
                        well.risk
                      ),

                    fillColor:
                      getRiskColor(
                        well.risk
                      ),

                    fillOpacity: 0.8,

                    weight: 2,

                  }}

                >

                  <Popup>

                    <div className="map-popup">

                      <h3>
                        {well.id}
                      </h3>

                      <p>
                        <strong>
                          Distance:
                        </strong>{" "}
                        {well.distance.toFixed(2)}
                        {" "}km
                      </p>

                      <p>
                        <strong>
                          Uranium:
                        </strong>{" "}
                        {well.uranium.toFixed(2)}
                        {" "}ppm
                      </p>

                      <p>
                        <strong>
                          Risk:
                        </strong>{" "}

                        <span
                          style={{
                            color:
                              getRiskColor(
                                well.risk
                              ),
                            fontWeight: "600"
                          }}
                        >
                          {well.risk}
                        </span>

                      </p>

                      <p>

                        <strong>
                          Date:
                        </strong>{" "}

                        {new Date(
                          well.date
                        ).toLocaleDateString()}

                      </p>

                      <small>

                        Latest observation from
                        the synthetic/hypothetical
                        monitoring dataset.

                      </small>

                    </div>

                  </Popup>

                </CircleMarker>

              ))}

            </MapContainer>

          </div>

        )}

      </section>


      {/* WELL TABLE */}

      {!loading && !error && (

        <section className="map-table-card">

          <div className="section-title">

            <h2>
              Monitoring Wells
            </h2>

            <span>
              {wells.length} wells
            </span>

          </div>


          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>
                    Well ID
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Distance
                  </th>

                  <th>
                    Uranium
                  </th>

                  <th>
                    Risk
                  </th>

                </tr>

              </thead>


              <tbody>

                {wells.map((well) => (

                  <tr key={well.id}>

                    <td>
                      <strong>
                        {well.id}
                      </strong>
                    </td>

                    <td>
                      {new Date(
                        well.date
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      {well.distance.toFixed(2)}
                      {" "}km
                    </td>

                    <td>
                      {well.uranium.toFixed(2)}
                      {" "}ppm
                    </td>

                    <td>

                      <span
                        className="risk-badge"
                        style={{
                          color:
                            getRiskColor(
                              well.risk
                            )
                        }}
                      >
                        {well.risk}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </section>

      )}


      {/* PROTOTYPE NOTICE */}

      <div className="prediction-note">

        ⚠️ <strong>Prototype Notice:</strong>{" "}
        The displayed monitoring locations and uranium
        values are from the synthetic/hypothetical research
        dataset. Risk categories use the project-defined
        prototype thresholds and are not regulatory assessments.

      </div>

    </div>

  );
}

export default App;
