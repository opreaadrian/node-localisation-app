/**
 * @method login
 *
 * Login route handler. Renders the login page when a GET request is made to the '/login' route
 *
 * @param  {Object} req The request object
 * @param  {Object} res The response object
 */
exports.login = function(req, res) {
  'use strict';

  res.render('login', {
    message   : req.flash('loginMessage'),
    pageTitle : 'Log In',
    scripts   : []
  });
};

/**
 * @method signup
 *
 * Sign up route handler. Renders the login page when a GET request is made to the'/sign-up' route
 *
 * @param  {Object} req The request object
 * @param  {Object} res The response object
 */
exports.signup = function(req, res) {
  'use strict';

  res.render('sign-up', {
    pageTitle : 'Sign up form',
    message   : req.flash('signupMessage'),
    scripts   : []
  });
};

/**
 * @method profile
 *
 * @description Profile route handler. Renders the profile page whenever a successful authentication occurs or
 * a successful user registration takes place
 *
 * @param  {Object} req The request object
 * @param  {Object} res The response object
 */
exports.profile = function(req, res){
  'use strict';

  res.render('profile', {
    pageTitle: 'Profile page',
    scripts: []
  });
};

/**
 * @method logout
 *
 * @description Profile route handler. Renders the profile page whenever a successful authentication occurs or
 * a successful user registration takes place
 *
 * @param  {Object} req The request object
 * @param  {Object} res The response object
 */
exports.logout = function(req, res) {
  'use strict';

  req.logout();
  res.redirect('/');
};
