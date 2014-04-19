var crypto = require('crypto');

var Crypt = function(key) {
  this.key = key;
};

Crypt.prototype.encode = function() {

  var cipher = crypto.createCipher('aes-256-ecb', 'secret', ''),
      crypt = cipher.update(this.key, 'utf8', 'binary');

  crypt += cipher.final('binary');

  return crypt;
};

Crypt.prototype.decode = function() {

  var decipher = crypto.createDecipher('aes-256-ecb', 'secret', ''),
      crypt = decipher.update(this.key, 'binary', 'utf8');

  crypt += decipher.final('utf8');

  return crypt;

};

module.exports = Crypt;
