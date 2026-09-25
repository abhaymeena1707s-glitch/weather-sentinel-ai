const { createModel } = require('./modelFactory');

const stationProfileSchema = {
  stationId: { type: String, required: true, unique: true },
  morning: {
    tempMin: { type: Number, default: 22 },
    tempMax: { type: Number, default: 28 },
    humidityMin: { type: Number, default: 65 },
    humidityMax: { type: Number, default: 85 },
    pressureMin: { type: Number, default: 1000 },
    pressureMax: { type: Number, default: 1008 }
  },
  afternoon: {
    tempMin: { type: Number, default: 30 },
    tempMax: { type: Number, default: 36 },
    humidityMin: { type: Number, default: 45 },
    humidityMax: { type: Number, default: 65 },
    pressureMin: { type: Number, default: 998 },
    pressureMax: { type: Number, default: 1005 }
  },
  night: {
    tempMin: { type: Number, default: 21 },
    tempMax: { type: Number, default: 25 },
    humidityMin: { type: Number, default: 70 },
    humidityMax: { type: Number, default: 90 },
    pressureMin: { type: Number, default: 1002 },
    pressureMax: { type: Number, default: 1009 }
  },
  typicalNoise: { type: String, default: '±0.25°C, ±0.4 hPa, ±1.5%' },
  typicalRateOfChange: { type: String, default: '< 1.8°C/hr' },
  historicalAnomalyFrequency: { type: String, default: '0.42% (Normal)' },
  hourlyMeans: [{
    hour: { type: Number },
    temperature: { type: Number },
    pressure: { type: Number },
    humidity: { type: Number }
  }]
};

module.exports = createModel('StationProfile', stationProfileSchema);
