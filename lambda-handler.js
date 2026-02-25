const MAX_SIZE = 15 * 1024 * 1024; // 15MB

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
  };

  // Handle OPTIONS for CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Check Content-Type
  const contentType = event.headers['Content-Type'] || event.headers['content-type'];
  if (!contentType || !contentType.includes('application/json')) {
    return {
      statusCode: 415,
      headers,
      body: JSON.stringify({
        error: 'Unsupported Media Type',
        message: 'Content-Type must be application/json',
        received: contentType || 'none'
      })
    };
  }

  // Check size
  const bodySize = Buffer.byteLength(event.body || '', 'utf8');
  if (bodySize > MAX_SIZE) {
    return {
      statusCode: 413,
      headers,
      body: JSON.stringify({
        error: 'Payload Too Large',
        message: 'Request body exceeds 15MB limit',
        maxSize: '15MB'
      })
    };
  }

  // Parse and validate JSON
  try {
    const jsonBody = JSON.parse(event.body);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(jsonBody)
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: 'Invalid JSON',
        message: 'Request body contains invalid JSON'
      })
    };
  }
};

exports.health = async () => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      status: 'ok',
      maxPayloadSize: '15MB',
      endpoint: '/echo'
    })
  };
};
