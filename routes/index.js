
/*
 * GET home page.
 */

var Crypt = require('../modules/cryptModule.js');

exports.index = function(req, res){

  var io = require('socket.io').listen(3000),
      phoneNo = req.params.phoneno,
      crypter = new Crypt(phoneNo),
      encodedKey = crypter.encode();

  if (encodedKey) {
    res.render(
      'index',
      {
        title: 'Node-Location',
        hash: encodedKey
      }
    );
  }

  io.sockets.on('connection', function(socket) {
    socket.emit('news', {key: 'hello'});
  });

};
