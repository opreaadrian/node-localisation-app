var fs = require('fs'),
  mapsApiKey = JSON.parse(fs.readFileSync(__dirname + '/../mapsapiconfig.json')).apiKey,
  twilio = JSON.parse(fs.readFileSync( __dirname + '/../twilio.json'));

/*
 * GET home page.
 */

exports.index = function (req, res) {

  res.render('index', {
    pageTitle: 'Emergency service',
    title: 'Emergency service',
    scripts: [
      '//maps.googleapis.com/maps/api/js?key=' + mapsApiKey + '&sensor=true',
      'javascripts/mapinit.js'
    ]
  });
};
var Crypt = require('../modules/cryptModule.js');

// exports.index = function(req, res){

//   var io = require('socket.io').listen(3000),
//       phoneNo = req.params.phoneno,
//       crypter = new Crypt(phoneNo),
//       encodedKey = crypter.encode();

//   if (encodedKey) {
//     res.render(
//       'index',
//       {
//         title: 'Node-Location',
//         hash: encodedKey
//       }
//     );
//   }

//   io.sockets.on('connection', function(socket) {
//     socket.emit('news', {key: 'hello'});
//   });

// };
