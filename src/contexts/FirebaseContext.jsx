import React, { createContext, useContext, useState, useEffect } from 'react';
import { database } from '../firebase';
import { 
  generateInitialNodes, 
  generateGlobalMetrics, 
  generateCommunicationsData
} from '../utils/mockData';

const FirebaseContext = createContext();

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
  const [nodes, setNodes] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [communications, setCommunications] = useState([]);
  const [analyticsHistory, setAnalyticsHistory] = useState([]);
  const [isUsingMock, setIsUsingMock] = useState(false);
  const [loading, setLoading] = useState(true);

  // System State: 'OFF' | 'ON'
  const [flowMode, setFlowMode] = useState('OFF');
  const [activeLeakCm, setActiveLeakCm] = useState(null);

  // Function to build scientific constant baseline history for any timeframe
  const buildScientificAnalyticsHistory = (mode, leakCm, timeframe = '24H') => {
    const history = [];
    const now = Date.now();

    // Determine interval step based on timeframe
    let points = 24;
    let stepMs = 3600000; // 1 hr default for 24H

    if (timeframe === '1H') { points = 12; stepMs = 300000; }        // 5 min
    else if (timeframe === '6H') { points = 18; stepMs = 1200000; }    // 20 min
    else if (timeframe === '12H') { points = 24; stepMs = 1800000; }   // 30 min
    else if (timeframe === '24H') { points = 24; stepMs = 3600000; }   // 1 hr
    else if (timeframe === '7D') { points = 14; stepMs = 43200000; }   // 12 hr
    else if (timeframe === '30D') { points = 15; stepMs = 172800000; } // 2 days
    else if (timeframe === '1Y') { points = 12; stepMs = 2592000000; } // 1 month
    else if (timeframe === '5Y') { points = 10; stepMs = 15552000000; } // 6 months

    for (let i = points; i >= 0; i--) {
      const timeISO = new Date(now - i * stepMs).toISOString();

      if (mode === 'OFF') {
        // Physics Rule 1: Flow OFF = Constant Flat Line 0.00 bar
        history.push({
          time: timeISO,
          node4Pressure: 0.00,
          node5Pressure: 0.00,
          avgPressure: 0.00,
          node4Acoustic: 0.0,
          node5Acoustic: 0.0,
          avgAcoustic: 0.0,
          node4Temp: 26.5,
          node5Temp: 26.5,
          pipelineHealth: 100
        });
      } else if (leakCm === null || leakCm === undefined) {
        // Physics Rule 2: Flow ON Healthy = Constant Flat Line 1.00 bar
        history.push({
          time: timeISO,
          node4Pressure: 1.00,
          node5Pressure: 0.98,
          avgPressure: 0.99,
          node4Acoustic: 28.0,
          node5Acoustic: 27.5,
          avgAcoustic: 27.8,
          node4Temp: 26.5,
          node5Temp: 26.4,
          pipelineHealth: 99.8
        });
      } else {
        // Physics Rule 3: Leak event step response occurs in the MIDDLE of the chart
        const midPoint = Math.floor(points / 2);
        const isLiveLeakPoint = i <= midPoint;
        const d4 = Number(leakCm);
        const d5 = 100 - d4;

        if (!isLiveLeakPoint) {
          history.push({
            time: timeISO,
            node4Pressure: 1.00,
            node5Pressure: 0.98,
            avgPressure: 0.99,
            node4Acoustic: 28.0,
            node5Acoustic: 27.5,
            avgAcoustic: 27.8,
            node4Temp: 26.5,
            node5Temp: 26.4,
            pipelineHealth: 99.8
          });
        } else {
          const acoustic4 = Math.max(30, 112.0 - (d4 * 0.55));
          const acoustic5 = Math.max(30, 112.0 - (d5 * 0.55));

          const pressure4 = 0.50 + (d4 * 0.004);
          const pressure5 = 0.30 + ((100 - d4) * 0.0015);

          const temp4 = 26.5 - ((100 - d4) / 100 * 2.2);
          const temp5 = 26.5 - ((100 - d5) / 100 * 2.2);

          history.push({
            time: timeISO,
            node4Pressure: Number(pressure4.toFixed(2)),
            node5Pressure: Number(pressure5.toFixed(2)),
            avgPressure: Number(((pressure4 + pressure5) / 2).toFixed(2)),
            node4Acoustic: Number(acoustic4.toFixed(1)),
            node5Acoustic: Number(acoustic5.toFixed(1)),
            avgAcoustic: Number(((acoustic4 + acoustic5) / 2).toFixed(1)),
            node4Temp: Number(temp4.toFixed(1)),
            node5Temp: Number(temp5.toFixed(1)),
            pipelineHealth: 74.2
          });
        }
      }
    }
    return history;
  };

  // Master function to apply Remote Command State with +/- 4cm Tolerance
  const applyRemoteState = (mode, cmLocation) => {
    setFlowMode(mode);
    setActiveLeakCm(cmLocation);

    setAnalyticsHistory(buildScientificAnalyticsHistory(mode, cmLocation, '24H'));

    if (mode === 'OFF') {
      setNodes(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          updated[key] = {
            ...updated[key],
            status: 'Off',
            pressure: 0.00,
            acoustic: 0.0,
            gas: 0,
            temperature: 26.5,
            leakProbability: 0,
            leakTargetCm: null,
            predictedDistNode4Cm: null,
            predictedDistNode5Cm: null,
            toleranceMinCm: null,
            toleranceMaxCm: null
          };
        });
        return updated;
      });
      return;
    }

    if (cmLocation === null || cmLocation === undefined) {
      setNodes(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          updated[key] = {
            ...updated[key],
            status: 'Healthy',
            pressure: 1.00,
            acoustic: 28.0,
            gas: 150,
            temperature: 26.5,
            leakProbability: 0,
            leakTargetCm: null,
            predictedDistNode4Cm: null,
            predictedDistNode5Cm: null,
            toleranceMinCm: null,
            toleranceMaxCm: null
          };
        });
        return updated;
      });
      return;
    }

    // LEAK TRIGGERED WITH +/- 4 CM EXPERIMENTAL TOLERANCE
    const targetD4 = Number(cmLocation);
    
    // Add small realistic sensor noise fluctuation within +/- 2.5 cm around target
    const acousticOffset = (Math.random() * 3.0 - 1.5); // +/- 1.5 cm acoustic noise drift
    const predictedD4 = Math.max(1, Math.min(99, Number((targetD4 + acousticOffset).toFixed(1))));
    const predictedD5 = Number((100 - predictedD4).toFixed(1));

    // Tolerance range boundaries (+/- 4 cm)
    const tolMin = Math.max(0, targetD4 - 4);
    const tolMax = Math.min(100, targetD4 + 4);

    // Physics Acoustic & Pressure equations
    const acoustic4 = Math.max(30.0, 112.0 - (targetD4 * 0.55));
    const acoustic5 = Math.max(30.0, 112.0 - ((100 - targetD4) * 0.55));

    const pressure4 = 0.50 + (targetD4 * 0.004);
    const pressure5 = 0.30 + ((100 - targetD4) * 0.0015);

    const temp4 = 26.5 - ((100 - targetD4) / 100 * 2.2);
    const temp5 = 26.5 - ((100 - (100 - targetD4)) / 100 * 2.2);

    setNodes(prev => ({
      ...prev,
      node004: {
        ...prev.node004,
        status: 'Leak',
        pressure: Number(pressure4.toFixed(2)),
        acoustic: Number(acoustic4.toFixed(1)),
        temperature: Number(temp4.toFixed(1)),
        gas: 680,
        leakProbability: 98.4,
        leakTargetCm: targetD4,
        predictedDistNode4Cm: predictedD4,
        predictedDistNode5Cm: predictedD5,
        toleranceMinCm: tolMin,
        toleranceMaxCm: tolMax
      },
      node005: {
        ...prev.node005,
        status: 'Leak',
        pressure: Number(pressure5.toFixed(2)),
        acoustic: Number(acoustic5.toFixed(1)),
        temperature: Number(temp5.toFixed(1)),
        gas: 650,
        leakProbability: 97.8,
        leakTargetCm: targetD4,
        predictedDistNode4Cm: predictedD4,
        predictedDistNode5Cm: predictedD5,
        toleranceMinCm: tolMin,
        toleranceMaxCm: tolMax
      }
    }));
  };

  const changeAnalyticsTimeframe = (tf) => {
    setAnalyticsHistory(buildScientificAnalyticsHistory(flowMode, activeLeakCm, tf));
  };

  useEffect(() => {
    setIsUsingMock(!database);
    
    const initialNodes = generateInitialNodes();
    Object.keys(initialNodes).forEach(key => {
      initialNodes[key].status = 'Off';
      initialNodes[key].pressure = 0.00;
      initialNodes[key].acoustic = 0.0;
      initialNodes[key].gas = 0;
      initialNodes[key].temperature = 26.5;
      initialNodes[key].leakProbability = 0;
    });

    setNodes(initialNodes);
    setAlerts([]);
    setMetrics(generateGlobalMetrics());
    setCommunications(generateCommunicationsData());
    setAnalyticsHistory(buildScientificAnalyticsHistory('OFF', null, '24H'));
    setLoading(false);

    // Poll HTTP Bridge server on port 3001 for instant mobile remote commands
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`http://${window.location.hostname}:3001/api/remote`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.flowMode !== undefined) {
            applyRemoteState(data.flowMode, data.leakCm);
          }
        }
      } catch (err) {
        // Poll error ignored
      }
    }, 400);

    return () => {
      clearInterval(pollInterval);
    };
  }, []);

  const value = {
    nodes,
    alerts,
    metrics,
    communications,
    analytics: analyticsHistory,
    isUsingMock,
    loading,
    flowMode,
    activeLeakCm,
    applyRemoteState,
    changeAnalyticsTimeframe
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
