const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const PORT = 3000;

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
  console.log('Hello from middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: tours,
  });
};

const getTour = (req, res) => {
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

const updateTour = (req, res) => {
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

const deleteTour = (req, res) => {
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

const createTour = (req, res) => {
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

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'fail',
    data: 'Not available',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    data: 'Not available',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    data: 'Not available',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    data: 'Not available',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    data: 'Not available',
  });
};

const toursRouter = express.Router();
const usersRouter = express.Router();

toursRouter.route('/').get(getAllTours).post(createTour);
toursRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

usersRouter.route('/').get(getAllUsers).post(createUser);
usersRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});