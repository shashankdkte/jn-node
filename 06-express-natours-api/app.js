const express = require('express');
const fs = require('fs');
const PORT = 3000;

const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: tours,
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
  const { id } = req.params;

  const tour = tours.find((x) => x.id === +id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
    });
  }
  res.status(200).json({
    status: 'success',
    tour: tour,
  });
});

app.patch('/api/v1/tours/:id', (req, res) => {
  const { id } = req.params;
  const updatedTour = req.body;

  const tour = tours.find((x) => x.id === +id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
    });
  }
  res.status(200).json({
    status: 'success',
    tour: updatedTour,
  });
});

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: newTour,
      });
    }
  );
});
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});