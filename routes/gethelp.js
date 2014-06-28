var fs         = require('fs'),
    mapsApiKey = JSON.parse(fs.readFileSync('./config/mapsapiconfig.json')).apiKey,
    twilio     = JSON.parse(fs.readFileSync('./config/twilio.json'));

exports.index = function(req, res) {
  'use strict';

  res.render('get-help', {
    pageTitle       : 'Get help',
    session         : req.session,
    user            : req.user,
    noform          : false,
    labelText       : 'Phone no.',
    placeholderText : 'Enter your phone no.',
    buttonText      : 'Go!',
    scripts         : [
      '//maps.googleapis.com/maps/api/js?key=' + mapsApiKey + '&sensor=true',
      'components/bootstrap/js/popover.js',
      'javascripts/mapinit.js'
    ]
  });
};

exports.send = function(req, res) {
  'use strict';

  /** Twilio private config */
    var accountSid  = twilio.sid,
        fromPhoneNo = twilio.fromPhoneNo,
        authToken   = twilio.token,
        client      = require('twilio')(accountSid, authToken),
        phone = req.body.phoneNumber; // User's phone number -- inserted on the help page

  client.sms.messages.create({
    body : 'The phone number from where the request was made: ' + phone,
    to   : phone,
    from : fromPhoneNo,
  }, function(err, message) {
    process.stdout.write(message.sid);
  });

  res.render('get-help', {
    pageTitle : 'Get help',
    session   : req.session,
    user      : req.user,
    noform    : true,
    message   : 'You will be contacted shortly!',
    scripts   : [
      '//maps.googleapis.com/maps/api/js?key=' + mapsApiKey + '&sensor=true',
      'components/bootstrap/js/popover.js',
      'javascripts/mapinit.js'
    ]
  });

};
