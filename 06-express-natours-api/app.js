const express = require('express');
const PORT = 3000;

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('This is home');
});

app.get('/tours', (req, res) => {
  res.status(200).send('This is tours');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});