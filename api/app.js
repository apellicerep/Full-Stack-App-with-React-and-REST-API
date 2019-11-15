'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
var sequelize = require('./models').sequelize;
// Import cors library
const cors = require('cors');


// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

//testing sequelize connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


//routes

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/api/users');
var coursesRouter = require('./routes/api/courses');


// Enable all CORS Requests
app.use(cors());

// setup morgan which gives us http request logging
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter)
app.use('/api/users', usersRouter)
app.use('/api/courses', coursesRouter)


// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  console.log(err.message)
  res.status(err.status || 500).json({
    message: err.message
  });
});

// set our port
app.set('port', process.env.PORT || 5000);


// start listening on our port
sequelize.sync().then(() => {
  app.listen(app.get('port'), () => {
    console.log(`Express server is listening on port ${app.get('port')}`);
  })
});

