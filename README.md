# ☁️ Weather Sentinel AI

> **"Trustworthy Weather Data. Safer Decisions."**  
> *Adaptive, Explainable & Self-Healing Quality-Control Platform for Automatic Weather Stations (AWS)*  
> **Problem Statement (SIH 26073)**

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite%20%2B%20Tailwind-blue.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/ML%20Microservice-FastAPI%20%2B%20Scikit--Learn-009688.svg)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📌 Executive Summary

Automatic Weather Stations (AWS) continuously observe:
- **Temperature (°C)**
- **Atmospheric Pressure (hPa)**
- **Relative Humidity (%)**

However, raw telemetry is frequently disrupted by sensor malfunctions, electrical spikes, frozen ADC transducers, calibration drift, communication dropouts, and physical debris. 

**Weather Sentinel AI** is an operational meteorological quality-control platform that distinguishes between **genuine meteorological extremes** (e.g. severe heatwaves, cyclone pressure depressions) and **instrumentation faults** (sensor spikes, drift, flatlines). It operates under a seven-stage self-healing lifecycle:

$$\text{DETECT} \longrightarrow \text{VERIFY} \longrightarrow \text{EXPLAIN} \longrightarrow \text{CORRECT} \longrightarrow \text{QUARANTINE} \longrightarrow \text{PREDICT} \longrightarrow \text{MAINTAIN}$$

---

## 🏛️ System Architecture

```
                                  AWS SENSORS
                       (Temperature, Pressure, Humidity)
                                      │
                                      ▼
                             DATA INGESTION LAYER
                  (Validation & Cleaning, Time Sync & Buffering)
                                      │
                                      ▼
                             FEATURE ENGINEERING
             (Temporal, Statistical, Spatial & Thermodynamic Metrics)
                                      │
                                      ▼
                        AI ANOMALY DETECTION ENGINE
            ┌─────────────────────────┼─────────────────────────┐
            ▼                         ▼                         ▼
      Physical QC               Temporal QC             Multivariate QC
 (WMO Physical Bounds)      (Z-Score / Flatline)       (Isolation Forest)
            └─────────────────────────┬─────────────────────────┘
                                      ▼
                               EVIDENCE FUSION
             ┌────────────────────────┼────────────────────────┐
             ▼                        ▼                        ▼
       Time Pattern              Spatial Check            Sensor Twin
    (Step-change rate)        (Neighbor Consensus)     (Degradation Drift)
             └────────────────────────┬────────────────────────┘
                                      ▼
                          CLASSIFICATION & FORENSICS
          ├── Genuine Extreme Weather vs Probable Sensor Fault
          ├── Root-Cause Classification (14 distinct failure modes)
          ├── SHAP Explainability (Feature Attribution %)
          └── Counterfactual Normal Estimation (Imputed Value)
                                      │
             ┌────────────────────────┼────────────────────────┐
             ▼                        ▼                        ▼
     Sensor Digital Twin      Data Quarantine &        Command Dashboard
    (Health & Degradation)    Weather Trust Score      (Web + Native Mobile)
```

---

## 🌟 Key Differentiating Features

### 1. Adaptive Station Personality
Every AWS station maintains its own learned diurnal baseline for morning, afternoon, and night rather than relying on blunt static thresholds:
- **Morning Baseline**: e.g., $24^\circ\text{C} - 29^\circ\text{C}$, $65\% - 85\%$ Humidity
- **Afternoon Baseline**: e.g., $31^\circ\text{C} - 37^\circ\text{C}$, $45\% - 65\%$ Humidity
- **Night Baseline**: e.g., $22^\circ\text{C} - 26^\circ\text{C}$, $70\% - 90\%$ Humidity
- **Learned Volatility**: Typical thermal noise ($<\pm0.25^\circ\text{C}$), max rate of change ($<1.8^\circ\text{C}/\text{hr}$).

### 2. Genuine Extreme Weather Verification (Evidence Fusion)
If a station reports an extreme $55.0^\circ\text{C}$:
- **If neighboring stations report $53^\circ\text{C} - 56^\circ\text{C}$**: Classified as **GENUINE EXTREME WEATHER** (Heatwave). No false alarm or quarantine.
- **If neighboring stations report $30^\circ\text{C} - 33^\circ\text{C}$**: Classified as **PROBABLE SENSOR FAULT** (Spike / Electrical Glitch). Automatically quarantined.

### 3. Sensor Digital Twin
Maintains a virtual real-time health profile for each transducer:
- **Temperature Sensor**: Health $82/100$, Drift $+0.18^\circ\text{C}/\text{week}$, Noise LOW, Risk LOW
- **Humidity Sensor**: Health $61/100$, Drift HIGH ($+1.8\%/\text{month}$), Risk MEDIUM
- **Pressure Transducer**: Health $96/100$, Drift STABLE, Risk LOW

### 4. Counterfactual AI & SHAP Explainability
For every detected anomaly, the platform computes what the reading **should have been**:
- **Observed**: $55.0^\circ\text{C}$ | **Expected Normal**: $31.8^\circ\text{C}$ | Departure: $+23.2^\circ\text{C}$
- **SHAP Feature Attribution**: Temperature: **87%**, Pressure: **21%**, Humidity: **11%**

### 5. Composite Weather Trust Score
Calculated on a $0 - 100$ scale:
$$\text{Trust Score} = 0.25(\text{Phys}) + 0.20(\text{Temp}) + 0.15(\text{Multi}) + 0.15(\text{Spat}) + 0.15(\text{Health}) + 0.10(\text{Fresh})$$

### 6. Zero-Data-Loss Quarantine Pipeline
Suspicious data is never deleted. It transitions through:
$$\text{RAW} \longrightarrow \text{SUSPICIOUS} \longrightarrow \text{QUARANTINED} \longrightarrow \text{VERIFIED} \longrightarrow \text{CORRECTED / ACCEPTED / REJECTED}$$

### 7. Interactive Anomaly Simulator
Directly test 8 distinct synthetic failure vectors from the UI:
- `Temperature Spike`
- `Pressure Drop / Surge`
- `Humidity Saturation Spike`
- `Frozen Sensor / Flatline`
- `Calibration Drift`
- `Communication Telemetry Gap`
- `Data Corruption`
- `Genuine Extreme Weather Event`

---

## 🔑 Demo Evaluator Credentials

The platform includes built-in one-click demo login buttons for every operational role:

| Role | Email | Password | Access Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@weathersentinel.ai` | `Admin@123` | Full access, settings & user management |
| **Duty Operator** | `operator@weathersentinel.ai` | `Operator@123` | 24/7 monitoring, triage & simulator |
| **Field Engineer** | `engineer@weathersentinel.ai` | `Engineer@123` | Predictive maintenance & verification |
| **Forecaster / Viewer** | `viewer@weathersentinel.ai` | `Viewer@123` | Read-only synoptic surveillance |

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js $\ge 18.0.0$
- npm $\ge 9.0.0$
- *(Optional)* Python 3.10+ (if testing external ML service)
- *(Optional)* Docker & Docker Compose

### 1. Install & Run in Single Command (Development)

From the project root:

```bash
# Install dependencies
npm run install:all # or npm install in server and client

# Start both backend and frontend concurrently
npm run dev
```

- **Frontend Dashboard**: [http://localhost:5173](http://localhost:5173)
- **Backend REST API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Health Check**: [http://localhost:5000/health](http://localhost:5000/health)

> **Zero DB Failure Guarantee**: If MongoDB is not running locally, the backend automatically activates an embedded in-memory datastore and seeds all 25 AWS stations, demo alerts, and maintenance tickets immediately.

### 2. Run Test Suites

```bash
npm test
```
Executes all 9 quality-control unit tests and 6 API integration tests.

### 3. Docker Deployment

```bash
docker-compose up --build
```
Spins up MongoDB, Node.js Backend, React/Nginx Frontend, and Python FastAPI ML service.

---

## 🎯 Primary Hackathon Demonstration Flow (AWS-042)

1. **Sign In**: Navigate to [http://localhost:5173/login](http://localhost:5173/login) and click **Duty Operator** to sign in.
2. **Review Command Center**:
   - Total Stations: **25** (22 Normal, 2 Anomalies, 1 Quarantined).
   - Live Leaflet map with interactive status pins across Karnataka.
   - Primary station card for **AWS-042** showing anomalous $55.0^\circ\text{C}$ spike.
3. **Forensic Drilldown**:
   - Click **Deep Forensic Analysis** on AWS-042.
   - Inspect the **Counterfactual AI** card ($55.0^\circ\text{C}$ observed vs $31.8^\circ\text{C}$ expected).
   - Inspect **SHAP contributions** (Temperature 87%, Pressure 21%, Humidity 11%).
   - Click **Apply Corrected Estimate** to verify non-destructive data imputation.
4. **Live Anomaly Simulator**:
   - Navigate to the **Simulator** tab.
   - Select any scenario (e.g. `Temperature Spike` or `Genuine Extreme Weather`).
   - Click **Inject & Stream Telemetry**.
   - Notice the instant WebSocket alert notification, live chart update, and quarantine trigger.
5. **Mobile View Toggle**:
   - Click **Mobile UI View** in the sidebar to toggle the native Android/iOS mobile application simulation with bottom navigation.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user and receive JWT token |
| `GET` | `/api/stations` | List all 25 AWS stations with health and trust scores |
| `GET` | `/api/stations/:id` | Full station details, telemetry history and sensors |
| `POST` | `/api/observations` | Ingest AWS reading through quality-control engine |
| `GET` | `/api/explain/:readingId` | Retrieve counterfactual estimates and SHAP values |
| `GET` | `/api/alerts` | Active meteorological and instrumentation alerts |
| `PATCH`| `/api/alerts/:id` | Acknowledge, investigate, or resolve alerts |
| `GET` | `/api/quarantine` | Quarantined observations awaiting review |
| `PATCH`| `/api/quarantine/:id` | Action: `VERIFY`, `REJECT`, `APPLY_CORRECTION` |
| `POST` | `/api/simulator/inject` | Inject synthetic failure vectors for demo |
| `GET` | `/api/model-performance`| Benchmark evaluation metrics and confusion matrix |

---

## 📟 TinyML & Edge Architecture (ESP32)

Located in `edge/esp32/`:
- `weather_sentinel_esp32.ino`: C++/Arduino TinyML firmware for ESP32 AWS edge nodes.
- Prescreens telemetry with on-device physical sanity checks and step-change delta filtering before MQTT transmission.

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
