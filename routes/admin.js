var fs         = require('fs'),
    mapsApiKey = JSON.parse(fs.readFileSync('./config/mapsapiconfig.json')).apiKey,
    twilio     = JSON.parse(fs.readFileSync('./config/twilio.json'));

/*
 * GET home page.
 */

exports.dashboard = function (req, res) {
  'use strict';

  res.render('admin/dashboard', {
    pageTitle : 'Administrator Dashboard',
    session   : req.session,
    user      : req.user,
    scripts   : [
      '//maps.googleapis.com/maps/api/js?key=' + mapsApiKey + '&sensor=true',
      '../socket.io/socket.io.js',
      '/javascripts/mapinit.js',
      '/javascripts/admin.js',
      '/components/bootstrap/js/popover.js',
      '//code.createjs.com/tweenjs-0.5.1.min.js'
    ]
  });
};
