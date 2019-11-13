const express = require('express');
require('dotenv').config();
const app = express();
const BulbService = require('./services/bulb_service');

const service = new BulbService(
  process.env.DEVICE_ID,
  process.env.DEVICE_KEY,
  process.env.DEVICE_IP
);

app.get('/', async function(req, res) {
  res.json(await service.getInfo());
});

app.get('/toggle', async function(req, res) {
  res.json(await service.toggle());
});

app.get('/colour', async function(req, res) {
  res.json(await service.colour());
});

app.get('/white', async function(req, res) {
  res.json(await service.white());
});

app.get('/white/:level', async function(req, res) {
  res.json(await service.whiteBrightness(req.params.level));
});

app.listen(3000, async function() {
  await service.disconnect();
  for (const {} of [...Array(5).keys()]) {
    try {
      const result = await service.connect();
      if (result) {
        console.log('Connected to device!');
        break;
      }
    } catch {}
  }
  console.log('Listening on port 3000!');
});
