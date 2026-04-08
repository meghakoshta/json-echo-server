const express = require('express');
const app = express();

app.use(express.json({ limit: '15mb' }));

// Disable compression for all responses
app.use((req, res, next) => {
  res.setHeader('Content-Encoding', 'identity');
  res.setHeader('Cache-Control', 'no-transform');
  next();
});

const echo = require('./api/echo');
app.all('/api/echo', echo);

app.listen(process.env.PORT || 3000);

