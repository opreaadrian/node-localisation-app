var LocalStrategy    = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    TwitterStrategy  = require('passport-twitter').Strategy,
    GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy,
    User             = require('./../models/user'),
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
   * JavaScript object, which properties are easier to access.
   * @param  {String}   id The User ID for which the configuration needs to be retrieved
   * @param  {Function} done The callback that getsexecuted once the operation completed
   */
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  /**
   * Local registration strategy configuration
   */
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
    }));

  /**
   * Facebook auth strategy configuration
   */
  passport.use(new FacebookStrategy({

    clientID     : authConfig.facebookAuth.clientID,
    clientSecret : authConfig.facebookAuth.clientSecret,
    callbackURL  : authConfig.facebookAuth.callbackURL

  }, function(token, refreshToken, profile, done) {
    process.nextTick(function() {
      User.findOne({'facebook.id' : profile.id}, function(err, user) {
        if (err) {
          return done(err);
        }

        if (user) {
          return done(null, user);
        } else {
          var newUser = new User();

          newUser.facebook.id    = profile.id;
          newUser.facebook.token = token;
          newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
          newUser.facebook.email = profile.emails[0].value;

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

  /**
   * Twitter auth strategy configuration
   */

  passport.use(new TwitterStrategy({

    consumerKey    : authConfig.twitterAuth.consumerKey,
    consumerSecret : authConfig.twitterAuth.consumerSecret,
    callbackURL    : authConfig.twitterAuth.callbackURL

  }, function(token, refreshToken, profile, done) {
    process.nextTick(function() {
      User.findOne({'twitter.id' : profile.id}, function(err, user) {
        if (err) {
          return done(err);
        }

        if (user) {
          return done(null, user);
        } else {
          var newUser = new User();

          newUser.twitter.id    = profile.id;
          newUser.twitter.token = token;
          newUser.twitter.username  = profile.username;
          newUser.twitter.displayName = profile.displayName;

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

  /**
   * Google auth strategy configuration
   */

  passport.use(new GoogleStrategy({

    clientID     : authConfig.googleAuth.clientID,
    clientSecret : authConfig.googleAuth.clientSecret,
    callbackURL  : authConfig.googleAuth.callbackURL

  }, function(token, refreshToken, profile, done) {
    process.nextTick(function() {
      User.findOne({'google.id' : profile.id}, function(err, user) {
        if (err) {
          return done(err);
        }

        if (user) {
          return done(null, user);
        } else {
          var newUser = new User();

          newUser.google.id    = profile.id;
          newUser.google.token = token;
          newUser.google.name  = profile.displayName;
          newUser.google.email = profile.emails[0].value;

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
