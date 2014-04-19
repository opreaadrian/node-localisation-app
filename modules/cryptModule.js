/* Require our dependencies*/
var crypto = require('crypto');

/**
 * @module Crypt The main constructor for our encrypter
 * @constructor
 *
 * @param {string} key The key to be encrypted
 */
var Crypt = function(key) {
  this.key = key;
};


/**
 * @method encode Carries the responsibility of turning the key into an 256b
 * encrypted AES key
 *
 * @return {string} crypt The encrypted version of the key
 *
 */
Crypt.prototype.encode = function() {
  var cipher = crypto.createCipher('aes-256-ecb', 'secret', ''),
      crypt = cipher.update(this.key, 'utf8', 'binary');

  crypt += cipher.final('binary');

  return crypt;
};

/**
 * @method encode Carries the responsibility of turning the key from a  256b
 * encrypted AES key back to a regular UTF-8 string
 *
 * @return {string} crypt The decrypted version of the key
 *
 */
Crypt.prototype.decode = function() {
  var decipher = crypto.createDecipher('aes-256-ecb', 'secret', ''),
      crypt = decipher.update(this.key, 'binary', 'utf8');

  crypt += decipher.final('utf8');

  return crypt;
};

module.exports = Crypt;
