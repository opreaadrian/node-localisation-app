exports.index = function(req, res) {

  res.render('get-help', {
    pageTitle: 'Get help',
    labelText: 'Phone no.',
    placeholderText: 'Enter your phone no.',
    buttonText: 'Go!',
    scripts: [
      '//maps.googleapis.com/maps/api/js?key=AIzaSyD0nA1W3_fKddzqEUu7StcwMOCVof-oBZ4&sensor=true'
    ]
  });
};

exports.send = function(req, res) {
  var phone = req.body.phoneNumber;
};
