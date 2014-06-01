
/**
 * Module dependencies.
 */

var express   = require('express'),
    app       = express(),
    routes    = require('./routes'),
    gethelp   = require('./routes/gethelp'),
    http      = require('http'),
    path      = require('path'),
    server    = http.createServer(app),
    io        = require('socket.io').listen(server),
    ejs       = require('ejs').renderFile,
    mongoose  = require('mongoose'),
    flash   = require('connect-flash'),
    passport  = require('passport'),
    database  = require('./models/database'),
    User      = require('./models/user');



// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', ejs);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'somethingsinlifemanjustdontchange'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

server.listen(app.get('port'), function(){
  'use strict';

  console.log('Express server listening on port ' + app.get('port'));
});

app.get('/', routes.index);
app.get('/get-help', gethelp.index);
app.post('/get-help', gethelp.send);

app.get('/users/:details', function(req, res) {
  'use strict';

  var detailsOb = JSON.parse(req.params.details),
      db        = database();
  var testUser = new User(detailsOb);

  testUser.save(function(err) {
    if (err) {
      throw err;
    }

    User.getAuthenticationStatus(testUser.username, testUser.password, function(err, user, reason) {
      if (err) {
        throw err;
      }

      if (user) {
        res.send(decodeURIComponent(JSON.stringify(detailsOb)));
        return;
      }

      var reasons = User.failedLogin;

      switch (reason) {
        case reasons.NOT_FOUND:
        case reasons.PASSWORD_INCORRECT:
          break;
        case reasons.MAXIMUM_ATTEMPTS_EXCEEDED:
          break;
      }
    });
  });

});

io.sockets.on('connection', function(socket) {
  'use strict';

  socket.emit('connected', {notification: 'hello'});
  socket.on('localized', function(data) {
    console.log(data);
  });
});
