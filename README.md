# 🌊 Leak Busters SCADA — Pipeline Leak Localization System

[![System Status](https://img.shields.io/badge/System-Operational-emerald?style=for-the-badge&logo=shield)](https://github.com/SARMA-Project/pipeline-leak-localization-system)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Stack](https://img.shields.io/badge/Stack-React%2019%20%7C%20Vite%20%7C%20TailwindCSS%20%7C%20Node.js-cyan?style=for-the-badge)](https://github.com/SARMA-Project/pipeline-leak-localization-system)

An advanced, real-time industrial **SCADA System & Digital Twin** for gas transmission pipeline leak detection, AI acoustic-transient localization, and automated valve isolation interlocks.

---

## 📌 Features

- 🛰️ **20-Node Physical Pipeline Digital Twin**: Animated virtual physics modeling real-time pressure gradients, fluid particle flow, gas jet escape plumes, and communication waves.
- 🎯 **AI TDOA Leak Localization**: Precise localization within a **±0.04 m (±4 cm)** experimental tolerance boundary between Node 4 and Node 5.
- 📈 **Multi-Sensor Time-Series Analytics**: Stacked real-time visualization of Pressure Dynamics (bar), Acoustic Waveform Intensity (dB), and Joule-Thomson Temperature Cooling (°C).
- 🗺️ **Interactive GIS Pipeline Map**: Satellite map with pan, zoom, quick node focus, and real-time alert markers.
- 📱 **Handheld Mobile Remote Control Bridge**: Lightweight HTTP Node server (`remote-server.js`) on port 3001 allowing discrete remote control via any smartphone on local Wi-Fi.
- 🚨 **Emergency SOP & Automated Interlock**: One-click Emergency Shutdown for upstream valve (V-104) isolation.
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

## 🛠️ Getting Started & Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SARMA-Project/pipeline-leak-localization-system.git
   cd pipeline-leak-localization-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## 🏃 Running the Application

To run the full SCADA system with mobile remote control capabilities, launch **two concurrent terminal tasks**:

### Terminal 1: Mobile Remote Sync Bridge (Port 3001)
```bash
node remote-server.js
```

### Terminal 2: SCADA Web Application (Port 5173)
```bash
npm run dev
```

---

## 🌐 Accessing the Dashboards

- 💻 **Laptop SCADA Display (Control Room)**:
  `http://localhost:5173/`

- 📱 **Mobile Handheld Remote Controller (Smartphone)**:
  `http://<YOUR_LAPTOP_IP>:5173/remote`

---

## 🗂️ Project Structure

```
dashboard/
├── src/
│   ├── components/       # Layout, Navigation, and Header components
│   ├── contexts/         # FirebaseContext & Physics State Engine
│   ├── pages/
│   │   ├── Dashboard.jsx         # SCADA Overview & Localization Panel
│   │   ├── DigitalTwin.jsx       # Animated Pipeline Physics Twin
│   │   ├── Analytics.jsx         # Stacked Time-Series Charts
│   │   ├── LiveMap.jsx           # Leaflet GIS Satellite Map
│   │   ├── EmergencyResponse.jsx # Emergency SOP & Valve Shutdown
│   │   └── MobileRemote.jsx      # Mobile Phone Handheld Remote UI
│   ├── utils/            # Telemetry Generators & Math Helpers
│   ├── App.jsx           # React Router routing setup
│   └── main.jsx          # Entry point
├── remote-server.js      # Cross-device HTTP Remote Control Bridge
├── vite.config.js        # Vite configuration (host: true)
└── package.json
```

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
