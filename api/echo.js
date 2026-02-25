const MAX_SIZE = 15 * 1024 * 1024; // 15MB

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only POST method is supported'
    });
  }

  // Check Content-Type
  const contentType = req.headers['content-type'];
  if (!contentType || !contentType.includes('application/json')) {
    return res.status(415).json({
      error: 'Unsupported Media Type',
      message: 'Content-Type must be application/json',
      received: contentType || 'none'
    });
  }

  // Check size (Vercel has 4.5MB limit for serverless functions)
  const bodySize = JSON.stringify(req.body).length;
  if (bodySize > MAX_SIZE) {
    return res.status(413).json({
      error: 'Payload Too Large',
      message: 'Request body exceeds 15MB limit',
      maxSize: '15MB'
    });
  }

  // Validate JSON (Vercel auto-parses, but check if valid)
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({
      error: 'Invalid JSON',
      message: 'Request body contains invalid JSON'
    });
  }

  // Echo back the JSON
  return res.status(200).json(req.body);
};
