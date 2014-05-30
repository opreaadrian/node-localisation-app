module.exports = connect;

var mongoose = require('mongoose'),
  credentials = JSON.parse(fs.readFileSync('./db.json'));


function connect() {
  var url = '',
    options = null;

    url = ['mongodb://', credentials.dbHost].join();

    options = {
      user: credentials.username,
      pass: credentials.password,
      db: {native_parser: true}
    }

  mongoose.connect(url, options);
}
