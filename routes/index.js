
/*
 * GET home page.
 */

var crypto = require('crypto');

function encode(key) {

  var cipher = crypto.createCipher('aes-256-ecb', 'secret', ''),
      crypt = cipher.update(key, 'utf8', 'binary');

  crypt += cipher.final('binary');

  return crypt;
}

function decode(key) {

  var decipher = crypto.createDecipher('aes-256-ecb', 'secret', ''),
      crypt = decipher.update(key, 'binary', 'utf8');

  crypt += decipher.final('utf8');

  return crypt;

}

exports.index = function(req, res){

  var io = require('socket.io').listen(3000),
      phoneNo = req.params.phoneno,

      encodedKey = encode(phoneNo);



  if (encodedKey) {
    res.render(
      'index',
      {
        title: 'Node-Location',
        hash: encodedKey,
        phone: decode(encodedKey)
      }
    );
  }

  io.sockets.on('connection', function(socket) {
    socket.emit('news', {key: 'hello'});
  });

};
