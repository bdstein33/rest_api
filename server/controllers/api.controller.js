var Job = require('../models/job.model');
var Website = require('../models/website.model');
var helpers = require('../services/helpers');

exports.addJob = function(req, res) {
  var url = req.query.url;
  var ipAddress = req.connection.remoteAddress;


  helpers.IPRateCheck(ipAddress, function(remaining, wait) {
    if (remaining <= 0) {
      res.json({
        error: "You have exceeded your rate limit, please try again in " + wait.toString() + " seconds.",
        wait: wait,
        remaining: remaining
      });
    } else {
      Job.add({website_id: 1, ip_address: req.connection.remoteAddress}, function(job) {
        res.json({
          job_id: job.id,
          remaining: remaining
        });
      });
      
    }
  });



  // console.log(req.connection.remoteAddress);
  // Job.add()
  //create job model
  // res.json(req.query.url);
};

