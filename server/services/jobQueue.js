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

Job.getIncomplete(function(jobs) {
  jobs.forEach(function(job) {
    jobQueue.enqueue(job.job_id);
  });
  startQueue();
});



exports.addToQueue = function(job_id) {
  jobQueue.enqueue(job_id);
};

exports.queueLength = function() {
  return jobQueue.size();
};