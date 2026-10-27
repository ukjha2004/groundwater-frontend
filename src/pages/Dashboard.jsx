import { useApi } from "../api";
import StatCard from "../components/StatCard";
import ModuleCard from "../components/ModuleCard";
import LoadState from "../components/LoadState";

export default function Dashboard({ setActivePage }) {
  const summary = useApi("/summary");
  const modelInfo = useApi("/model-info");

  const stats = summary.data;
  const metrics = modelInfo.data?.metrics;
  const r2 = metrics?.r2;

  return (
    <div className="dashboard">
      {/* WELCOME */}
      <section className="welcome-card">
        <div>
          <span className="section-label">RESEARCH MONITORING PLATFORM</span>
          <h2>Groundwater Quality Monitoring Dashboard</h2>
          <p>
            Monitor groundwater quality, predict uranium concentration, analyze
            monitoring wells, and identify potential risk areas using machine
            learning.
          </p>
        </div>
        <div className="ml-badge">🤖 ML Powered</div>
      </section>

      {/* STATISTICS */}
      {summary.error ? (
        <LoadState error={summary.error} onRetry={summary.retry} />
      ) : (
        <section className="stats-grid">
          <StatCard
            icon="📊"
            title="Total Samples"
            value={stats ? stats.total_samples.toLocaleString() : "…"}
            description={
              stats
                ? `Observations ${stats.date_start} → ${stats.date_end}`
                : "Monitoring observations"
            }
          />
          <StatCard
            icon="📍"
            title="Monitoring Wells"
            value={stats ? stats.total_wells : "…"}
            description="Hypothetical wells"
          />
          <StatCard
            icon="🧪"
            title="Average Uranium"
            value={stats ? `${stats.average_uranium_ppm.toFixed(2)} ppm` : "…"}
            description="Dataset average"
          />
          <StatCard
            icon="🎯"
            title="Model R²"
            value={r2 !== undefined ? r2.toFixed(3) : "…"}
            description={metrics ? metrics.method_short : "Cross-validation"}
          />
        </section>
      )}

      {/* MODULES */}
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

      {/* ABOUT */}
      <section className="project-info">
        <div className="info-header">
          <span>ABOUT THE SYSTEM</span>
          <h2>Research Prototype</h2>
        </div>
        <p>
          This system uses machine learning to estimate groundwater uranium
          concentration from environmental and hydrogeological parameters.
        </p>
        <p>
          The current system is based on synthetic/hypothetical monitoring data
          and is intended for research and demonstration purposes.
        </p>
        <div className="prototype-warning">
          ⚠️ <strong>Prototype Notice:</strong> Predictions and risk
          classifications are not field-validated or regulatory assessments.
        </div>
      </section>
    </div>
  );
}
