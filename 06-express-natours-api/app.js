const express = require('express');
const morgan = require('morgan');
const toursRouter = require("./routes/tourRoutes");
const usersRouter = require("./routes/userRoutes");

const app = express();


// if (process.env.NODE_ENV === "development")
// {
  
//   app.use(morgan('dev'));
// }
app.use(morgan('dev'));
  
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

/* HANDLING UNHANDLED ROUTES*/
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Cant find ${req.originalUrl} on this server`,
  });
});

module.exports = app;