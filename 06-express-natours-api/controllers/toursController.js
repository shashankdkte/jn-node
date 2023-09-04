const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: tours,
  });
};

exports.getTour = (req, res) => {
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
};

exports.updateTour = (req, res) => {
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
};

exports.deleteTour = (req, res) => {
  const { id } = req.params;

  const tour = tours.find((x) => x.id === +id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

exports.createTour = (req, res) => {
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
};
