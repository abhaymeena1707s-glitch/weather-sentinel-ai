const { createModel } = require('./modelFactory');

const stationSchema = {
  stationId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  state: { type: String, default: 'Karnataka' },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  elevation: { type: Number, required: true }, // meters
  status: { 
    type: String, 
    enum: ['normal', 'warning', 'anomaly', 'offline', 'quarantined'], 
    default: 'normal' 
  },
  lastSeen: { type: Date, default: Date.now },
  temperatureSensorId: { type: String },
  pressureSensorId: { type: String },
  humiditySensorId: { type: String },
  healthScore: { type: Number, default: 85 },
  trustScore: { type: Number, default: 90 },
  currentReadings: {
    temperature: { type: Number },
    pressure: { type: Number },
    humidity: { type: Number },
    timestamp: { type: Date, default: Date.now }
  }
};

module.exports = createModel('Station', stationSchema);
