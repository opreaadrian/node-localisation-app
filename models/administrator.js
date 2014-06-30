/* global next */
var mongoose               = require('mongoose'),
    bcrypt                 = require('bcrypt'),
    Schema                 = mongoose.Schema,
    SALT_WORK_FACTOR       = 10,
    MAXIMUM_LOGIN_ATTEMPTS = 5,
    LOCK_TIME              = 2 * 60 * 60 * 1000, // Time in miliseconds (2h)
    reasons                = null;

var AdminSchema = new Schema({

  email        : String,
  password     : String,

  loginAttempts  : {
    type         : Number,
    required     : true,
    default      : 0
  },

  lockUntil     : {
    type        : Number
  }

});

// generating a hash
AdminSchema.methods.generateHash = function(password) {
  'use strict';
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
AdminSchema.methods.validPassword = function(password) {
  'use strict';
    return bcrypt.compareSync(password, this.password);
};

AdminSchema.methods.incrementLoginAttempts = function(fn) {
  'use strict';

  var updates = null;

  if (this.lockUntil && this.lockUntil > Date.now()) {
    return this.update({
      $set: {loginAttempts: 1},
      $unset: {lockUntil: 1}
    }, fn);
  }

  updates = {$inc: {loginAttempts: 1}};

  if (this.loginAttempts + 1 >= MAXIMUM_LOGIN_ATTEMPTS && !this.isLocked) {
    updates.$set = {lockUntil: Date.now() + LOCK_TIME};
  }

  return this.update(updates, fn);
};

reasons = AdminSchema.statics.failedLogin = {
  NOT_FOUND                 : 0,
  PASSWORD_INCORRECT        : 1,
  MAXIMUM_ATTEMPTS_EXCEEDED : 2
};

AdminSchema.statics.getAuthenticationStatus = function(username, password, fn) {
  'use strict';

  this.findOne({ username: username }, function(err, user) {
    if (err) {
      return fn(err);
    }

    if (!user) {
      return fn(null, null, reasons.NOT_FOUND);
    }

    if (user.isLocked) {
      return user.incrementLoginAttempts(function(err) {
        if (err) {
          return fn(err);
        }

        return fn(null, null, reasons.MAXIMUM_LOGIN_ATTEMPTS);
      });
    }
  });
};

AdminSchema.virtual('isLocked').get(function() {
  'use strict';

  return !!(this.lockUntil && this.lockUntil > Date.now());
});

module.exports = mongoose.model('Administrator', AdminSchema);
