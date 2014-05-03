var fs = require('fs'),
  mapsApiKey = JSON.parse(fs.readFileSync(__dirname + '/../mapsapiconfig.json')).apiKey,
  twilio = JSON.parse(fs.readFileSync( __dirname + '/../twilio.json'));

exports.index = function(req, res) {

  res.render('get-help', {
    pageTitle: 'Get help',
    noform: false,
    labelText: 'Phone no.',
    placeholderText: 'Enter your phone no.',
    buttonText: 'Go!',
    scripts: [
      '//maps.googleapis.com/maps/api/js?key=' + mapsApiKey + '&sensor=true',
      'javascripts/mapinit.js'
    ]
  });
};

exports.send = function(req, res) {
  /** Twilio private config */
    var accountSid = twilio.sid,
      fromPhoneNo = twilio.fromPhoneNo,
      authToken = twilio.token,
      client = require('twilio')(accountSid, authToken),

    /** User's phone number -- inserted on the help page*/
    phone = req.body.phoneNumber;

  client.sms.messages.create({
    body: 'The phone number from where the request was made: ' + phone,
    to: phone,
    from: fromPhoneNo,
  }, function(err, message) {
    process.stdout.write(message.sid);
  });

  res.render('get-help', {
    pageTitle: 'Get help',
    noform: true,
    message: 'You will be contacted shortly!',
    scripts: [
      '//maps.googleapis.com/maps/api/js?key=' + mapsApiKey + '&sensor=true',
      'javascripts/mapinit.js'
    ]
  });

};
