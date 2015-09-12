var Job = require('../models/job.model');



// This function is used to rate limit IP addresses to a specified number of new job requests per hour. The function returns a callback with a the number of requests remaining and the number of seconds a user must wait to make another request from the IP address.
exports.IPRateCheck = function(ipAddress, callback) {
  Job.checkIP(ipAddress, function(requestsMadeInLastHour, waitTime) {
    callback(process.env.REQUEST_LIMIT - requestsMadeInLastHour, waitTime);
  });
};