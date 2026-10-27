/* Display helpers for the prototype risk categories.
   The thresholds themselves live in the backend (/model-info). */

const RISK_COLORS = {
  "High Risk": "#d64545",
  "Moderate Risk": "#e08a00",
  "Low Risk": "#2f9e5b",
};

const RISK_ICONS = {
  "High Risk": "🔴",
  "Moderate Risk": "🟠",
  "Low Risk": "🟢",
};

export const ISR_SITE = { lat: 23.68, lon: 86.15 };

export function riskColor(risk) {
  return RISK_COLORS[risk] || "#64748b";
}

export function riskIcon(risk) {
  return RISK_ICONS[risk] || "⚪";
}

export function riskClass(risk) {
  return (risk || "").toLowerCase().replace(" ", "-");
}

export function formatDate(isoDate) {
  if (!isoDate) return "—";
  const date = new Date(isoDate);
  return Number.isNaN(date.getTime()) ? isoDate.slice(0, 10) : date.toLocaleDateString();
}
