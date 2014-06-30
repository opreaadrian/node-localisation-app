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
   * JavaScript object, whose properties are easier to access.
   * @param  {String}   id The User ID for which the configuration needs to be retrieved
   * @param  {Function} done The callback that getsexecuted once the operation completed
   */
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  /**
   * Local login
   */
  passport.use('local-login', new LocalStrategy({
    usernameField     : 'email',
    passwordField     : 'password',
    passReqToCallback : true
  }, function(req, email, password, done) {

    process.nextTick(function() {
      User.findOne({'local.email': email}, function(err, user) {
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
   * Local registration strategy configuration
   */
  passport.use('local-signup', new LocalStrategy({
      usernameField       : 'email',
      passwordField       : 'password',
      passReqToCallback   : true
    }, function(req, email, password, done) {
      process.nextTick(function() {
        User.findOne({'local.email' : email}, function(err, existingUser) {
          if (err) {
            return done(err);
          }

          if (existingUser) {
            return done(null, false, req.flash('signupMessage', 'That email is already taken!'));
          }

          if (req.user) {
            var user = req.user;

            user.local.email = email;
            user.local.password = user.generateHash(password);

            user.save(function(err) {
              if (err) {
                throw err;
              }

              return done(null, user);
            });
          }
          else {
            var newUser             = new User();

            newUser.local.email     = email;
            newUser.local.password  = newUser.generateHash(password);

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

    clientID          : authConfig.facebookAuth.clientID,
    clientSecret      : authConfig.facebookAuth.clientSecret,
    callbackURL       : authConfig.facebookAuth.callbackURL,
    passReqToCallback : true

  }, function(req, token, refreshToken, profile, done) {
    process.nextTick(function() {
      if (!req.user) {
        User.findOne({'facebook.id' : profile.id}, function(err, user) {
          if (err) {
            return done(err);
          }

          if (user) {
            return done(null, user);
          } else {
            var newUser = new User();

            newUser.facebook.id           = profile.id;
            newUser.facebook.token        = token;
            newUser.facebook.name         = profile.name.givenName + ' ' + profile.name.familyName;
            newUser.facebook.email        = profile.emails[0].value;
            newUser.facebook.profileImage = '//graph.facebook.com/' + profile.id + '/picture';

            newUser.save(function(err) {
              if (err) {
                throw err;
              }

              return done(null, newUser);
            });

          }
        });
      } else {

        var user = req.user;


        user.facebook.id           = profile.id;
        user.facebook.token        = token;
        user.facebook.name         = profile.name.givenName + ' ' + profile.name.familyName;
        user.facebook.email        = profile.emails[0].value;
        user.facebook.profileImage = '//graph.facebook.com/' + profile.id + '/picture';

        user.save(function(err) {
          if (err) {
            throw err;
          }

          return done(null, user);
        });
      }
    });
  }));

  /**
   * Twitter auth strategy configuration
   */

  passport.use(new TwitterStrategy({

    consumerKey    : authConfig.twitterAuth.consumerKey,
    consumerSecret : authConfig.twitterAuth.consumerSecret,
    callbackURL    : authConfig.twitterAuth.callbackURL,
    passReqToCallback : true

  }, function(req, token, refreshToken, profile, done) {
    process.nextTick(function() {
      if (!req.user) {
        User.findOne({'twitter.id' : profile.id}, function(err, user) {
          if (err) {
            return done(err);
          }

          if (user) {
            return done(null, user);
          } else {
            var newUser = new User();

            newUser.twitter.id           = profile.id;
            newUser.twitter.token        = token;
            newUser.twitter.username     = profile.username;
            newUser.twitter.displayName  = profile.displayName;
            newUser.twitter.profileImage = profile.photos[0].value;

            newUser.save(function(err) {
              if (err) {
                throw err;
              }

              return done(null, newUser);
            });

          }
        });
      } else {

        var user = req.user;


        user.twitter.id           = profile.id;
        user.twitter.token        = token;
        user.twitter.username     = profile.username;
        user.twitter.displayName  = profile.displayName;
        user.twitter.profileImage = profile.photos[0].value;

        user.save(function(err) {
          if (err) {
            throw err;
          }

          return done(null, user);
        });
      }
    });
  }));

  /**
   * Google auth strategy configuration
   */

  passport.use(new GoogleStrategy({

    clientID          : authConfig.googleAuth.clientID,
    clientSecret      : authConfig.googleAuth.clientSecret,
    callbackURL       : authConfig.googleAuth.callbackURL,
    passReqToCallback : true

  }, function(req, token, refreshToken, profile, done) {
    process.nextTick(function() {
      if (!req.user) {

        User.findOne({'google.id' : profile.id}, function(err, user) {
          if (err) {
            return done(err);
          }

          if (user) {
            return done(null, user);
          } else {
            var newUser = new User();

            newUser.google.id           = profile.id;
            newUser.google.token        = token;
            newUser.google.name         = profile.displayName;
            newUser.google.email        = profile.emails[0].value;
            newUser.google.profileImage = profile._json.picture.split(':')[1];

            newUser.save(function(err) {
              if (err) {
                throw err;
              }

              return done(null, newUser);
            });

          }
        });
      } else {
        var user = req.user;


          user.google.id           = profile.id;
          user.google.token        = token;
          user.google.name         = profile.displayName;
          user.google.email        = profile.emails[0].value;
          user.google.profileImage = profile._json.picture.split(':')[1];

        user.save(function(err) {
          if (err) {
            throw err;
          }

          return done(null, user);
        });
      }
    });
  }));

};
