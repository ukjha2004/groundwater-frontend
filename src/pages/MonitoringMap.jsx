import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { useApi } from "../api";
import { ISR_SITE, formatDate, riskColor } from "../utils/risk";
import LoadState from "../components/LoadState";

export default function MonitoringMap() {
  const { data, loading, error, retry } = useApi("/latest-wells");
  const wells = data?.wells || [];

  return (
    <div className="dashboard">
      {/* HEADER */}
      <section className="welcome-card">
        <div>
          <span className="section-label">MONITORING WELLS</span>
          <h2>Groundwater Monitoring Map</h2>
          <p>
            Interactive visualization of monitoring wells around the
            hypothetical ISR site.
          </p>
        </div>
        <div className="ml-badge">🗺️ {wells.length || "…"} Wells</div>
      </section>

      {/* MAP */}
      <section className="prediction-card">
        <div className="section-title">
          <div>
            <h2>Monitoring Network</h2>
            <p className="card-description">
              Latest available observation for each monitoring well.
            </p>
          </div>

          <div className="map-legend">
            {["Low Risk", "Moderate Risk", "High Risk"].map((risk) => (
              <span key={risk}>
                <i style={{ background: riskColor(risk) }}></i>
                {risk}
              </span>
            ))}
            <span>
              <i style={{ background: "#111827" }}></i>
              ISR Site
            </span>
          </div>
        </div>

        <LoadState
          loading={loading}
          error={error}
          onRetry={retry}
          label="monitoring wells"
        />

        {!loading && !error && (
          <div className="real-map">
            <MapContainer
              center={[ISR_SITE.lat, ISR_SITE.lon]}
              zoom={10}
              scrollWheelZoom={true}
              style={{ height: "600px", width: "100%" }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Hypothetical ISR site */}
              <CircleMarker
                center={[ISR_SITE.lat, ISR_SITE.lon]}
                radius={12}
                pathOptions={{
                  color: "#111827",
                  fillColor: "#111827",
                  fillOpacity: 0.9,
                  weight: 3,
                }}
              >
                <Popup>
                  <div className="map-popup">
                    <h3>Hypothetical ISR Site</h3>
                    <small>Reference point for all well distances.</small>
                  </div>
                </Popup>
              </CircleMarker>

              {wells.map((well) => (
                <CircleMarker
                  key={well.id}
                  center={[well.lat, well.lon]}
                  radius={9}
                  pathOptions={{
                    color: riskColor(well.risk),
                    fillColor: riskColor(well.risk),
                    fillOpacity: 0.8,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div className="map-popup">
                      <h3>{well.id}</h3>
                      <p>
                        <strong>Distance:</strong> {well.distance_km.toFixed(2)} km
                      </p>
                      <p>
                        <strong>Uranium:</strong> {well.uranium_ppm.toFixed(2)} ppm
                      </p>
                      <p>
                        <strong>Risk:</strong>{" "}
                        <span style={{ color: riskColor(well.risk), fontWeight: 600 }}>
                          {well.risk}
                        </span>
                      </p>
                      <p>
                        <strong>Date:</strong> {formatDate(well.date)}
                      </p>
                      <small>
                        Latest observation from the synthetic/hypothetical
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

      {/* TABLE */}
      {!loading && !error && (
        <section className="map-table-card">
          <div className="section-title">
            <h2>Monitoring Wells</h2>
            <span>{wells.length} wells</span>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Well ID</th>
                  <th>Date</th>
                  <th>Distance</th>
                  <th>Uranium</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {wells.map((well) => (
                  <tr key={well.id}>
                    <td>
                      <strong>{well.id}</strong>
                    </td>
                    <td>{formatDate(well.date)}</td>
                    <td>{well.distance_km.toFixed(2)} km</td>
                    <td>{well.uranium_ppm.toFixed(2)} ppm</td>
                    <td>
                      <span className="risk-badge" style={{ color: riskColor(well.risk) }}>
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

      <div className="prediction-note">
        ⚠️ <strong>Prototype Notice:</strong> The displayed monitoring locations,
        ISR site and uranium values are synthetic/hypothetical. Risk categories
        use project-defined prototype thresholds and are not regulatory
        assessments.
      </div>
    </div>
  );
}
