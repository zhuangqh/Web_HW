
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    logger = require('morgan'),
    FileStore = require('session-file-store')(session);

module.exports = function (db) {
  var app = express();
  // Configuration

  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false
  });
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(__dirname + '/public'));
  app.use(session({
    store: new FileStore(),
    resave: false,
    saveUninitialized: false,
    secret: 'homework 11',
    cookie: {maxAge: 86400000}
  }));

  // Routes

  app.get('/', routes.index);
  app.get('/partials/:name', routes.partials);

  // Database needed Routes
  var api = require('./routes/api')(db);
  app.use('/api/', api);

  // redirect all others to the index (HTML5 history)
  app.get('*', routes.index);

  return app;
};



