import React, { useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useFirebase } from '../contexts/FirebaseContext';
import { Cpu, Maximize2, Target, AlertTriangle } from 'lucide-react';

const createIcon = (color) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${color};"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

const icons = {
  Healthy: createIcon('#10b981'),
  Warning: createIcon('#f59e0b'),
  Leak: createIcon('#ef4444'),
  Offline: createIcon('#868e96'),
};

export const LiveMap = () => {
  const { nodes, loading } = useFirebase();
  const mapRef = useRef(null);

  const { pipelinePath, markers, leakNodes } = useMemo(() => {
    if (!nodes) return { pipelinePath: [], markers: [], leakNodes: [] };
    
    const nodesList = Object.values(nodes).sort((a, b) => a.id.localeCompare(b.id));
    const path = nodesList.map(n => [n.latitude, n.longitude]);
    const leakNodes = nodesList.filter(n => n.leakProbability > 80 || n.status === 'Leak');
    
    return { pipelinePath: path, markers: nodesList, leakNodes };
  }, [nodes]);

  // Quick Focus Actions
  const focusNode4And5 = () => {
    if (mapRef.current && markers.length >= 5) {
      const n4 = markers[3]; // Node 4
      const n5 = markers[4]; // Node 5
      const midLat = (n4.latitude + n5.latitude) / 2;
      const midLng = (n4.longitude + n5.longitude) / 2;
      mapRef.current.flyTo([midLat, midLng], 15, { duration: 1.5 });
    }
  };

  const focusFullRoute = () => {
    if (mapRef.current && markers.length > 0) {
      const midLat = markers[Math.floor(markers.length / 2)].latitude;
      const midLng = markers[Math.floor(markers.length / 2)].longitude;
      mapRef.current.flyTo([midLat, midLng], 11, { duration: 1.5 });
    }
  };

  if (loading) return <div className="text-steel-900 p-6">Loading Map...</div>;

  const defaultCenter = markers.length > 0 ? [markers[Math.floor(markers.length/2)].latitude, markers[Math.floor(markers.length/2)].longitude] : [11.342345, 77.712344];

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-steel-900">Geospatial Pipeline GIS Map</h1>
          <p className="text-sm text-steel-500">Interactive satellite view with free map pan & zoom controls</p>
        </div>
        
        {/* Quick Camera Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={focusNode4And5}
            className="btn-primary text-xs flex items-center space-x-1.5 font-bold shadow-md bg-brand-danger hover:bg-brand-danger/90"
          >
            <Target className="w-4 h-4" />
            <span>Focus Segment: Node 4 & Node 5</span>
          </button>
          
          <button
            onClick={focusFullRoute}
            className="btn-secondary text-xs flex items-center space-x-1.5 font-bold shadow-sm"
          >
            <Maximize2 className="w-4 h-4 text-steel-600" />
            <span>View Full Route (All Nodes)</span>
          </button>
        </div>
      </div>

      <div className="flex-1 glass-panel rounded-xl overflow-hidden relative border border-steel-200 shadow-glass">
        {leakNodes.length > 0 && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-brand-danger text-white px-5 py-2.5 rounded-full shadow-neon-red font-bold flex items-center space-x-2 animate-pulse text-xs">
            <AlertTriangle className="w-4 h-4" />
            <span>LEAK DETECTED: NODE 4 ── NODE 5 SEGMENT</span>
          </div>
        )}

        <MapContainer 
          ref={mapRef}
          center={defaultCenter} 
          zoom={11} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          dragging={true}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='Tiles &copy; Esri'
          />

          {/* Render Pipeline Polyline */}
          <Polyline 
            positions={pipelinePath} 
            color={leakNodes.length > 0 ? "#ef4444" : "#0ea5e9"} 
            weight={5}
            opacity={0.8}
            className={leakNodes.length > 0 ? "animate-pulse" : ""}
          />

          {/* Render Markers */}
          {markers.map((node) => {
            let status = node.status;
            if (node.leakProbability > 80) status = 'Leak';

            const predDist4Meters = node.predictedDistNode4Cm !== undefined && node.predictedDistNode4Cm !== null 
              ? (node.predictedDistNode4Cm / 100).toFixed(2)
              : null;

            return (
              <React.Fragment key={node.id}>
                {status === 'Leak' && (
                  <Circle 
                    center={[node.latitude, node.longitude]} 
                    pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.3, weight: 2 }} 
                    radius={150} 
                  />
                )}
                <Marker 
                  position={[node.latitude, node.longitude]}
                  icon={icons[status] || icons.Offline}
                >
                  <Popup className="industrial-popup">
                    <div className="p-2 min-w-[220px]">
                      <div className="flex items-center justify-between border-b border-steel-200 pb-2 mb-3">
                        <span className="font-bold text-steel-900 flex items-center gap-2 text-sm">
                          <Cpu className="w-4 h-4 text-brand-primary" />
                          {node.id.toUpperCase()}
                        </span>
                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                          status === 'Leak' ? 'bg-brand-danger/10 text-brand-danger border border-brand-danger/30' : 
                          status === 'Healthy' ? 'bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/30' : 'bg-steel-100 text-steel-600'
                        }`}>
                          {status}
                        </span>
                      </div>
                      
                      <p className="text-xs text-brand-primary font-bold mb-3">{node.locationName}</p>
                      
                      <div className="grid grid-cols-2 gap-y-2 text-xs">
                        <span className="text-steel-500 font-medium">Pressure</span>
                        <span className="text-steel-900 font-bold text-right">{node.pressure.toFixed(2)} bar</span>
                        
                        <span className="text-steel-500 font-medium">Acoustic</span>
                        <span className="text-steel-900 font-bold text-right">{node.acoustic.toFixed(1)} dB</span>
                        
                        <span className="text-steel-500 font-medium">Temperature</span>
                        <span className="text-steel-900 font-bold text-right">{node.temperature.toFixed(1)} °C</span>
                      </div>
                      
                      {status === 'Leak' && predDist4Meters && (
                        <div className="mt-3 pt-2 border-t border-steel-200 text-xs">
                          <span className="text-steel-500 font-medium">Distance from Node 4:</span>
                          <p className="font-bold text-brand-danger">{predDist4Meters} meters (±0.04 m)</p>
                        </div>
                      )}
                    </div>
                  </Popup>
                  {['Erode Hub Station', 'Tiruppur Relay Station', 'Coimbatore Terminal'].includes(node.locationName) && (
                    <Tooltip direction="right" offset={[10, 0]} opacity={0.9} permanent className="bg-white/90 border-0 shadow-sm text-steel-900 font-bold text-xs px-2 py-1">
                      {node.locationName}
                    </Tooltip>
                  )}
                </Marker>
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};
