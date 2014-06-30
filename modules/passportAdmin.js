var LocalStrategy    = require('passport-local').Strategy,
    Administrator    = require('./../models/administrator'),
    authConfig       = require('./../config/auth');

module.exports = function(passport) {
  'use strict';
  /**
   * @method serializeUser Converts the user data to a string representation
   * @param  {Object}   user The User object that is trying to be set in the DB
   * @param  {Function} done The callback that gets executed once the operation completed
   */
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  /**
   * @method deserializeUser Converts the string representation of a user from the database to an actual
   * JavaScript object, whose properties are easier to access.
   * @param  {String}   id The User ID for which the configuration needs to be retrieved
   * @param  {Function} done The callback that getsexecuted once the operation completed
   */
  passport.deserializeUser(function(id, done) {
    Administrator.findById(id, function(err, user) {
      done(err, user);
    });
  });

  /**
   * Administrator login
   */
  passport.use('admin-login', new LocalStrategy({
    usernameField     : 'email',
    passwordField     : 'password',
    passReqToCallback : true
  }, function(req, email, password, done) {

    process.nextTick(function() {
      Administrator.findOne({'email': email}, function(err, user) {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false, req.flash('loginMessage', 'No user found!'));
        }

        if (!user.validPassword(password)) {
          user.incrementLoginAttempts(null);
          return done(null, false, req.flash('loginMessage', 'You inserted a wrong password!'));
        } else {
          return done(null, user);
        }
      });
    });
  }));

  /**
   * Admin registration strategy
   */
  passport.use('admin-registration', new LocalStrategy({
      usernameField       : 'email',
      passwordField       : 'password',
      passReqToCallback   : true
    }, function(req, email, password, done) {
      process.nextTick(function() {
        Administrator.findOne({'email' : email}, function(err, existingUser) {
          if (err) {
            return done(err);
          }

          if (existingUser) {
            return done(null, false, req.flash('registrationMessage', 'This account already exists!'));
          }

          if (req.user) {
            var user = req.user;

            user.email = email;
            user.password = user.generateHash(password);

            user.save(function(err) {
              if (err) {
                throw err;
              }

              return done(null, user);
            });
          }
          else {
            var newUser             = new Administrator();

            newUser.email     = email;
            newUser.password  = newUser.generateHash(password);

            newUser.save(function(err) {
              if (err) {
                throw err;
              }

              return done(null, newUser);
            });
          }
        });
      });
    }));
};

