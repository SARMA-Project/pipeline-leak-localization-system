import http from 'http';

let currentState = {
  flowMode: 'OFF', // 'OFF' | 'ON'
  leakCm: null,   // null | 10..100
  updatedAt: Date.now()
};

const server = http.createServer((req, res) => {
  // CORS Headers so phone on Wi-Fi and laptop can connect freely
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/remote') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (data.flowMode !== undefined) currentState.flowMode = data.flowMode;
        if (data.leakCm !== undefined) currentState.leakCm = data.leakCm;
        currentState.updatedAt = Date.now();
        
        console.log(`[Remote Command Received] Flow: ${currentState.flowMode}, Leak: ${currentState.leakCm} cm`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, state: currentState }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else if (req.method === 'GET' && req.url === '/api/remote') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(currentState));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const PORT = 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`📡 Remote Sync Bridge running on http://0.0.0.0:${PORT}/api/remote`);
});
