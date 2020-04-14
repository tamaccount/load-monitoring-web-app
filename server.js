const express = require('express');
var os = require('os');

const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

app.get('/cpu', (req, res) => {
  const cpus = os.cpus().length;
  const loadAverage = os.loadavg()[0] / cpus;
  res.send({
    cpu: loadAverage,
    dateTime: Date.now()
  });
});
