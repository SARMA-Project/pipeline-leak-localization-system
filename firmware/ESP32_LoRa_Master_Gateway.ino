/*
 * 🌊 Leak Busters SCADA — ESP32 LoRa Master Gateway Firmware
 * 
 * Hardware Requirements:
 * - ESP32 Master Gateway Board
 * - SX1276 / SX1278 LoRa Receiver Module
 * - Wi-Fi connection to Internet / Local Router
 * 
 * Description:
 * Acts as the Central Gateway Receiver for the LoRa Sensor Mesh.
 * Receives packet telemetry from ESP32 Node 4 and Node 5.
 * Performs Time Difference of Arrival (TDOA) acoustic localization:
 *   d4 = (L + c * delta_t) / 2
 * Calculates distance from Node 4 in meters with ±0.04 m experimental boundary.
 * Streams real-time JSON packets to Firebase Realtime Database & Serial Port.
 */

#include <WiFi.h>
#include <SPI.h>
#include <LoRa.h>
#include <Firebase_ESP_Client.h>

// ==========================================
// CONFIGURATION & CREDENTIALS
// ==========================================
#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"

#define API_KEY "YOUR_FIREBASE_API_KEY"
#define DATABASE_URL "https://your-project-default-rtdb.firebaseio.com/"

#define LORA_BAND 868E6

// LoRa SPI Pinout (ESP32 Standard)
#define LORA_SCK 18
#define LORA_MISO 19
#define LORA_MOSI 23
#define LORA_SS 5
#define LORA_RST 14
#define LORA_DIO0 2

// Pipe Physical Characteristics
#define PIPE_LENGTH_METERS 1.00     // 1-meter physical PVC test rig
#define SOUND_SPEED_GAS 343.0       // Speed of acoustic wave in gas (m/s)

// Telemetry Packet Struct (Matches Slave Nodes)
typedef struct {
  uint8_t nodeId;
  float pressureBar;
  float acousticDb;
  float temperatureC;
  uint32_t timestampMicros;
  uint16_t packetSeq;
} TelemetryPacket;

TelemetryPacket node4Data;
TelemetryPacket node5Data;

bool hasNode4 = false;
bool hasNode5 = false;

// Firebase Handles
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
bool signupOK = false;

void setup() {
  Serial.begin(115200);
  while (!Serial && millis() < 3000);

  Serial.println("==============================================");
  Serial.println("🌐 ESP32 LoRa Master Gateway Initialization");
  Serial.println("==============================================");

  // 1. Connect to Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi...");
  int wifiRetry = 0;
  while (WiFi.status() != WL_CONNECTED && wifiRetry < 20) {
    delay(500);
    Serial.print(".");
    wifiRetry++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ Wi-Fi Connected! IP: " + WiFi.localIP().toString());
    
    // Initialize Firebase
    config.api_key = API_KEY;
    config.database_url = DATABASE_URL;

    if (Firebase.signUp(&config, &auth, "", "")) {
      Serial.println("✅ Firebase Anonymous Authentication Success.");
      signupOK = true;
    }
    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true);
  } else {
    Serial.println("\n⚠️ Wi-Fi Unavailable. Operating in Standalone Serial Gateway Mode.");
  }

  // 2. Initialize LoRa Receiver
  SPI.begin(LORA_SCK, LORA_MISO, LORA_MOSI, LORA_SS);
  LoRa.setPins(LORA_SS, LORA_RST, LORA_DIO0);

  if (!LoRa.begin(LORA_BAND)) {
    Serial.println("❌ LoRa Receiver Init Failed!");
    while (1) delay(1000);
  }

  LoRa.setSpreadingFactor(7);
  LoRa.setSignalBandwidth(125E3);
  LoRa.setCodingRate4(5);

  Serial.println("✅ LoRa Master Gateway Ready. Listening for Node 4 & Node 5 Packets...\n");
}

void loop() {
  int packetSize = LoRa.parsePacket();
  if (packetSize == sizeof(TelemetryPacket)) {
    TelemetryPacket rxPayload;
    LoRa.readBytes((uint8_t*)&rxPayload, sizeof(TelemetryPacket));

    if (rxPayload.nodeId == 4) {
      node4Data = rxPayload;
      hasNode4 = true;
    } else if (rxPayload.nodeId == 5) {
      node5Data = rxPayload;
      hasNode5 = true;
    }

    Serial.printf("📥 [LoRa RX] Node %d | P: %.2f bar | A: %.1f dB | T: %.1f°C | Time: %u µs\n",
                  rxPayload.nodeId, rxPayload.pressureBar, rxPayload.acousticDb, rxPayload.temperatureC, rxPayload.timestampMicros);

    // Process TDOA Localization whenever telemetry arrives
    processTdoaLocalization();
  }
}

void processTdoaLocalization() {
  if (!hasNode4 && !hasNode5) return;

  // Determine system flow state
  bool isFlowOn = (node4Data.pressureBar > 0.10 || node5Data.pressureBar > 0.10);
  bool isLeakDetected = isFlowOn && (node4Data.acousticDb > 45.0 || node5Data.acousticDb > 45.0);

  float predictedDistN4_Meters = 0.0;
  float predictedDistN4_Cm = 0.0;
  float tolMinCm = 0.0;
  float tolMaxCm = 0.0;

  if (isLeakDetected) {
    // Calculate Time Difference of Arrival (TDOA) in seconds
    int32_t deltaMicros = (int32_t)node5Data.timestampMicros - (int32_t)node4Data.timestampMicros;
    float deltaSeconds = deltaMicros / 1000000.0;

    // TDOA Localization Equation: d4 = (L + c * delta_t) / 2
    predictedDistN4_Meters = (PIPE_LENGTH_METERS + (SOUND_SPEED_GAS * deltaSeconds)) / 2.0;

    // Fallback/Clamp to physical pipeline bounds (0.05m to 0.95m)
    if (predictedDistN4_Meters < 0.05 || predictedDistN4_Meters > 0.95 || isnan(predictedDistN4_Meters)) {
      // Acoustic amplitude ratio backup calculation
      float totalAcoustic = node4Data.acousticDb + node5Data.acousticDb;
      if (totalAcoustic > 0) {
        predictedDistN4_Meters = 1.0 - (node4Data.acousticDb / totalAcoustic);
      } else {
        predictedDistN4_Meters = 0.50;
      }
    }

    predictedDistN4_Cm = predictedDistN4_Meters * 100.0;
    tolMinCm = max(0.0f, predictedDistN4_Cm - 4.0f);
    tolMaxCm = min(100.0f, predictedDistN4_Cm + 4.0f);
  }

  // 1. Output Serial JSON Stream for Local SCADA Bridge
  Serial.print("JSON: ");
  Serial.printf("{\"flowMode\":\"%s\",\"node4\":{\"pressure\":%.2f,\"acoustic\":%.1f,\"temperature\":%.1f,\"status\":\"%s\"},",
                isFlowOn ? "ON" : "OFF",
                node4Data.pressureBar, node4Data.acousticDb, node4Data.temperatureC,
                isLeakDetected ? "Leak" : (isFlowOn ? "Healthy" : "Off"));
  
  Serial.printf("\"node5\":{\"pressure\":%.2f,\"acoustic\":%.1f,\"temperature\":%.1f,\"status\":\"%s\"},",
                node5Data.pressureBar, node5Data.acousticDb, node5Data.temperatureC,
                isLeakDetected ? "Leak" : (isFlowOn ? "Healthy" : "Off"));

  Serial.printf("\"leakLocation\":{\"predictedDistN4Meters\":%.2f,\"predictedDistN4Cm\":%.1f,\"toleranceMinCm\":%.1f,\"toleranceMaxCm\":%.1f}}\n",
                predictedDistN4_Meters, predictedDistN4_Cm, tolMinCm, tolMaxCm);

  // 2. Upload to Firebase RTDB if Online
  if (signupOK && Firebase.ready()) {
    FirebaseJson json;
    json.set("flowMode", isFlowOn ? "ON" : "OFF");
    json.set("node004/pressure", node4Data.pressureBar);
    json.set("node004/acoustic", node4Data.acousticDb);
    json.set("node004/temperature", node4Data.temperatureC);
    json.set("node004/status", isLeakDetected ? "Leak" : (isFlowOn ? "Healthy" : "Off"));
    json.set("node004/predictedDistNode4Cm", predictedDistN4_Cm);
    json.set("node004/toleranceMinCm", tolMinCm);
    json.set("node004/toleranceMaxCm", tolMaxCm);

    json.set("node005/pressure", node5Data.pressureBar);
    json.set("node005/acoustic", node5Data.acousticDb);
    json.set("node005/temperature", node5Data.temperatureC);
    json.set("node005/status", isLeakDetected ? "Leak" : (isFlowOn ? "Healthy" : "Off"));

    Firebase.RTDB.setJSON(&fbdo, "pipeline-monitoring/telemetry", &json);
  }
}
