const express = require('express');
const app = express();

// CORS Middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Or restrict to your frontend domain
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Proxy Route
app.get('/proxy', async (req, res) => {
  try {
    // const response = await fetch('https://api.irishrail.ie/realtime/realtime.asmx/getCurrentTrainsXML');
    const response = await fetch('https://api.irishrail.ie/realtime/realtime.asmx/getCurrentTrainsXML_WithTrainType?TrainType=M');

    if (!response.ok) {
      console.error('API error:', response.statusText);
      return res.status(response.status).send('Remote API error: ' + response.statusText);
    }

    const contentType = response.headers.get('content-type') || 'text/plain';
    res.set('Content-Type', contentType);

    const data = await response.text();
    res.send(data);
  } catch (err) {
    console.error('Fetch failed:', err.message);
    res.status(500).send('Proxy failed: ' + err.message);
  }
});

app.listen(3000, () => {
  console.log('Proxy running at http://localhost:3000/proxy');
});
