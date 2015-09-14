var Job = require('../models/job.model');

// Represents whether jobQueue is currently being worked through
var queueIsActive = false;
var Queue = function() {
  this.storage = {};
  this.start = -1;
  this.end = - 1;
};

Queue.prototype.enqueue = function(value) {
  this.end++;
  this.storage[this.end] = value;
  if (!queueIsActive) {
    startQueue();
  }
};

Queue.prototype.dequeue = function(value) {
  var result = null;
  if (this.size() > 0) {
    this.start++;
    result = this.storage[this.start];
    delete this.storage[this.start];
  }

  return result;
};

Queue.prototype.size = function() {
  return this.end - this.start;
};

// This function runs through and completes the incomplete jobs.  If there are no more jobs, queueIsActive is set to false
var startQueue = function() {
  queueIsActive = true;
  (function loop() {
    // If there are any jobs remaining in the queue, execute that job then loop on to the next
    if (jobQueue.size() > 0) {
      var id = jobQueue.dequeue();
      Job.executeJob(id, function() {
        loop();
      });
    // Once the queue is empty, stop looping through
    } else {
      queueIsActive = false;
    }
  }());
};


// Initialization functions
// When the server starts up, create a jobQueue and fill it with any incomplete jobs in the database
var jobQueue = new Queue();

// Store the IP addreses that have hit the rate limit so that we don't need to make an additional database query.  The keys here are IP addresses, the values are the time after which they can make additional job requests.
var limitedIPAddresses = {};

Job.getIncomplete(function(jobs) {
  jobs.forEach(function(job) {
    jobQueue.enqueue(job.job_id);
  });
  startQueue();
});

Job.getLimitedIPs(function(result) {
  limitedIPAddresses = result;
});

exports.addToLimitList = function(ipAddress, time) {
  limitedIPAddresses[ipAddress] = time;
};

exports.addToQueue = function(job_id) {
  jobQueue.enqueue(job_id);
};

exports.queueLength = function() {
  return jobQueue.size();
};

// Checks to see if IP Address is valid to make new request
exports.IPRateCheck = function(ipAddress, callback) {
  // If limitedIPAddresses has given IP address as a key, the IP address either is or was at the limit
  if (limitedIPAddresses.hasOwnProperty(ipAddress)) {
    // If the time associated with this IP address is greater than current time, the IP address is still banned
    if (limitedIPAddresses[ipAddress] > new Date()) {
      callback(false, limitedIPAddresses[ipAddress]);
    } else {
      // If the time has passed, we remove IP address from this object because the IP address is no longer rate limited
      delete limitedIPAddresses[ipAddress];
      callback(true);
    }
  } else {
    callback(true);
  }
};