
/**
 * Module dependencies.
 */

var express = require('express'),
    app = express(),
    routes = require('./routes'),
    gethelp = require('./routes/gethelp'),
    http = require('http'),
    path = require('path'),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    ejs = require('ejs').renderFile;



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
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

app.get('/', routes.index);
app.get('/get-help', gethelp.index);
app.post('/get-help', gethelp.send);

io.sockets.on('connection', function(socket) {
  socket.emit('connected', {notification: 'hello'});
  socket.on('localized', function(data) {
    console.log(data);
  });
});
