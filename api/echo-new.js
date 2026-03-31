const MAX_SIZE = 15 * 1024 * 1024; // 15MB

export default async (request, context) => {

  // Handle OPTIONS for CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  // Only allow POST
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({
      error: 'Method Not Allowed',
      message: 'Only POST method is supported'
    }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Check Content-Type
  const contentType = request.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return new Response(JSON.stringify({
      error: 'Unsupported Media Type',
      message: 'Content-Type must be application/json',
      received: contentType || 'none'
    }), {
      status: 415,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let body;

  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({
      error: 'Invalid JSON',
      message: 'Request body contains invalid JSON'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Check size
  const bodySize = JSON.stringify(body).length;
  if (bodySize > MAX_SIZE) {
    return new Response(JSON.stringify({
      error: 'Payload Too Large',
      message: 'Request body exceeds 15MB limit',
      maxSize: '15MB'
    }), {
      status: 413,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Echo back the JSON
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
};
