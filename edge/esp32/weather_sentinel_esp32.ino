/*
  Weather Sentinel AI - Edge Inference Firmware (ESP32)
  Lightweight TinyML On-Device Quality Control & Anomaly Prescreening
  
  Architecture Flow:
  Sensors (DHT22 / BME280 / PT100) -> ESP32 -> Local Range & Temporal Sanity Check
  -> Z-score Spike Filter -> MQTT JSON Payload -> Weather Sentinel AI Backend
*/

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char* ssid = "AWS_WEATHER_NET";
const char* password = "SentinelSecurePass";
const char* mqtt_server = "192.168.1.100";
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

// Sensor baseline variables
float lastTemp = 31.8;
float lastPress = 1003.2;
float lastHum = 64.5;
unsigned long lastReadTime = 0;

// Lightweight Edge Quality Control Function
bool edgeSanityCheck(float temp, float press, float hum, float &anomalyScore) {
  anomalyScore = 0.0;
  
  // 1. Physical Bounds Check
  if (temp < -40.0 || temp > 60.0) anomalyScore += 0.5;
  if (press < 870.0 || press > 1085.0) anomalyScore += 0.4;
  if (hum < 0.0 || hum > 100.0) anomalyScore += 0.5;

  // 2. Sudden Step-Change / Spike Filter
  float dTemp = abs(temp - lastTemp);
  if (dTemp > 5.0) anomalyScore += 0.4; // Exceeds 5°C jump between 1-min readings

  // 3. Flatline / Frozen check
  if (abs(temp - lastTemp) < 0.001 && abs(hum - lastHum) < 0.001) {
    anomalyScore += 0.3;
  }

  return (anomalyScore > 0.4);
}

void setup() {
  Serial.begin(115200);
  Serial.println("Weather Sentinel AI Edge Initializing on ESP32...");
  // Initialize WiFi and MQTT...
}

void loop() {
  // Read sensor hardware (e.g., BME280 or RS485 Modbus AWS)
  float currentTemp = 32.1;
  float currentPress = 1003.5;
  float currentHum = 65.0;

  float edgeScore = 0.0;
  bool isEdgeSuspicious = edgeSanityCheck(currentTemp, currentPress, currentHum, edgeScore);

  StaticJsonDocument<256> doc;
  doc["stationId"] = "AWS-042";
  doc["temperature"] = currentTemp;
  doc["pressure"] = currentPress;
  doc["humidity"] = currentHum;
  doc["edgeAnomalyScore"] = edgeScore;
  doc["edgeFlag"] = isEdgeSuspicious ? "SUSPICIOUS" : "NORMAL";

  char buffer[256];
  serializeJson(doc, buffer);
  
  // Publish to MQTT topic: "weather/sentinel/telemetry"
  Serial.println(buffer);
  
  lastTemp = currentTemp;
  lastPress = currentPress;
  lastHum = currentHum;

  delay(10000); // 10-second reporting cadence
}
