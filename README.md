# 🌊 Leak Busters SCADA — Pipeline Leak Localization System

[![System Status](https://img.shields.io/badge/System-Operational-emerald?style=for-the-badge&logo=shield)](https://github.com/SARMA-Project/pipeline-leak-localization-system)
[![Hardware](https://img.shields.io/badge/Hardware-ESP32%20%7C%20SX1276%20LoRa-orange?style=for-the-badge)](firmware/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Stack](https://img.shields.io/badge/Stack-React%2019%20%7C%20Vite%20%7C%20TailwindCSS%20%7C%20Node.js-cyan?style=for-the-badge)](https://github.com/SARMA-Project/pipeline-leak-localization-system)

An advanced, real-time industrial **IoT SCADA System & Digital Twin** for gas transmission pipeline leak detection, **LoRa wireless sensor telemetry**, **AI TDOA acoustic-transient localization**, and automated emergency valve interlocks.

---

## 📌 Architecture & System Features

- ⚡ **Core IoT Hardware Layer (`firmware/`)**:
  - **ESP32 Edge Sensor Nodes (Node 4 & Node 5)**: Real-time sampling of pressure transients, acoustic wave peaks, and pipe temperature.
  - **SX1276 / SX1278 LoRa Mesh (868 MHz)**: High-speed, long-range wireless telemetry transmission between edge nodes and gateway.
  - **ESP32 Master Gateway**: Computes microsecond-precision Time Difference of Arrival (TDOA) localization and streams JSON telemetry to Firebase / Serial.
- 🛰️ **20-Node Physical Pipeline Digital Twin**: Animated virtual physics modeling real-time pressure gradients, fluid particle flow, gas jet escape plumes, and communication waves.
- 🎯 **AI TDOA Leak Localization**: Precise localization within a **±0.04 m (±4 cm)** experimental tolerance boundary between Node 4 and Node 5.
- 📈 **Multi-Sensor Time-Series Analytics**: Stacked real-time visualization of Pressure Dynamics (bar), Acoustic Waveform Intensity (dB), and Joule-Thomson Temperature Cooling (°C).
- 🗺️ **Interactive GIS Pipeline Map**: Satellite map with pan, zoom, quick node focus, and real-time alert markers.
- 🚨 **Emergency SOP & Automated Interlock**: One-click Emergency Shutdown for upstream valve (V-104) isolation.
- 📱 **Operator Handheld Remote Control Bridge**: Lightweight HTTP Node server (`remote-server.js`) on port 3001 allowing manual operator overrides and simulation testing during hardware maintenance.
- 📊 **Data Export**: Export sensor analytics to Excel/CSV for compliance logging.

---

## 🧪 Fluid Dynamics & Acoustic Physics Equations

1. **Pressure Drop Along Segment**:
   $$\Delta P = P_{\text{in}} - P_{\text{out}} = \frac{f \cdot L \cdot \rho \cdot v^2}{2 D}$$

2. **Acoustic Attenuation with Distance ($d$)**:
   $$\text{Acoustic}(d) = \max\left(30.0,\, 112.0 - (d \cdot 0.55)\right) \quad (\text{dB})$$

3. **Time Difference of Arrival (TDOA) Localization**:
   $$d_4 = \frac{L + c \cdot \Delta t}{2}$$

---

## 📂 Repository Structure

```
pipeline-leak-localization-system/
├── firmware/                              # 🔌 ESP32 Hardware Firmware & LoRa Layer
│   ├── ESP32_LoRa_Slave_Sensor_Node.ino   # Edge Node code for Node 4 & Node 5
│   ├── ESP32_LoRa_Master_Gateway.ino      # Master Gateway code with TDOA AI engine
│   └── README.md                          # Hardware wiring diagrams & LoRa pinouts
├── src/                                   # 💻 SCADA React Web Application
│   ├── components/                        # Layout & Navigation components
│   ├── contexts/                          # FirebaseContext & State Engine
│   ├── pages/
│   │   ├── Dashboard.jsx                  # SCADA Overview & Localization Panel
│   │   ├── DigitalTwin.jsx                # Animated Pipeline Physics Twin
│   │   ├── Analytics.jsx                  # Stacked Time-Series Charts
│   │   ├── LiveMap.jsx                    # Leaflet GIS Satellite Map
│   │   ├── EmergencyResponse.jsx          # Emergency SOP & Valve Shutdown
│   │   └── MobileRemote.jsx               # Handheld Remote UI
│   ├── utils/                             # Telemetry Generators & Math Helpers
│   ├── App.jsx                            # Router setup
│   └── main.jsx                           # Entry point
├── remote-server.js                       # HTTP Remote Control & Telemetry Bridge
├── vite.config.js                         # Vite configuration
└── package.json
```

---

## 🛠️ Getting Started & Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **Arduino IDE** (for flashing ESP32 firmware)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SARMA-Project/pipeline-leak-localization-system.git
   cd pipeline-leak-localization-system
   ```

2. Install web dependencies:
   ```bash
   npm install
   ```

3. Flash ESP32 Firmware:
   - Flash `firmware/ESP32_LoRa_Slave_Sensor_Node.ino` to Node 4 and Node 5 ESP32 boards.
   - Flash `firmware/ESP32_LoRa_Master_Gateway.ino` to Master Gateway ESP32 board.

---

## 🏃 Running the SCADA Web Application

Launch **two concurrent terminal tasks**:

### Terminal 1: Mobile Remote & Telemetry Bridge (Port 3001)
```bash
node remote-server.js
```

### Terminal 2: SCADA Web Application (Port 5173)
```bash
npm run dev
```

---

## 🌐 Accessing the Dashboards

- 💻 **Laptop SCADA Display (Control Room)**: `http://localhost:5173/`
- 📱 **Mobile Handheld Remote Controller**: `http://<YOUR_LAPTOP_IP>:5173/remote`

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
