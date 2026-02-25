const express = require('express');
const app = express();

const MAX_SIZE = 15 * 1024 * 1024; // 15MB in bytes

// Middleware to check content-type before parsing
app.use('/echo', (req, res, next) => {
  const contentType = req.get('Content-Type');
  
  if (!contentType || !contentType.includes('application/json')) {
    return res.status(415).json({
      error: 'Unsupported Media Type',
      message: 'Content-Type must be application/json',
      received: contentType || 'none'
    });
  }
  next();
});

// Parse JSON with size limit
app.use('/echo', express.json({ 
  limit: MAX_SIZE,
  strict: true
}));

// Handle JSON parsing errors
app.use('/echo', (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Invalid JSON',
      message: 'Request body contains invalid JSON'
    });
  }
  
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'Payload Too Large',
      message: 'Request body exceeds 15MB limit',
      maxSize: '15MB'
    });
  }
  
  next(err);
});

// Echo endpoint
app.post('/echo', (req, res) => {
  // Return the exact JSON payload received
  res.json(req.body);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    maxPayloadSize: '15MB',
    endpoint: '/echo'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`JSON Echo Server running on http://localhost:${PORT}`);
  console.log(`Echo endpoint: POST http://localhost:${PORT}/echo`);
  console.log(`Health check: GET http://localhost:${PORT}/health`);
  console.log(`Max payload size: 15MB`);
});
