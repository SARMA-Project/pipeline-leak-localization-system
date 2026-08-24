export const generateInitialNodes = () => {
  const nodes = {};
  
  // Real world coordinates for a realistic pipeline path (Erode to Coimbatore)
  const startLat = 11.342345;
  const startLng = 77.712344;
  const endLat = 11.016844;
  const endLng = 76.955833;
  
  const numNodes = 20;

  for (let i = 1; i <= numNodes; i++) {
    const id = `node${i.toString().padStart(3, '0')}`;
    
    // Interpolate coordinates linearly
    const fraction = (i - 1) / (numNodes - 1);
    const latitude = startLat + (endLat - startLat) * fraction + (Math.random() * 0.002 - 0.001);
    const longitude = startLng + (endLng - startLng) * fraction + (Math.random() * 0.002 - 0.001);
    
    // Location names
    let locationName = `Pipeline Segment ${i}`;
    if (i === 1) locationName = "Erode Hub Station";
    if (i === 10) locationName = "Tiruppur Relay Station";
    if (i === 20) locationName = "Coimbatore Terminal";

    // Standard Healthy simulation base
    nodes[id] = {
      id,
      temperature: 25 + Math.random() * 2,
      pressure: 2.8 + Math.random() * 0.2,
      gas: 200 + Math.random() * 20,
      acoustic: 30 + Math.random() * 5,
      battery: 90 + Math.random() * 10,
      signal: -65 + Math.random() * 10,
      status: 'Healthy',
      latitude,
      longitude,
      locationName,
      timestamp: new Date().toISOString(),
      leakProbability: Math.random() * 2, // 0-2%
      health: 98 + Math.random() * 2,
      masterNode: `Master-0${Math.ceil(i/5)}`,
      solarCharging: true
    };
  }
  return nodes;
};

export const generateGlobalMetrics = () => ({
  weather: {
    condition: 'Clear',
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    rainProbability: 5
  },
  network: {
    latency: 45, // ms
    status: 'Online',
    firebaseSyncDelay: 12, // ms
    packetSuccessRate: 99.8
  },
  ai: {
    overallConfidence: 96.5,
    lastPredictionTime: new Date().toISOString()
  }
});

export const generateCommunicationsData = () => {
  const comms = [];
  for (let i = 1; i <= 20; i++) {
    comms.push({
      nodeId: `node${i.toString().padStart(3, '0')}`,
      rssi: -60 - Math.random() * 20,
      snr: 10 + Math.random() * 5,
      latency: 40 + Math.random() * 30,
      packetLoss: Math.random() > 0.9 ? 1 : 0,
      retries: Math.random() > 0.95 ? 1 : 0,
      type: 'LoRaWAN'
    });
  }
  return comms;
};

export const generateAnalyticsHistory = () => {
  const history = [];
  let currentTemp = 25;
  let currentPres = 2.8;
  
  // Generate last 24 hours of data points (every hour)
  for (let i = 24; i >= 0; i--) {
    history.push({
      time: new Date(Date.now() - i * 3600000).toISOString(),
      avgTemperature: currentTemp + (Math.random() * 2 - 1),
      avgPressure: currentPres + (Math.random() * 0.1 - 0.05),
      avgAcoustic: 30 + Math.random() * 5,
      avgGas: 210 + Math.random() * 15,
      pipelineHealth: 98 + Math.random() * 2
    });
  }
  return history;
};

export const generateInitialAlerts = () => [
  {
    id: 'ALM-9921',
    severity: 'Warning',
    type: 'Communication',
    location: 'Segment 12',
    node: 'node012',
    time: new Date(Date.now() - 3600000).toISOString(),
    acknowledged: true,
    description: 'High network latency detected (120ms)'
  },
  {
    id: 'ALM-9922',
    severity: 'Info',
    type: 'Maintenance',
    location: 'Erode Hub Station',
    node: 'node001',
    time: new Date(Date.now() - 7200000).toISOString(),
    acknowledged: false,
    description: 'Scheduled filter replacement due in 5 days'
  }
];
