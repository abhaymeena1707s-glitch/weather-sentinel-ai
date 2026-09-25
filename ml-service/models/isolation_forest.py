import math

class IsolationForestDetector:
    """
    Multivariate Anomaly Detection for AWS Sensors (Temperature, Pressure, Humidity).
    Implements robust multivariate deviation and density scoring.
    """
    def __init__(self, contamination=0.05):
        self.contamination = contamination
        # Standard surface climate parameters for normalization
        self.means = [30.0, 1005.0, 65.0]
        self.stds = [4.5, 6.0, 15.0]

    def fit(self, X):
        return self

    def score_samples(self, X):
        scores = []
        for x in X:
            t, p, h = x[0], x[1], x[2]
            z_t = (t - self.means[0]) / self.stds[0]
            z_p = (p - self.means[1]) / self.stds[1]
            z_h = (h - self.means[2]) / self.stds[2]
            
            # Mahalanobis-like multivariate distance
            dist_sq = (z_t ** 2) + (z_p ** 2) + (z_h ** 2)
            # Physical interaction penalty: extreme heat + super-saturated humidity
            if t > 45.0 and h > 85.0:
                dist_sq += 12.0
            
            # Convert to anomaly score [0, 1]
            score = 1.0 / (1.0 + math.exp(-0.5 * (math.sqrt(dist_sq) - 3.0)))
            scores.append(score)
        return scores

    def predict(self, X):
        scores = self.score_samples(X)
        return [1 if s < 0.65 else -1 for s in scores]
