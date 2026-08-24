# 📡 Firmware & IoT Hardware Architecture

This directory contains the production C++/Arduino firmware for the **Leak Busters SCADA** physical hardware layer.

---

## 🏗️ Core IoT Hardware System Architecture

```
+------------------------+             +------------------------+
|   ESP32 Slave Node 4   |             |   ESP32 Slave Node 5   |
| (Pressure + Acoustic)  |             | (Pressure + Acoustic)  |
+-----------+------------+             +-----------+------------+
            |                                      |
            | LoRa Wireless (868 MHz)              | LoRa Wireless (868 MHz)
            +------------------+-------------------+
                               |
                               v
                   +-----------------------+
                   |  ESP32 Master Gateway |
                   |  (TDOA AI Engine)     |
                   +-----------+-----------+
                               |
                               v
                   Firebase Realtime Database
                               |
                               v
                   +-----------------------+
                   |   Leak Busters SCADA  |
                   |   React Dashboard     |
                   +-----------------------+
```

---

## 🔌 Hardware Components & Wiring Pinouts

### 1. ESP32 LoRa Slave Sensor Nodes (`ESP32_LoRa_Slave_Sensor_Node.ino`)

| Component | ESP32 Pin | Function |
| :--- | :--- | :--- |
| **SX1276 LoRa SCK** | GPIO 18 | SPI Clock |
| **SX1276 LoRa MISO** | GPIO 19 | SPI MISO |
| **SX1276 LoRa MOSI** | GPIO 23 | SPI MOSI |
| **SX1276 LoRa NSS (CS)** | GPIO 5 | Chip Select |
| **SX1276 LoRa RESET** | GPIO 14 | Reset Pin |
| **SX1276 LoRa DIO0** | GPIO 2 | Interrupt Pin |
| **Pressure Transducer** | GPIO 34 (ADC1_CH6) | Analog Pressure Sensing (0-5 bar) |
| **Acoustic Sensor (MAX9814)** | GPIO 35 (ADC1_CH7) | High-Speed Acoustic Peak Envelope |
| **DS18B20 Temp Sensor** | GPIO 32 | OneWire Temperature Sensing |

---

### 2. ESP32 Master Gateway (`ESP32_LoRa_Master_Gateway.ino`)

- **LoRa SPI Module**: Same SPI pinout (SCK: 18, MISO: 19, MOSI: 23, SS: 5).
- **Wi-Fi Module**: Connects to local gateway router / mobile hotspot.
- **TDOA Processing Engine**: Computes time difference of acoustic transients $\Delta t = t_5 - t_4$ using microsecond resolution (`micros()`).
- **Firebase Realtime DB Connector**: Uploads structured JSON payloads to `pipeline-monitoring/telemetry`.

---

## 🧮 Time Difference of Arrival (TDOA) Algorithm

$$\Delta t = t_5 - t_4$$

$$d_4 = \frac{L + c \cdot \Delta t}{2}$$

Where:
- $d_4$ = Distance of leak from Node 4 (meters)
- $L$ = Total length of pipe segment between Node 4 and Node 5 ($1.00\text{ m}$)
- $c$ = Acoustic wave velocity in gas ($343\text{ m/s}$)
- $\Delta t$ = Time difference of acoustic pulse arrival at Node 4 vs Node 5 (seconds)

Experimental Uncertainty Boundary: **$\pm 0.04\text{ m} \ (\pm 4\text{ cm})$** error margin filter applied to physical acoustic transients.
