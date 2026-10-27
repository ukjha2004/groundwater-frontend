import { useApi } from "../api";
import { formatDate, riskClass, riskIcon } from "../utils/risk";
import LoadState from "../components/LoadState";

const ACTION_TEXT = {
  "High Risk": "Attention Required",
  "Moderate Risk": "Continue Monitoring",
  "Low Risk": "Prototype Normal",
};

export default function AlertCenterPage() {
  const { data, loading, error, retry } = useApi("/latest-wells");
  const modelInfo = useApi("/model-info");

  const wells = data?.wells || [];
  const thresholds = modelInfo.data?.risk_thresholds;

  const count = (risk) => wells.filter((well) => well.risk === risk).length;
  const highRisk = count("High Risk");
  const moderateRisk = count("Moderate Risk");
  const lowRisk = count("Low Risk");

  return (
    <div className="dashboard">
      <section className="welcome-card">
        <div>
          <span className="section-label">ALERT MANAGEMENT</span>
          <h2>Groundwater Alert Center</h2>
          <p>
            Monitor prototype risk classifications and identify monitoring wells
            that may require additional attention.
          </p>
        </div>
        <div className="ml-badge">🚨 Alert System</div>
      </section>

      <LoadState loading={loading} error={error} onRetry={retry} label="alerts" />

      {!loading && !error && (
        <>
          {/* STATISTICS */}
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🚨</div>
              <div>
                <span>Total Alerts</span>
                <strong>{highRisk + moderateRisk}</strong>
                <small>Monitoring locations</small>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔴</div>
              <div>
                <span>High Risk</span>
                <strong>{highRisk}</strong>
                <small>Attention required</small>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🟠</div>
              <div>
                <span>Moderate Risk</span>
                <strong>{moderateRisk}</strong>
                <small>Continue monitoring</small>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🟢</div>
              <div>
                <span>Low Risk</span>
                <strong>{lowRisk}</strong>
                <small>Prototype normal</small>
              </div>
            </div>
          </section>

          {/* ALERT LIST */}
          <section className="alert-section">
            <div className="section-title">
              <div>
                <h2>Monitoring Alerts</h2>
                <p className="card-description">
                  Latest prototype risk classification for each monitoring well.
                </p>
              </div>
              <span>{wells.length} locations</span>
            </div>

            <div className="alert-list">
              {wells.map((well) => (
                <div className={`alert-card ${riskClass(well.risk)}`} key={well.id}>
                  <div className="alert-icon">{riskIcon(well.risk)}</div>
                  <div className="alert-content">
                    <div className="alert-header">
                      <h3>{well.id}</h3>
                      <span className={`alert-risk ${riskClass(well.risk)}`}>
                        {well.risk}
                      </span>
                    </div>
                    <p>
                      <strong>Observed uranium concentration:</strong>{" "}
                      {well.uranium_ppm.toFixed(2)} ppm
                    </p>
                    <p>
                      <strong>Distance from study site:</strong>{" "}
                      {well.distance_km.toFixed(2)} km
                    </p>
                    <p>
                      <strong>Latest observation:</strong> {formatDate(well.date)}
                    </p>
                    <div className="alert-action">
                      {riskIcon(well.risk)} {ACTION_TEXT[well.risk]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RISK LOGIC (thresholds come from the backend) */}
          {thresholds && (
            <section className="risk-logic-card">
              <div className="section-title">
                <div>
                  <span className="section-label">RISK CLASSIFICATION</span>
                  <h2>Prototype Alert Logic</h2>
                </div>
              </div>
              <div className="risk-logic-grid">
                <div>
                  <span>🔴</span>
                  <h3>High Risk</h3>
                  <p>Uranium ≥ {thresholds.high_ppm} ppm</p>
                </div>
                <div>
                  <span>🟠</span>
                  <h3>Moderate Risk</h3>
                  <p>
                    Uranium ≥ {thresholds.moderate_ppm} ppm and &lt;{" "}
                    {thresholds.high_ppm} ppm
                  </p>
                </div>
                <div>
                  <span>🟢</span>
                  <h3>Low Risk</h3>
                  <p>Uranium &lt; {thresholds.moderate_ppm} ppm</p>
                </div>
              </div>
            </section>
          )}

          <div className="prediction-note">
            ⚠️ <strong>Prototype Notice:</strong> These thresholds are
            project-defined prototype classifications and are not regulatory
            limits. The displayed well data are synthetic/hypothetical.
          </div>
        </>
      )}
    </div>
  );
}
