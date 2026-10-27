import { useApi } from "../api";
import LoadState from "../components/LoadState";

const PIPELINE = [
  ["Monitoring Data", "Environmental and hydrogeological parameters"],
  ["Preprocessing", "Cleaning and feature preparation"],
  ["Gradient Boosting", "Trained regression model"],
  ["Prediction", "Estimated uranium concentration"],
  ["Risk Classification", "Prototype monitoring category"],
];

export default function ModelInsightsPage() {
  const { data, loading, error, retry } = useApi("/model-info");

  return (
    <div className="dashboard">
      <section className="welcome-card">
        <div>
          <span className="section-label">MODEL EXPLAINABILITY</span>
          <h2>ML Model Insights</h2>
          <p>
            Understand the machine learning model, input features, validation
            strategy, and factors associated with uranium concentration
            prediction.
          </p>
        </div>
        <div className="ml-badge">🧠 Explainable ML</div>
      </section>

      <LoadState loading={loading} error={error} onRetry={retry} label="model information" />

      {!loading && !error && data && (
        <ModelDetails info={data} />
      )}

      <div className="prediction-note">
        ⚠️ <strong>Prototype Notice:</strong> This system is a research and
        demonstration prototype and is not a regulatory or field-validated
        environmental monitoring system.
      </div>
    </div>
  );
}

function ModelDetails({ info }) {
  const { metrics, config, feature_importance: importance, dataset } = info;

  return (
    <>
      {/* MODEL STATISTICS */}
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
            <strong>{config.n_estimators}</strong>
            <small>Boosting stages</small>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div>
            <span>Input Features</span>
            <strong>{dataset.features}</strong>
            <small>Environmental parameters</small>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div>
            <span>Validation</span>
            <strong>{metrics.n_folds}-Fold</strong>
            <small>Leave-one-well-out CV</small>
          </div>
        </div>
      </section>

      {/* VALIDATION METRICS (computed by the backend, not typed in) */}
      <section className="analytics-card">
        <div className="section-title">
          <div>
            <span className="section-label">MODEL PERFORMANCE</span>
            <h2>Leave-One-Well-Out Validation</h2>
            <p className="card-description">
              Each of the {metrics.n_folds} wells is predicted by a model trained
              only on the other wells. Metrics are calculated over all held-out
              predictions.
            </p>
          </div>
        </div>

        <div className="model-metrics-grid">
          <div className="model-metric">
            <span>MAE</span>
            <strong>{metrics.mae.toFixed(3)}</strong>
            <small>ppm</small>
          </div>
          <div className="model-metric">
            <span>RMSE</span>
            <strong>{metrics.rmse.toFixed(3)}</strong>
            <small>ppm</small>
          </div>
          <div className="model-metric">
            <span>R²</span>
            <strong>{metrics.r2.toFixed(3)}</strong>
            <small>coefficient of determination</small>
          </div>
        </div>

        <p className="card-description metrics-spread">
          Error varies between wells: MAE ranges from{" "}
          <strong>{metrics.mae_well_min.toFixed(2)}</strong> to{" "}
          <strong>{metrics.mae_well_max.toFixed(2)} ppm</strong> (hardest
          well: {metrics.worst_well}).
        </p>
      </section>

      {/* PIPELINE */}
      <section className="analytics-card">
        <div className="section-title">
          <div>
            <span className="section-label">MACHINE LEARNING PIPELINE</span>
            <h2>From Monitoring Data to Prediction</h2>
          </div>
        </div>

        <div className="pipeline-grid">
          {PIPELINE.map(([title, text], index) => (
            <PipelineStep key={title} number={index + 1} title={title} text={text} last={index === PIPELINE.length - 1} />
          ))}
        </div>
      </section>

      {/* FEATURE IMPORTANCE */}
      <section className="analytics-card">
        <div className="section-title">
          <div>
            <span className="section-label">FEATURE IMPORTANCE</span>
            <h2>Model Feature Importance</h2>
            <p className="card-description">
              Relative contribution of input features to the trained Gradient
              Boosting model (read directly from the model).
            </p>
          </div>
        </div>

        <div className="feature-importance-list">
          {importance.map((item) => (
            <div className="feature-row" key={item.feature}>
              <div className="feature-name">{item.label}</div>
              <div className="feature-bar">
                <div
                  className="feature-bar-fill"
                  style={{ width: `${Math.max(item.importance_pct, 1)}%` }}
                />
              </div>
              <strong>{item.importance_pct.toFixed(2)}%</strong>
            </div>
          ))}
        </div>

        <div className="interpretation-note">
          <strong>⚠️ Interpretation:</strong>
          <p>
            Feature importance indicates how useful a feature was to the trained
            model's predictions. It does not establish that the feature causes
            changes in uranium concentration.
          </p>
        </div>
      </section>

      {/* CONFIGURATION + DATASET */}
      <section className="analytics-grid">
        <div className="analytics-card">
          <span className="section-label">MODEL CONFIGURATION</span>
          <h2>Gradient Boosting Regressor</h2>
          <div className="config-list">
            <div>
              <span>Estimators</span>
              <strong>{config.n_estimators}</strong>
            </div>
            <div>
              <span>Learning Rate</span>
              <strong>{config.learning_rate}</strong>
            </div>
            <div>
              <span>Maximum Tree Depth</span>
              <strong>{config.max_depth}</strong>
            </div>
            <div>
              <span>Random State</span>
              <strong>{config.random_state}</strong>
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <span className="section-label">TRAINING DATASET</span>
          <h2>Research Dataset</h2>
          <p className="card-description">The current research dataset contains:</p>
          <div className="dataset-highlights">
            <div>
              <strong>{dataset.observations.toLocaleString()}</strong>
              <span>Observations</span>
            </div>
            <div>
              <strong>{dataset.wells}</strong>
              <span>Hypothetical Wells</span>
            </div>
            <div>
              <strong>{dataset.features}</strong>
              <span>Input Features</span>
            </div>
          </div>
        </div>
      </section>

      {/* VALIDATION STRATEGY */}
      <section className="analytics-card">
        <span className="section-label">VALIDATION STRATEGY</span>
        <h2>Leave-One-Well-Out Cross Validation</h2>
        <p className="card-description">
          All observations from a well are held out together, so the model is
          always tested on a well it has never seen. Because every well is
          held out exactly once, the result does not depend on how wells are
          randomly grouped into folds. (With 5-fold grouping, R² varied from
          about 0.90 to 0.95 depending on which wells were grouped together.)
        </p>
      </section>

      {/* LIMITATIONS */}
      <section className="analytics-card limitation-card">
        <span className="section-label">RESEARCH LIMITATIONS</span>
        <h2>Important Considerations</h2>
        <ul>
          <li>
            The current model was developed using a synthetic/hypothetical
            groundwater dataset.
          </li>
          <li>
            Reported performance should not be interpreted as evidence of field
            performance.
          </li>
          <li>
            Feature importance describes model behavior and should not be
            interpreted as causal relationships.
          </li>
          <li>
            Additional real-world monitoring data, independent validation,
            sensor integration, and field testing would be required before
            operational use.
          </li>
        </ul>
      </section>
    </>
  );
}

function PipelineStep({ number, title, text, last }) {
  return (
    <>
      <div className="pipeline-step">
        <span>{number}</span>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      {!last && <div className="pipeline-arrow">→</div>}
    </>
  );
}
