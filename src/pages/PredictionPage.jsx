import { useState } from "react";
import { API_URL, fetchWithTimeout, friendlyError, useApi } from "../api";
import { riskClass } from "../utils/risk";
import InputField from "../components/InputField";

// Field order must match the model's features.
const FIELDS = [
  { name: "Distance_km", label: "Distance from ISR Site (km)" },
  { name: "pH", label: "pH" },
  { name: "TDS", label: "TDS (mg/L)" },
  { name: "Conductivity", label: "Conductivity (µS/cm)" },
  { name: "Hydraulic_K", label: "Hydraulic K (m/day)" },
  { name: "Temperature_C", label: "Temperature (°C)" },
  { name: "Dissolved_Oxygen", label: "Dissolved Oxygen (mg/L)" },
  { name: "Nitrate", label: "Nitrate (mg/L)" },
  { name: "Rainfall_mm", label: "Rainfall (mm)" },
  { name: "Aquifer_Depth_m", label: "Aquifer Depth (m)" },
  { name: "Soil_Permeability", label: "Soil Permeability (m/s)" },
  { name: "Porosity", label: "Porosity" },
];

const DEFAULT_VALUES = {
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
};

export default function PredictionPage() {
  const modelInfo = useApi("/model-info");

  const [formData, setFormData] = useState(DEFAULT_VALUES);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState([]);
  const [invalidFields, setInvalidFields] = useState([]);
  const [loading, setLoading] = useState(false);

  // Training ranges from the backend (if loaded)
  const ranges = {};
  (modelInfo.data?.features || []).forEach((feature) => {
    ranges[feature.name] = feature;
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setInvalidFields(invalidFields.filter((name) => name !== e.target.name));
  };

  const validate = () => {
    const problems = [];
    const badFields = [];

    FIELDS.forEach(({ name, label }) => {
      const raw = formData[name];
      const value = Number(raw);
      const range = ranges[name];

      if (raw === "" || Number.isNaN(value)) {
        problems.push(`${label} is required.`);
        badFields.push(name);
      } else if (range && (value < range.min || value > range.max)) {
        problems.push(
          `${label} must be between ${range.min} and ${range.max}.`
        );
        badFields.push(name);
      }
    });

    setInvalidFields(badFields);
    return problems;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);

    const problems = validate();
    if (problems.length > 0) {
      setErrors(problems);
      return;
    }

    setErrors([]);
    setLoading(true);

    const requestData = {};
    FIELDS.forEach(({ name }) => {
      requestData[name] = Number(formData[name]);
    });

    try {
      const response = await fetchWithTimeout(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        // 422 = input rejected by the backend's range check
        const detail = Array.isArray(body.detail)
          ? body.detail.map((item) => (typeof item === "string" ? item : item.msg))
          : [body.detail || `Prediction failed (${response.status}).`];
        setErrors(detail);
        return;
      }

      setResult({
        uranium: body.predicted_uranium_ppm,
        risk: body.risk,
      });
    } catch (error) {
      setErrors([
        `${friendlyError(error)} It may be waking up — please try again in about 30 seconds.`,
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prediction-page">
      {/* INTRO */}
      <div className="page-intro">
        <div>
          <span className="section-label">MACHINE LEARNING</span>
          <h2>Uranium Concentration Prediction</h2>
          <p>
            Enter groundwater and hydrogeological parameters to estimate uranium
            concentration using the trained Gradient Boosting Regression model.
          </p>
        </div>
        <div className="model-badge">🤖 Gradient Boosting</div>
      </div>

      <div className="prediction-layout">
        {/* INPUT CARD */}
        <div className="prediction-card">
          <h3>📋 Monitoring Parameters</h3>
          <p className="card-description">
            Enter values within the ranges the model was trained on.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="input-grid">
              {FIELDS.map(({ name, label }) => (
                <InputField
                  key={name}
                  label={label}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  min={ranges[name]?.min}
                  max={ranges[name]?.max}
                  invalid={invalidFields.includes(name)}
                />
              ))}
            </div>

            {errors.length > 0 && (
              <div className="form-errors" role="alert">
                <strong>⚠️ Please check the inputs</strong>
                <ul>
                  {errors.map((message) => (
                    <li key={message}>{message}</li>
                  ))}
                </ul>
              </div>
            )}

            <button type="submit" className="predict-button" disabled={loading}>
              {loading ? "⏳ Predicting..." : "🔮 Predict Uranium Concentration"}
            </button>
          </form>
        </div>

        {/* RESULT CARD */}
        <div className="result-card">
          <div className="result-header">
            <span>MODEL OUTPUT</span>
            <div className="prediction-status">Prototype</div>
          </div>

          <h3>Predicted Uranium</h3>

          <div className="prediction-value">
            {result ? result.uranium.toFixed(3) : "—"}
          </div>

          <p className="prediction-unit">ppm</p>

          <div className="result-placeholder">
            {result
              ? "Prediction generated successfully."
              : "Enter the monitoring parameters and run the prediction."}
          </div>

          <div
            className={
              result ? `risk-placeholder ${riskClass(result.risk)}` : "risk-placeholder"
            }
          >
            {result ? `⚠️ ${result.risk}` : "Risk classification will appear here."}
          </div>
        </div>
      </div>

      <div className="prediction-note">
        ⚠️ <strong>Prototype Notice:</strong> This prediction is generated by the
        trained Gradient Boosting model through FastAPI. The current dataset and
        model are synthetic/hypothetical and have not been field validated.
      </div>
    </div>
  );
}
