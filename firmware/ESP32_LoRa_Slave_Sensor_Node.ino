/*
 * 🌊 Leak Busters SCADA — ESP32 LoRa Edge Sensor Node (Slave Node 4 / Node 5)
 * 
 * Hardware Requirements:
 * - ESP32 Development Board
 * - SX1276 / SX1278 LoRa Transceiver Module (SPI Interface)
 * - Analog Pressure Transducer (MPS20N0040D or 0-5V Transducer)
 * - Acoustic Sound Sensor (MAX9814 AGC Microphone / KY-038)
 * - DS18B20 OneWire Temperature Sensor
 * 
 * Description:
 * Reads high-speed pressure transients, acoustic wave amplitudes, and pipe temperature.
 * Uses microsecond high-resolution timers (`micros()`) to capture acoustic pulse arrival time for TDOA localization.
 * Transmits structured telemetry packets over LoRa (868 MHz / 433 MHz) to the Master Gateway.
 */

#include <SPI.h>
#include <LoRa.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// ==========================================
// CONFIGURATION & PINOUTS
// ==========================================
#define NODE_ID 4             // Set to 4 for Node 004, 5 for Node 005
#define LORA_BAND 868E6       // 868 MHz (Europe/India) or 433E6 / 915E6

// LoRa SPI Pinout (ESP32 Standard)
#define LORA_SCK 18
#define LORA_MISO 19
#define LORA_MOSI 23
#define LORA_SS 5
#define LORA_RST 14
#define LORA_DIO0 2

// Sensor Pinout
#define PRESSURE_PIN 34       // Analog ADC Pin (Pressure Transducer)
#define ACOUSTIC_PIN 35       // Analog ADC Pin (MAX9814 Acoustic Peak)
#define ONE_WIRE_BUS 32       // OneWire Digital Pin (DS18B20 Temp Sensor)

// Thresholds for Acoustic Pulse Detection
#define ACOUSTIC_TRIGGER_THRESHOLD 450 // Raw ADC trigger threshold for wave arrival

// Temperature Sensor Setup
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature tempSensor(&oneWire);

// Struct Payload to send via LoRa
typedef struct {
  uint8_t nodeId;             // Node ID (4 or 5)
  float pressureBar;          // Measured pressure in bar (0.00 - 5.00 bar)
  float acousticDb;           // Measured acoustic intensity in dB (0 - 120 dB)
  float temperatureC;         // Measured temperature in °C
  uint32_t timestampMicros;   // Pulse arrival timestamp in microseconds
  uint16_t packetSeq;         // Packet sequence counter
} TelemetryPacket;

TelemetryPacket payload;
uint16_t sequenceCounter = 0;

void setup() {
  Serial.begin(115200);
  while (!Serial && millis() < 3000);

  Serial.println("==============================================");
  Serial.printf("🌊 ESP32 LoRa Sensor Edge Node ID: %d\n", NODE_ID);
  Serial.println("==============================================");

  // Initialize Temperature Sensor
  tempSensor.begin();

  // Configure LoRa SPI Pins
  SPI.begin(LORA_SCK, LORA_MISO, LORA_MOSI, LORA_SS);
  LoRa.setPins(LORA_SS, LORA_RST, LORA_DIO0);

  // Initialize LoRa Transceiver
  if (!LoRa.begin(LORA_BAND)) {
    Serial.println("❌ LoRa Initialization Failed! Check SPI Wiring.");
    while (1) {
      delay(1000);
    }
  }

  // Tune LoRa Parameters for High-Reliability Industrial Telemetry
  LoRa.setTxPower(17);          // 17 dBm transmission power
  LoRa.setSpreadingFactor(7);    // SF7 for fast time-critical transmission
  LoRa.setSignalBandwidth(125E3);// 125 kHz bandwidth
  LoRa.setCodingRate4(5);        // CR 4/5

  Serial.println("✅ LoRa Transceiver Operational at 868 MHz.");
  Serial.println("📡 Sampling physical sensors & broadcasting telemetry...");
}

void loop() {
  // 1. Read Pressure Transducer (ADC 0-4095 mapped to 0.0 - 5.0 bar)
  int rawPressure = analogRead(PRESSURE_PIN);
  float pressureBar = (rawPressure / 4095.0) * 5.0;
  if (pressureBar < 0.05) pressureBar = 0.00; // Flat baseline clamp

  // 2. High-Speed Acoustic Sampling (Peak Envelope)
  int maxAcousticRaw = 0;
  uint32_t pulseTriggerTime = 0;
  
  // Sample acoustic window for 20 milliseconds
  unsigned long startSample = millis();
  while (millis() - startSample < 20) {
    int sample = analogRead(ACOUSTIC_PIN);
    if (sample > maxAcousticRaw) {
      maxAcousticRaw = sample;
    }
    // High-precision timestamp capture when acoustic pulse breaches threshold
    if (sample > ACOUSTIC_TRIGGER_THRESHOLD && pulseTriggerTime == 0) {
      pulseTriggerTime = micros();
    }
  }

  // Convert raw ADC to dB scale (30 - 115 dB)
  float acousticDb = 28.0 + (maxAcousticRaw / 4095.0) * 87.0;

  // If no transient pulse breached threshold, use current micros
  if (pulseTriggerTime == 0) {
    pulseTriggerTime = micros();
  }

  // 3. Read DS18B20 Temperature
  tempSensor.requestTemperatures();
  float tempC = tempSensor.getTempCByIndex(0);
  if (tempC < -50 || tempC > 100) {
    tempC = 26.5; // Ambient default fallback
  }

  // 4. Populate LoRa Telemetry Payload
  payload.nodeId = NODE_ID;
  payload.pressureBar = pressureBar;
  payload.acousticDb = acousticDb;
  payload.temperatureC = tempC;
  payload.timestampMicros = pulseTriggerTime;
  payload.packetSeq = ++sequenceCounter;

  // 5. Transmit Payload over LoRa
  LoRa.beginPacket();
  LoRa.write((uint8_t*)&payload, sizeof(TelemetryPacket));
  LoRa.endPacket();

  Serial.printf("📡 [LoRa TX #%u] Node: %d | Pressure: %.2f bar | Acoustic: %.1f dB | Temp: %.1f°C | Time: %u µs\n",
                payload.packetSeq, payload.nodeId, payload.pressureBar, payload.acousticDb, payload.temperatureC, payload.timestampMicros);

  delay(250); // Broadcast 4 times per second (250ms interval)
}
