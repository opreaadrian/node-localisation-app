module.exports = {
  facebookAuth : {
    clientID     : 'fbClientID',
    clientSecret : 'fbClientSecret',
    callbackURL  : 'http://trackrapplication.herokuapp.com/auth/facebook/callback'
  },
  twitterAuth  : {
    consumerKey     : 'twConsumerKey',
    consumerSecret : 'twConsumerSecret',
    callbackURL    : 'http://trackrapplication.herokuapp.com/auth/twitter/callback'
  },
  googleAuth   : {
    clientID     : 'googClientID',
    clientSecret : 'googClientSecret',
    callbackURL  : 'http://trackrapplication.herokuapp.com/auth/google/callback'
  }
};
