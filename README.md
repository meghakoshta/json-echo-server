# JSON Echo Server

A simple server that echoes back JSON payloads with validation.

## Features

- Returns the exact JSON payload sent in the request
- Validates `Content-Type: application/json` header
- Rejects payloads larger than 15MB
- Validates JSON syntax

## Setup

```bash
cd "New folder (3)/json-echo-server"
npm install
npm start
```

Or run directly:
```bash
node echo-server.js
```

## Usage

### Echo Endpoint
```bash
curl -X POST http://localhost:3000/echo \
  -H "Content-Type: application/json" \
  -d '{"test": "data", "number": 123}'
```

### Health Check
```bash
curl http://localhost:3000/health
```

## Error Responses

### Missing Content-Type (415)
```json
{
  "error": "Unsupported Media Type",
  "message": "Content-Type must be application/json",
  "received": "none"
}
```

### Invalid JSON (400)
```json
{
  "error": "Invalid JSON",
  "message": "Request body contains invalid JSON"
}
```

### Payload Too Large (413)
```json
{
  "error": "Payload Too Large",
  "message": "Request body exceeds 15MB limit",
  "maxSize": "15MB"
}
```

## Testing

Test with valid JSON:
```bash
curl -X POST http://localhost:3000/echo \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello World"}'
```

Test without Content-Type:
```bash
curl -X POST http://localhost:3000/echo \
  -d '{"message": "Hello World"}'
```

Test with invalid JSON:
```bash
curl -X POST http://localhost:3000/echo \
  -H "Content-Type: application/json" \
  -d '{invalid json}'
```
