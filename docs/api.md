# Weather Sentinel AI — API Reference

Base URL: `http://localhost:5000/api`

### 1. Authentication
- `POST /auth/login`: Authenticate operator, engineer, admin, or viewer.
- `GET /auth/me`: Get current authenticated user profile.

### 2. Weather Stations
- `GET /stations`: List all 25 AWS stations with real-time status and telemetry.
- `POST /stations`: Register a newly commissioned weather station.
- `GET /stations/:id`: Complete station details, telemetry history, and sensor twins.
- `GET /station-personality/:stationId`: Retrieve learned diurnal baselines (Morning, Afternoon, Night).
- `GET /trust-score/:stationId`: Retrieve composite Weather Trust Score breakdown.

### 3. Sensor Readings & Ingestion
- `GET /readings`: Historical observations queryable by station, time, and limit.
- `POST /readings` / `POST /observations`: Ingest AWS observation through full quality-control pipeline.
- `GET /readings/:stationId`: Telemetry stream for a specific station.
- `GET /explain/:readingId`: Retrieve counterfactual values, SHAP attribution, and evidence.

### 4. Anomalies & Quality Control
- `GET /anomalies`: Filter active and historical anomalies.
- `GET /anomalies/:id`: Anomaly forensic details with surrounding timeline.
- `PATCH /anomalies/:id`: Update investigation status.

### 5. Alerts
- `GET /alerts`: Active meteorological and instrumentation alerts.
- `GET /alerts/:id`: Alert detail.
- `PATCH /alerts/:id`: Acknowledge or resolve alert.

### 6. Sensor Digital Twins & Predictive Maintenance
- `GET /sensor-health`: Virtual sensor health indices across all AWS.
- `GET /sensor-health/:stationId`: Sensor twin health, drift rate, noise, and failure risk.
- `GET /maintenance`: Predictive maintenance work orders.
- `PATCH /maintenance/:id`: Update ticket status or assign engineer.

### 7. Data Quarantine
- `GET /quarantine`: Quarantined observations awaiting verification.
- `PATCH /quarantine/:id`: Action: `VERIFY`, `REJECT`, `ACCEPT_RAW`, `APPLY_CORRECTION`, `RESTORE`.

### 8. Anomaly Simulator (Interactive Testing)
- `POST /simulator/inject`: Inject synthetic faults (`TEMPERATURE_SPIKE`, `PRESSURE_SPIKE`, `HUMIDITY_SPIKE`, `FROZEN_VALUE`, `CALIBRATION_DRIFT`, `COMMUNICATION_GAP`, `GENUINE_EXTREME_WEATHER`).

### 9. Model Performance
- `GET /model-performance`: Injected-anomaly evaluation metrics, confusion matrix, precision/recall.
