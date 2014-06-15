var LocalStrategy   = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    User            = require('./../models/user'),
    authConfig = require('./../config/auth');

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
   * JavaScript object, which properties are easier to access.
   * @param  {String}   id The User ID for which the configuration needs to be retrieved
   * @param  {Function} done The callback that getsexecuted once the operation completed
   */
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup',
    new LocalStrategy({
      usernameField       : 'email',
      passwordField       : 'password',
      passReqToCallback   : true
    }, function(req, email, password, done) {
      process.nextTick(function() {
        User.findOne({'local.email' : email}, function(err, user) {
          if (err) {
            return done(err);
          }

          if (user) {
            return done(null, false, req.flash('signupMessage', 'That email is already taken!'));
          } else {
            var newUser             = new User();

            newUser.local.email     = email;
            newUser.local.password  = password;

            newUser.save(function(err) {
              if (err) {
                throw err;
              }

              return done(null, newUser);
            });
          }
        });
      });
    })
    );
};
