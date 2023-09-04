const express = require('express');
const morgan = require('morgan');
const toursRouter = require("./routes/tourRoutes");
const usersRouter = require("./routes/userRoutes");

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



app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);


module.exports = app;