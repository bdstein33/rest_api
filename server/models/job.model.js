var db = require('../config/db');
var Job = require('../config/schema').Job;
var helpers = require('../services/modelHelpers');

// Adds job to database with a unique job_id
Job.add = function(jobData, callback) {
  jobData.job_id = generateID();
  new Job({job_id: jobData.job_id})
  .fetch()
  .then(function(job) {
    if (!job) {
      new Job(jobData)
      .save()
      .then(function(job) {
        callback(job);
      });
    } else {
      Job.add(jobData, callback);
    }
  });

};

// Returns number of requests made in last hour and the time user must wait to make next request from the same IP address
Job.checkIP = function(ipAddress, callback) {
  //Retrieves count and oldest time of all requests made from IP address in the past hour
  db.knex.raw(' \
    SELECT \
      COUNT(*) AS requests, \
      MIN(created_at) AS oldest_request \
    FROM jobs \
    WHERE ip_address = \"' + ipAddress + '\" \
    AND created_at > CURRENT_TIMESTAMP - INTERVAL 1 HOUR \
    ORDER BY created_at DESC')
  .then(function(results) {
    var requestcount = results[0][0];
    var secondsUntilNextRequest = 0;
    // If one less than max requests have been made within the last 60 minutes, determine in how many seconds the next request can be made after this one (we subtract 1 from REQUEST LIMIT to account for the fact that we are about to add one more request)
    if (results[0][0].requests >= process.env.REQUEST_LIMIT - 1) {
      // Find how many seconds ago the oldest request made in the past hour was made
      var timeDiff = helpers.timeDiff(results[0][0].oldest_request);
      // Math.ceil((new Date().getTime() - results[0][0].oldest_request.getTime())/1000);
      // Subtract this from the number of seconds in an hour to determine when next request can be made
      secondsUntilNextRequest = 60 * 60 - timeDiff;

    }
      // Add one to requests made because the query results don't include the job that was just added
      callback(results[0][0].requests, secondsUntilNextRequest);
  });
};

// This function returns a random ID that is 10 characters long
// Credit: https://gist.github.com/gordonbrander/2230317
var generateID = function () {
  return Math.random().toString(36).substr(2, 10).toUpperCase();
};

module.exports = Job;