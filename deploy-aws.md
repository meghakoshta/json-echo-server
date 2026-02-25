# Deploy to AWS Lambda + API Gateway

## Quick Deploy with Serverless Framework

1. Install Serverless Framework:
   ```bash
   npm install -g serverless
   ```

2. Create `serverless.yml` in the json-echo-server folder

3. Create `lambda-handler.js` (see below)

4. Deploy:
   ```bash
   serverless deploy
   ```

You'll get a public API Gateway URL.

## Files Needed

### serverless.yml
```yaml
service: json-echo-api

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1

functions:
  echo:
    handler: lambda-handler.handler
    events:
      - http:
          path: echo
          method: post
          cors: true
  health:
    handler: lambda-handler.health
    events:
      - http:
          path: health
          method: get
          cors: true
```

### lambda-handler.js
```javascript
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
```

## Deploy Steps

```bash
cd "New folder (3)/json-echo-server"
npm install -g serverless
serverless deploy
```

Output will show your public URL:
```
endpoints:
  POST - https://abc123.execute-api.us-east-1.amazonaws.com/dev/echo
  GET - https://abc123.execute-api.us-east-1.amazonaws.com/dev/health
```

## Test Your Deployment

```bash
curl -X POST https://your-api-url/dev/echo \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello from AWS!"}'
```
