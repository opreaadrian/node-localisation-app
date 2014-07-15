module.exports = function(app, passport) {

  'use strict';


  app.get('/profile', isLoggedIn, function(req, res){

    res.render('account/profile', {
      pageTitle : 'Profile page',
      user      : req.user,
      session   : req.session,
      scripts   : []
    });
  });

  /**
   * ====================
   * Authentication routes
   * ====================
   */


  /**
   * Facebook auth routes
   */
  app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
      successRedirect : '/profile',
      failureRedirect : '/'
    }));

  /**
   * Twitter auth routes
   */
  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect : '/profile',
    failureRedirect : '/'
  }));

  /**
   * Google auth routes
   */
  app.get('/auth/google', passport.authenticate('google', { scope: [ 'profile', 'email'] }));

  app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect : '/profile',
    failureRedirect : '/'
  }));

  app.get('/logout', function(req, res) {

    req.logout();
    res.redirect('/');
  });

  /**
   * ====================
   * Authorization routes
   * ====================
   */


  /**
   * Facebook authorization (account linking)
   */
  app.get('/connect/facebook', passport.authorize('facebook', {scope: 'email'}));

  /**
   * Twitter authorization (account linking)
   */
  app.get('/connect/twitter', passport.authorize('twitter', {scope: 'email'}));

  /**
   * Google+ authorization (account linking)
   */
  app.get('/connect/google', passport.authorize('google', {scope: ['profile', 'email']}));

  app.get('/unlink/:account', function(req, res) {

    var user    = req.user,
        account = req.params.account;

    if (account == 'local') {
      user.local.email    = undefined;
      user.local.password = undefined;
    } else {
      user[account].token = undefined;
    }

    user.save(function(err) {
      res.redirect('/profile');
    });
  });
  // route middleware to ensure user is logged in
  function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()) {
      return next();
    }

    res.redirect('/');
  }

};


