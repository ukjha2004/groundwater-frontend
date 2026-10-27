export default function AboutProjectPage() {
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
              Predict groundwater quality degradation in down-gradient
              regions of a hypothetical uranium in-situ recovery (ISR) site.
            </li>

            <li>
              Assess potential aquifer vulnerability down-gradient of the
              ISR operation.
            </li>

            <li>
              Identify data gaps that limit the mitigation of these
              vulnerabilities.
            </li>

            <li>
              Support hydrogeological characterization of the study area.
            </li>

            <li>
              Support the development of groundwater monitoring programs.
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
              Leave-one-well-out cross-validation is used to
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
