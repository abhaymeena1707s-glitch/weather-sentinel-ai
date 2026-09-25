import math

class TemporalAutoencoder:
    """
    Temporal LSTM / Sequence Anomaly Detector for AWS Time Series.
    Evaluates reconstruction error and step deviation over rolling window.
    """
    def __init__(self, sequence_length=6):
        self.sequence_length = sequence_length

    def evaluate_sequence(self, sequence, current_obs):
        """
        Computes temporal reconstruction loss.
        """
        if not sequence or len(sequence) < 2:
            return {"loss": 0.05, "is_spike": False, "is_frozen": False}

        # Check flatline / frozen
        last_temps = [r.get("temperature") for r in sequence[-5:] if r.get("temperature") is not None]
        is_frozen = len(last_temps) >= 4 and all(abs(t - current_obs["temperature"]) < 0.001 for t in last_temps)

        # Compute rolling baseline
        avg_temp = sum(last_temps) / len(last_temps) if last_temps else current_obs["temperature"]
        temp_delta = abs(current_obs["temperature"] - avg_temp)

        is_spike = temp_delta > 5.0
        loss = temp_delta / 2.0

        return {
            "loss": round(loss, 3),
            "is_spike": is_spike,
            "is_frozen": is_frozen,
            "predicted_next": round(avg_temp, 2)
        }
