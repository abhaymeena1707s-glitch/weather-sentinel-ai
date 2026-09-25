class RootCauseClassifier:
    """
    Multiclass Root-Cause Classifier for AWS Diagnostic Engine.
    """
    @staticmethod
    def classify(features):
        obs = features.get("observation", {})
        temp = obs.get("temperature")
        press = obs.get("pressure")
        hum = obs.get("humidity")
        
        neighbor_agreement = features.get("spatial_agreement", False)
        is_frozen = features.get("is_frozen", False)
        temporal_spike = features.get("temporal_spike", False)

        if temp is None or press is None or hum is None:
            return {
                "root_cause": "Communication Gap / Telemetry Drop",
                "confidence": 98.0,
                "action": "Inspect remote GPRS modem, solar battery regulator, and RF antenna link."
            }

        if is_frozen:
            return {
                "root_cause": "Frozen Sensor / Transducer Lockup",
                "confidence": 94.0,
                "action": "Power-cycle AWS logger and check analog-to-digital converter (ADC) bus."
            }

        if temp > 50.0:
            if neighbor_agreement:
                return {
                    "root_cause": "Genuine Extreme Weather (Heatwave Event)",
                    "confidence": 93.0,
                    "action": "Dispatch regional meteorological advisory; instrument is operating correctly."
                }
            else:
                return {
                    "root_cause": "Probable Temperature Sensor Fault (Spike / Electrical Glitch)",
                    "confidence": 92.0,
                    "action": "Inspect temperature sensor wiring, thermocouple probe, and shield ventilation."
                }

        if press < 960.0:
            if neighbor_agreement:
                return {
                    "root_cause": "Genuine Extreme Weather (Intense Barometric Low / Cyclone)",
                    "confidence": 91.0,
                    "action": "Issue storm alert to state disaster management authority."
                }
            else:
                return {
                    "root_cause": "Pressure Transducer Spike / Port Obstruction",
                    "confidence": 89.0,
                    "action": "Clear barometer pressure static port and test transducer calibration."
                }

        if hum > 99.0 and temp > 35.0 and not neighbor_agreement:
            return {
                "root_cause": "Humidity Sensor Degradation / Saturation Drift",
                "confidence": 87.0,
                "action": "Recalibrate capacitive polymer humidity element; check protective sintered filter."
            }

        return {
            "root_cause": "Unknown Anomaly / Uncorrelated Noise",
            "confidence": 65.0,
            "action": "Monitor station telemetry over subsequent intervals."
        }
