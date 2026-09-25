from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn

from models.isolation_forest import IsolationForestDetector
from models.temporal_model import TemporalAutoencoder
from models.root_cause_model import RootCauseClassifier
from services.explainability import ShapExplainer
from services.counterfactual import CounterfactualEngine

app = FastAPI(
    title="Weather Sentinel AI - Inference Microservice",
    description="Quality-Control and Anomaly Detection ML Inference API for Automatic Weather Stations (AWS)",
    version="2.4.0"
)

detector = IsolationForestDetector()
temporal_model = TemporalAutoencoder()
root_classifier = RootCauseClassifier()

class Observation(BaseModel):
    temperature: Optional[float] = None
    pressure: Optional[float] = None
    humidity: Optional[float] = None
    timestamp: Optional[str] = None

class PredictRequest(BaseModel):
    observation: Observation
    stationHistory: Optional[List[Dict[str, Any]]] = []
    neighborReadings: Optional[List[Dict[str, Any]]] = []

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "Weather Sentinel ML Inference Service",
        "models": ["IsolationForest_v2.4", "TemporalAutoencoder_v2.4", "RootCauseClassifier_v2.4", "ShapExplainer"]
    }

@app.post("/predict")
def predict(req: PredictRequest):
    obs = req.observation.model_dump()
    t = obs.get("temperature")
    p = obs.get("pressure")
    h = obs.get("humidity")

    if t is None or p is None or h is None:
        return {
            "isAnomaly": True,
            "anomalyScore": 0.88,
            "rootCause": "Missing Telemetry Data / Communication Gap",
            "confidence": 0.98,
            "recommendedAction": "Inspect station telemetry modem."
        }

    # Multivariate detection
    X = [[t, p, h]]
    scores = detector.score_samples(X)
    score = scores[0]

    # Temporal detection
    temp_eval = temporal_model.evaluate_sequence(req.stationHistory, obs)

    # Counterfactual estimation
    expected = CounterfactualEngine.generate_expected(req.stationHistory, req.neighborReadings)

    # Check spatial agreement
    neighbor_temps = [n.get("temperature") for n in req.neighborReadings if n.get("temperature") is not None]
    spatial_agreement = False
    if neighbor_temps:
        avg_neighbor = sum(neighbor_temps) / len(neighbor_temps)
        spatial_agreement = abs(t - avg_neighbor) < 4.0

    # Root Cause
    classification = root_classifier.classify({
        "observation": obs,
        "spatial_agreement": spatial_agreement,
        "is_frozen": temp_eval.get("is_frozen", False),
        "temporal_spike": temp_eval.get("is_spike", False)
    })

    # SHAP explanations
    shap_vals = ShapExplainer.calculate_contributions(obs, expected)

    is_anomaly = score > 0.65 or temp_eval.get("is_spike") or temp_eval.get("is_frozen")

    return {
        "isAnomaly": is_anomaly,
        "anomalyScore": round(score, 3),
        "rootCause": classification["root_cause"],
        "confidence": classification["confidence"],
        "recommendedAction": classification["action"],
        "expectedValues": expected,
        "temporalLoss": temp_eval.get("loss"),
        "shapContributions": shap_vals
    }

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
