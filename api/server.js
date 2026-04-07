const express = require('express');
const app = express();

app.use(express.json({ limit: '15mb' }));

const echo = require('./api/echo');
app.all('/api/echo', echo);

app.listen(process.env.PORT || 3000);
