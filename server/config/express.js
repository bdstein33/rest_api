var config = require('./config.js');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');

module.exports = function () {
  var app = express();
  
  if (process.env.NODE_ENV === 'development') {
     // morgan is middleware that logs server activity to the console.  We only want to use it in a development setting. 
    app.use(morgan('dev'));
  }

   // body-parser converts data receive in POST requests into JSON 
  app.use(bodyParser.json());

   // Tell express where to look for static files.  The file listed becomes the root directory for static files. 

  // Routes 
  require('../routes/api.routes')(app);
  
   // Respond with an error to all invalid routes
  app.use(function(req, res) {
    res.status(404);
    res.json("Invalid API endpoint");
  });

  return app;
};
