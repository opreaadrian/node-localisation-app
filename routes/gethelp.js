exports.index = function(req, res) {

  res.render('get-help', {
    pageTitle: 'Get help',
    noform: false,
    labelText: 'Phone no.',
    placeholderText: 'Enter your phone no.',
    buttonText: 'Go!',
    scripts: [
      '//maps.googleapis.com/maps/api/js?key=' + JSON.parse(require('fs').readFileSync(__dirname + '/../mapsapiconfig.json')).apiKey + '&sensor=true',
      'javascripts/mapinit.js'
    ]
  });
};

exports.send = function(req, res) {
  /** Twilio private config */
    var twilio = JSON.parse(require('fs').readFileSync( __dirname + '/../twilio.json')),
    accountSid = twilio.sid,
    authToken = twilio.token,
    client = require('twilio')(accountSid, authToken),

    /** User's phone number -- inserted on the help page*/
    phone = req.body.phoneNumber;

  client.sms.messages.create({
    body: 'The phone number from where the request was made: ' + phone,
    to: phone,
    from: '+13128185365'
  }, function(err, message) {
    process.stdout.write(message.sid);
  });

  res.render('get-help', {
    pageTitle: 'Get help',
    noform: true,
    message: 'You will be contacted shortly!',
    scripts: [
      '//maps.googleapis.com/maps/api/js?key=AIzaSyD0nA1W3_fKddzqEUu7StcwMOCVof-oBZ4&sensor=true',
      'javascripts/mapinit.js'
    ]
  });

};
