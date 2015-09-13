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
        Job.add({website_id: website_id, ip_address: req.connection.remoteAddress}, function(job) {
          jobQueue.addToQueue(job.get('job_id'));
          res.json({
            message: "You're job has been added to the job queue.  You have " + (remaining - 1).toString() + " job requests remaining for this hour.",
            job_id: job.get('job_id'),
            remaining_requests: remaining - 1,
            next_job_wait: wait
          });
        });
      });      
    }
  });
};


// Returns HTML from job request or a 404 if job_id is invalid
exports.getJobResult = function(req, res) {
  Job.getResult(req.query.id, function(err, result) {
    // If job id doesn't exist, return 404
    if (err) {
      res.status(404);
      res.json("Invalid job id");
    } else {
      // If job is found but is not completed, return
      if (!result.completed) {
        delete result.html;
        result.message = "Job " + result.job_id + " has not been completed yet.  Please try again soon.";
      }
      delete result.completed;
      res.json(result);
    }
    
  });
};
