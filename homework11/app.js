
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    api = require('./routes/api'),
    session = require('express-session'),
    logger = require('morgan'),
    FileStore = require('session-file-store')(session);

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false
  });
  app.use(logger('dev'));
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(session({
    store: new FileStore(),
    resave: false,
    saveUninitialized: false,
    secret: 'homework 11',
    cookie: {maxAge: 86400000}
  }));
  app.use(app.router);
});


app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// Database Query API

app.get('/api/checkUnique', api.checkUnique);
app.get('/api/hasLogin', api.hasLogin);
app.post('/api/regist', api.regist);
app.post('/api/login', api.login);

// JSON API

app.get('/api/posts', api.posts);

app.get('/api/post/:id', api.post);
app.post('/api/post', api.addPost);
app.put('/api/post/:id', api.editPost);
app.delete('/api/post/:id', api.deletePost);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
