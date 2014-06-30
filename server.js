var express  = require('express'),
    app      = express(),
    routes   = require('./routes'),
    gethelp  = require('./routes/gethelp'),
    admin    = require('./routes/admin'),
    http     = require('http'),
    path     = require('path'),
    server   = http.createServer(app),
    io       = require('socket.io').listen(server),
    ejs      = require('ejs').renderFile,
    mongoose = require('mongoose'),
    flash    = require('connect-flash'),
    passport = require('passport'),
    database = require('./models/database')();

require('./modules/passportUser')(passport);
require('./modules/passportAdmin')(passport);

/**
 * Setup for all environments
 */
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', ejs);
app.use(express.favicon());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'somethingsinlifemanjustdontchange'}));
app.use(flash()); // Use connect-flash for flash messages that are stored in the session
app.use(passport.initialize());
app.use(passport.session());  // Persistent login sessions
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Setup for development environment
 */
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
  app.use(express.logger('dev'));
}

/**
 *Start listening for the specified port
 */
server.listen(app.get('port'), function(){
  'use strict';

  console.log('Express server listening on port ' + app.get('port'));
});

/**
 * Declare application routes
 */
app.get('/', routes.index);

app.get('/get-help', gethelp.index);
app.post('/get-help', gethelp.send);


app.get('/login', function(req, res) {
  'use strict';

  res.render('login/login', {
    message   : req.flash('loginMessage'),
    session   : req.session,
    pageTitle : 'Log In',
    scripts   : []
  });
});

app.post('/login', passport.authenticate('local-login', {
  successRedirect : '/profile', // redirect to the secure profile section
  failureRedirect : '/login', // redirect back to the signup page if there is an error
  failureFlash    : true // allow flash messages
}));

/**
 * Application administrator login
 */
app.get('/admin/login', function(req, res) {
  'use strict';

  res.render('admin/login', {
    message   : req.flash('loginMessage'),
    session   : req.session,
    pageTitle : 'Admin panel login',
    scripts   : []
  });
});

app.post('/admin/login', passport.authenticate('admin-login', {
  successRedirect : '/admin/dashboard', // redirect to the secure profile section
  failureRedirect : '/admin/login', // redirect back to the signup page if there is an error
  failureFlash    : true // allow flash messages
}));

app.get('/admin/dashboard', admin.dashboard);


/**
 * App manager routes
 * TODO To be moved in separate application that creates new accounts, manages current accounts,
 * starts up new applications for customers (bootstrap/provision)
 */
app.get('/manager/registration', function(req, res) {
  'use strict';
  res.render('manager/registration', {
    pageTitle : 'Register a new customer',
    session   : req.session,
    message   : req.flash('registrationMessage'),
    scripts   : []
  });
});

app.post('/manager/registration', passport.authenticate('admin-registration', {
  successRedirect : '/',
  failureRedirect : '/manager/registration',
  failureFlash    : true
}));

/**
 * Local auth routes
 * TODO Should be moved to separate routes module
 */
app.get('/signup', function(req, res) {
  'use strict';

  res.render('registration/sign-up', {
    pageTitle : 'Sign up form',
    session   : req.session,
    message   : req.flash('signupMessage'),
    scripts   : []
  });
});

app.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/profile',
  failureRedirect : '/signup',
  failureFlash    : true
}));

/**
 * Local authorization (account linking)
 */
app.get('/connect/local', function(req, res) {

  'use strict';
  res.render('registration/connect-local', {
    message   : req.flash('loginMessage'),
    session   : req.session,
    pageTitle : 'Local connection',
    scripts   : []
  });
});

app.post('/connect/local', passport.authenticate('local-signup', {
  successRedirect : '/profile',
  failureRedirect : '/connect/local',
  failureFlash    : true
}));

require('./routes/user')(app, passport);


/**
 * Start realtime communication (socket.io)
 */
io.sockets.on('connection', function(socket) {
  'use strict';

  socket.emit('connected', {notification: 'hello'});
  socket.on('localized', function(data) {
    console.log(data);
  });
});

