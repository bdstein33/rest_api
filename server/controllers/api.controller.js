var Job = require('../models/job.model');
var Website = require('../models/website.model');
var helpers = require('../services/controllerHelpers');
var jobQueue = require('../services/jobQueue');

// Adds a new job to database if IP address is under rate limit
exports.addJob = function(req, res) {
  // Convert url to standardized format
  var url = helpers.urlConverter(req.query.url);

  var ipAddress = req.connection.remoteAddress;

  // First check to see if IP address has a remaining allowance for job requests for this hour
  helpers.IPRateCheck(ipAddress, function(remaining, wait) {
    // If the rate limit has been hit, return error message with wait time until next request can be made
    if (remaining === 0) {
      res.json({
        message: "You have exceeded your rate limit, please try again in " + wait.toString() + " seconds.",
        next_job_wait: wait,
        remaining_requests: 0
      });
    // Otherwise add job to database
    } else {
      // First try to add website to database.  If the website already exists, will return the id of existing website id
      Website.add(url, function(website_id) {
        // Add job with given website id
        Job.add({website_id: 1, ip_address: req.connection.remoteAddress}, function(job) {
          jobQueue.addToQueue(job.job_id);
          res.json({
            message: "You're job has been added to the job queue.  You have " + (remaining - 1).toString() + " job requests remaining for this hour.",
            job_id: job.get('job_id'),
            remaining_requests: remaining - 1,
            next_job_wait: wait,
            queue: jobQueue.queueLength()
          });
        });
      });      
    }
  });
};



exports.getJobResult = function(req, res) {

};
