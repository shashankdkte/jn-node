const express = require('express');
const morgan = require('morgan');
const rateLimit = require("express-rate-limit");
const toursRouter = require("./routes/tourRoutes");
const usersRouter = require("./routes/userRoutes");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const app = express();


// if (process.env.NODE_ENV === "development")
// {
  
//   app.use(morgan('dev'));
// }
app.use(morgan('dev'));

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);
  
app.use(express.json());

app.use(express.static(`${__dirname}/public`));
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

/** HANDLING UNHANDLED ROUTES*/
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;