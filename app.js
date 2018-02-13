const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const compression = require('compression')
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var validator = require('express-validator');
var session = require('express-session');
const config = require('./config');
const db = require('./database');

var logger = require("./utils/logger");

const index = require('./routes/index');
const query = require('./routes/query');
const user = require('./routes/users');

const User = require('./models/user');

const app = express();
logger.debug("Enabling GZip compression.");

app.use(compression({
  threshold: 512
}));

const dbUrl = config.db.uri;

logger.debug("Setting 'Jade' as view engine");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

logger.debug("Overriding 'Express' logger");
app.use(require('morgan')({ "stream": logger.stream }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(session({ secret: 'max', saveUninitialized: false, resave: false }));
app.set('superSecret', config.secret);
app.set('expiresIn', config.tokenExpiresIn);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

logger.debug("Configuring MongoDB");
db.connect(dbUrl)
  .then(() => {
    console.log('Connected to Mongo DB!')
    console.log('Server up at port %d', config.port)
  })
  .catch(err => {
    console.error('Could not connect to Mongo database', err)
    process.exit(0)
  });

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = express.Router();

app.get('/setup', function (req, res) {

  // create a sample user
  var newUser = new User({
    name: 'near3bot',
    password: 'password',
    admin: true
  });
  newUser.save(function (err) {
    if (err) throw err;
    res.json({ success: true });
  });
});

apiRoutes.post('/authenticate', function (req, res) {
  User.findOne({
    name: req.body.name
  }, function (err, user) {
    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        var payload = {
          admin: user.admin
        }
        var token = jwt.sign(payload, app.get('superSecret'), {
          expiresIn: app.get('expiresIn')
        });

        res.json({
          success: true,
          expiresIn: app.get('expiresIn'),
          token: token
        });
      }
    }
  });
});

apiRoutes.use(function (req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.param('token') || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function (err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

app.use('/api', apiRoutes);
apiRoutes.use('/query', query);
// app.use('/user', user);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  logger.error(err.message);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
