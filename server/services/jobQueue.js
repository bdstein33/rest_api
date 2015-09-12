var Job = require('../models/job.model');

// Represents whether jobQueue is currently being worked through
var active = false;
var Queue = function() {
  this.storage = {};
  this.start = -1;
  this.end = - 1;
};

Queue.prototype.enqueue = function(value) {
  this.end++;
  this.storage[this.end] = value;
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


var jobQueue = new Queue();

Job.getIncomplete(function(jobs) {
  jobs.forEach(function(job) {
    jobQueue.enqueue(job.job_id);
  });

  console.log(jobQueue)
});



var startQueue = function() {
  active = true;
  // while (jobQueue.size() > 0) {
  //   console.log("Val: ", jobQueue.dequeue()," | Remaining: ", jobQueue.size());
  // }
  setInterval(function() {
    console.log(jobQueue.size());
  }, 1000)
  active = false;
};

startQueue();


// If server restarts, populate jobQueue with remaining jobs

exports.addToQueue = function(job_id) {
  jobQueue.enqueue(job_id);
};

exports.queueLength = function() {
  return jobQueue.size();
}