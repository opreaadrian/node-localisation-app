var mongoose              = require('mongoose'),
  database                = require('database'),
  bcrypt                  = require('bcrypt'),
  schema                  = mongoose.Schema,
  SALT_WORK_FACTOR        = 10,
  MAXIMUM_LOGIN_ATTEMPTS  = 5,
  LOCK_TIME               = 2 * 60 * 60 * 1000, // Time in miliseconds (2h)
  reasons                 = null;

var UserSchema = new Schema({
  name: String,
  username: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true
  },
  loginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  lockUntil: {
    type: Number
  }

});

UserSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePasswords = function(candidatePassword, fn) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return next(err);
    }

    fn(null, isMatch);
  });
};

UserSchema.methods.incrementLoginAttempts = function(fn) {
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

reasons = UserSchema.statics.failedLogin = {
  NOT_FOUND: 0,
  PASSWORD_INCORRECT: 1,
  MAXIMUM_ATTEMPTS_EXCEEDED: 2
};

UserSchema.statics.getAuthenticationStatus = function(username, password, fn) {
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

UserSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

module.exports = mongoose.model('User', UserSchema);
