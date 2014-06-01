var mongoose    = require('mongoose'),
    fs          = require('fs'),
    credentials = JSON.parse(fs.readFileSync('./db.json'));


function database() {
  'use strict';


/**
 * Database connection url string
 */
  var url     = 'mongodb://' + credentials.dbHost +  ':' +
                credentials.dbPort +  '/' +  credentials.dbName,

/**
 * Database connection options object
 */
      options = {
        /* JSHint will give a "camelcase" warning on this option `native_parser` */
        db: {native_parser: true}
      };

  return mongoose.connect(url, options);
}

module.exports = database;
