  // Sets the NODE_ENV variable equal to development if it is otherwise undefined.  Make sure proper environmental variables are set in the config/env folder.
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';

  var express = require('./config/express');
  var app = express();


  //host established for proxy
  var host = process.env.HOSTNAME || null;

  app.listen(process.env.PORT, host);
  module.exports = app;
  console.log('Server running at port: ' + process.env.PORT);

// exports.createJob = function() {

// };

// exports.addWebsite = function() {

// };


// exports.fetchWebsiteHTML = function(url) {

// };