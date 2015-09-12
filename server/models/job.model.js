var db = require('../config/db');
var Job = require('../config/schema').Job;

// Adds job to database with a unique job_id
Job.add = function(jobData, callback) {
  jobData.job_id = generateID;
  Job({job_id: jobData.job_id})
  .fetch()
  .then(function(job) {
    if (!job) {
      new Job(jobData)
      .save()
      .then(function(job) {
        callback(job);
      });
    } else {
      job.add(jobData, callback);
    }
  });

};


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
    // If 60 requests have been made within the last 60 minutes, determine in how many seconds the next request can be made
    if (results[0][0].requests >= process.env.REQUEST_LIMIT) {
      // Find how many seconds ago the oldest request made in the past hour was made
      var timeDiff = Math.ceil((new Date().getTime() - results[0][0].oldest_request.getTime())/1000);
      // Subtract this from the number of seconds in an hour to determine when next request can be made
      secondsUntilNextRequest = 60*60 - timeDiff;

    }
     callback(results[0][0].requests, secondsUntilNextRequest);
  });
};

// This function returns a random ID that is 10 characters long
// Credit: https://gist.github.com/gordonbrander/2230317
var generateID = function () {
  return Math.random().toString(36).substr(2, 10).toUpperCase();
};


module.exports = Job;