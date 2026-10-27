import {
  ScatterChart,
  Scatter,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useApi } from "../api";
import { riskColor } from "../utils/risk";
import LoadState from "../components/LoadState";

export default function AnalyticsPage() {
  const analytics = useApi("/analytics");
  const summary = useApi("/summary");

  const loading = analytics.loading || summary.loading;
  const error = analytics.error || summary.error;
  const retry = () => {
    if (analytics.error) analytics.retry();
    if (summary.error) summary.retry();
  };

  const data = analytics.data;
  const stats = summary.data;
  const maxWellAverage = data
    ? Math.max(...data.well_averages.map((well) => well.uranium_ppm))
    : 1;

  return (
    <div className="dashboard">
      <section className="welcome-card">
        <div>
          <span className="section-label">DATA ANALYTICS</span>
          <h2>Groundwater Quality Analytics</h2>
          <p>
            Analyze uranium concentration patterns, monitoring wells, and
            prototype risk classifications.
          </p>
        </div>
        <div className="ml-badge">
          📊 {stats ? stats.total_samples.toLocaleString() : "…"} Observations
        </div>
      </section>

      <LoadState loading={loading} error={error} onRetry={retry} label="analytics" />

      {!loading && !error && data && stats && (
        <>
          {/* SUMMARY */}
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🧪</div>
              <div>
                <span>Average Uranium</span>
                <strong>{stats.average_uranium_ppm.toFixed(2)} ppm</strong>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⬆️</div>
              <div>
                <span>Maximum Uranium</span>
                <strong>{stats.maximum_uranium_ppm.toFixed(2)} ppm</strong>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📍</div>
              <div>
                <span>Monitoring Wells</span>
                <strong>{stats.total_wells}</strong>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div>
                <span>Total Observations</span>
                <strong>{stats.total_samples.toLocaleString()}</strong>
              </div>
            </div>
          </section>

          {/* DISTANCE VS URANIUM (scatter: one dot per observation) */}
          <section className="analytics-card">
            <div className="section-title">
              <div>
                <h2>Uranium Concentration vs Distance</h2>
                <p className="card-description">
                  Each dot is one observation. Concentration falls with distance
                  from the hypothetical ISR site.
                </p>
              </div>
            </div>

            <div className="chart-container">
              <ResponsiveContainer width="100%" height={350}>
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    dataKey="distance_km"
                    name="Distance"
                    unit=" km"
                    label={{ value: "Distance (km)", position: "insideBottom", offset: -10 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="uranium_ppm"
                    name="Uranium"
                    unit=" ppm"
                    label={{ value: "Uranium (ppm)", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter
                    data={data.distance_scatter}
                    fill="#0c666c"
                    fillOpacity={0.35}
                    isAnimationActive={false}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="analytics-grid">
            {/* RISK DISTRIBUTION */}
            <div className="analytics-card">
              <div className="section-title">
                <div>
                  <h2>Prototype Risk Distribution</h2>
                  <p className="card-description">
                    All observations grouped using the project-defined
                    prototype thresholds.
                  </p>
                </div>
              </div>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={data.risk_distribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" name="Observations">
                      {data.risk_distribution.map((entry) => (
                        <Cell key={entry.name} fill={riskColor(entry.name)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* WELL AVERAGES */}
            <div className="analytics-card">
              <div className="section-title">
                <div>
                  <h2>Average Uranium by Well</h2>
                  <p className="card-description">
                    Average concentration across monitoring wells.
                  </p>
                </div>
              </div>

              <div className="well-analysis-list">
                {data.well_averages.map((well) => (
                  <div className="well-analysis-row" key={well.well}>
                    <span>{well.well}</span>
                    <div className="well-bar">
                      <div
                        className="well-bar-fill"
                        style={{ width: `${(well.uranium_ppm / maxWellAverage) * 100}%` }}
                      />
                    </div>
                    <strong>{well.uranium_ppm.toFixed(2)} ppm</strong>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="prediction-note">
            ⚠️ <strong>Prototype Notice:</strong> Analytics are calculated from
            the synthetic/hypothetical research dataset. Risk categories use
            project-defined prototype thresholds and should not be interpreted
            as regulatory assessments.
          </div>
        </>
      )}
    </div>
  );
}
