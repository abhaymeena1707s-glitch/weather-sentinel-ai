# ESP32 Edge Quality Control & TinyML Architecture

Weather Sentinel AI incorporates a dual-tier edge-to-cloud architecture for remote Automatic Weather Stations (AWS).

```
+-------------------------------------------------------------+
|                     AWS Field Station                       |
|   Sensors (PT100 Temp, Barometer, Capacitive Humidity)     |
|                              |                              |
|                              v                              |
|         ESP32 Microcontroller (TinyML Edge Node)            |
|         - Physical Bounds Verification                      |
|         - Step-Change & Delta Filter                        |
|         - Flatline / Sensor Freeze Check                    |
|         - Edge Anomaly Score Computation                    |
+------------------------------+------------------------------+
                               |
                        MQTT / LoRaWAN
                               |
                               v
+-------------------------------------------------------------+
|                 Cloud / Edge Server (Node.js)               |
|         - Data Ingestion & Time Sync Buffering              |
|         - Spatial Neighbor Kriging                          |
|         - Station Personality Baseline                      |
|         - Isolation Forest & LSTM Temporal Inference        |
|         - Evidence Fusion Engine                            |
|         - SHAP Explainability & Counterfactual Estimates    |
+-------------------------------------------------------------+
```

### Advantages:
1. **Bandwidth Savings**: Normal readings are transmitted in compressed form; anomalous readings trigger immediate alert payloads.
2. **Offline Resilience**: When cellular/satellite connectivity drops, the ESP32 logs raw vs flagged observations to on-board flash/SD card.
3. **Fail-Fast Safety**: Instant edge alerts trigger local hardware protection or backup power switching.
