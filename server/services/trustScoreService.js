/**
 * Weather Trust Score Calculation Service
 * Evaluates the trustworthiness of an AWS station's data stream
 */

function calculateTrustScore({
  physicalScore = 95,
  temporalScore = 92,
  multivariateScore = 88,
  spatialScore = 84,
  sensorHealth = 80,
  lastSeen = new Date()
}) {
  // Data freshness component (100 if < 5m ago, decays to 0 after 60m)
  const ageMinutes = Math.max(0, (Date.now() - new Date(lastSeen).getTime()) / (1000 * 60));
  let freshnessScore = 100;
  if (ageMinutes > 60) freshnessScore = 20;
  else if (ageMinutes > 15) freshnessScore = Math.round(100 - (ageMinutes - 15) * 1.7);
  else if (ageMinutes > 5) freshnessScore = Math.round(100 - (ageMinutes - 5) * 1.0);

  // Weighted fusion
  // Physical consistency: 25%
  // Temporal consistency: 20%
  // Multivariate consistency: 15%
  // Spatial agreement: 15%
  // Sensor health: 15%
  // Data freshness: 10%
  const compositeScore = Math.round(
    physicalScore * 0.25 +
    temporalScore * 0.20 +
    multivariateScore * 0.15 +
    spatialScore * 0.15 +
    sensorHealth * 0.15 +
    freshnessScore * 0.10
  );

  const clampedScore = Math.min(100, Math.max(0, compositeScore));

  let trustGrade = 'A+';
  let trustLabel = 'High Integrity';
  if (clampedScore < 50) {
    trustGrade = 'F';
    trustLabel = 'Untrusted / Quarantined';
  } else if (clampedScore < 70) {
    trustGrade = 'C';
    trustLabel = 'Degraded';
  } else if (clampedScore < 85) {
    trustGrade = 'B';
    trustLabel = 'Acceptable';
  }

  return {
    score: clampedScore,
    grade: trustGrade,
    label: trustLabel,
    components: {
      temporalConsistency: Math.round(temporalScore),
      physicalConsistency: Math.round(physicalScore),
      multivariateConsistency: Math.round(multivariateScore),
      spatialAgreement: Math.round(spatialScore),
      sensorHealth: Math.round(sensorHealth),
      dataFreshness: Math.round(freshnessScore)
    }
  };
}

module.exports = { calculateTrustScore };
