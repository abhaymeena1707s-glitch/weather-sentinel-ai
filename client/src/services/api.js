import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sentinel_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me')
};

export const stationService = {
  getAll: (params) => api.get('/stations', { params }),
  getById: (id) => api.get(`/stations/${id}`),
  getPersonality: (stationId) => api.get(`/station-personality/${stationId}`),
  getTrustScore: (stationId) => api.get(`/trust-score/${stationId}`)
};

export const readingService = {
  getAll: (params) => api.get('/readings', { params }),
  getByStation: (stationId, params) => api.get(`/readings/${stationId}`, { params }),
  explain: (readingId) => api.get(`/explain/${readingId}`),
  create: (data) => api.post('/observations', data)
};

export const anomalyService = {
  getAll: (params) => api.get('/anomalies', { params }),
  getById: (id) => api.get(`/anomalies/${id}`),
  update: (id, data) => api.patch(`/anomalies/${id}`, data)
};

export const alertService = {
  getAll: (params) => api.get('/alerts', { params }),
  getById: (id) => api.get(`/alerts/${id}`),
  update: (id, data) => api.patch(`/alerts/${id}`, data)
};

export const healthService = {
  getAll: (params) => api.get('/sensor-health', { params }),
  getByStation: (stationId) => api.get(`/sensor-health/${stationId}`)
};

export const maintenanceService = {
  getAll: (params) => api.get('/maintenance', { params }),
  getById: (id) => api.get(`/maintenance/${id}`),
  update: (id, data) => api.patch(`/maintenance/${id}`, data)
};

export const quarantineService = {
  getAll: (params) => api.get('/quarantine', { params }),
  update: (id, data) => api.patch(`/quarantine/${id}`, data)
};

export const simulatorService = {
  inject: (data) => api.post('/simulator/inject', data)
};

export const modelPerformanceService = {
  get: () => api.get('/model-performance')
};

export default api;
