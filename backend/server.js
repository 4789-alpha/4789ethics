const express = require('express');
const apiAccessAllowed = require('../tools/api-access.js');

const app = express();
app.use(express.json());

app.get('/status', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/echo', (req, res) => {
  const msg = req.body.message || '';
  res.json({ reply: msg });
});

app.get('/ethics', (req, res) => {
  if (!apiAccessAllowed('OP-3')) {
    return res.status(403).json({ error: 'insufficient permissions' });
  }
  res.json({ module: 'ethics', ok: true });
});

const port = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
  });
}

module.exports = app;
