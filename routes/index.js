var fs         = require('fs'),
    mapsApiKey = JSON.parse(fs.readFileSync('./config/mapsapiconfig.json')).apiKey,
    twilio     = JSON.parse(fs.readFileSync('./config/twilio.json'));

/*
 * GET home page.
 */

exports.index = function (req, res) {
  'use strict';

  res.render('global/index', {
    pageTitle : 'Emergency service',
    session   : req.session,
    user      : req.user,
    scripts   : [
      '//maps.googleapis.com/maps/api/js?key=' + mapsApiKey + '&sensor=true',
      '/javascripts/mapinit.js',
      '/components/bootstrap/js/popover.js',
      '//code.createjs.com/tweenjs-0.5.1.min.js'
    ]
  });
};
