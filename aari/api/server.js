const express = require('express');
const app = express();
app.use(express.json());
app.post('/chat', (req, res) => {
  const msg = req.body.message || '';
  res.json({reply: `Echo: ${msg}`});
});
module.exports = app;
