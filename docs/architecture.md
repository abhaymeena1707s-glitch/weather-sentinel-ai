# Weather Sentinel AI — System Architecture

**Tagline**: *Trustworthy Weather Data. Safer Decisions.*  
**Problem Statement**: SIH 26073 — Intelligent Anomaly Detection and Quality Control for Automatic Weather Stations (AWS).

---

## 1. High-Level Pipeline

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
(Temporal Features, Statistical Features, Spatial Features, T-P-H Thermodynamic Relationships)
             │
             ▼
  AI ANOMALY DETECTION ENGINE
(LSTM Temporal + Isolation Forest Multivariate + Rules Engine Physical Checks)
             │
             ▼
       EVIDENCE FUSION
(Time Pattern + Spatial Check + Sensor Twin + Counterfactual AI)
             │
             ▼
  CLASSIFICATION & INSIGHTS
(Genuine Event vs Sensor Fault + Root Cause + Confidence & Severity + Corrected Value)
             │
  ┌──────────┼──────────┬──────────────┐
  ▼          ▼          ▼              ▼
SENSOR    WEATHER    COMMAND        EDGE
DIGITAL    TRUST     DASHBOARD    DEPLOYMENT
 TWIN      SCORE     & MOBILE      (ESP32)
```

---

## 2. Seven-Stage Philosophy
**DETECT → VERIFY → EXPLAIN → CORRECT → QUARANTINE → PREDICT → MAINTAIN**

1. **DETECT**: Real-time screening with physical bounds, rolling statistics, rate-of-change, and Isolation Forest.
2. **VERIFY**: Spatial consensus matching with neighboring AWS stations prevents misclassifying genuine extreme weather (e.g. 55°C heatwave) as a sensor defect.
3. **EXPLAIN**: SHAP-style attribution breaks down feature contributions (e.g., Temperature 87%, Pressure 21%, Humidity 11%).
4. **CORRECT**: Counterfactual AI calculates estimated normal observation without overwriting raw data.
5. **QUARANTINE**: Isolates contaminated data while preserving complete audit logs.
6. **PREDICT**: Virtual sensor digital twin tracks drift and degradation.
7. **MAINTAIN**: Predictive maintenance schedules proactive field inspections before sensor breakdown.
