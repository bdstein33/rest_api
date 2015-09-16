var http = require('http');
var request = require('request');
var Job = require('../models/job.model');
var Website = require('../models/website.model');
var helpers = require('../services/timeHelpers');

/////////////////////////////////////////////
/// Job Queue
/////////////////////////////////////////////

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
      var job_id = jobQueue.dequeue();
      executeJob(job_id, function() {
        loop();
      });
    // Once the queue is empty, stop looping through
    } else {
      queueIsActive = false;
    }
  }());
};



// This function fetches the data for a given url (if it needs to be fetched) and marks a job as complete.
var executeJob = function(job_id, callback) {
  new Job({job_id: job_id})
    .fetch()
    .then(function(job) {
      fetchWebsiteHTML(job.get('website_id'), function() {
        job.set('completed', true);
        job.save();
        callback();
      });
    });
};

// Fetch new HTML for a given website if the HTML has not been fetch recently (as defined by global URL_REFRESH_TIME variable)
var fetchWebsiteHTML = function(website_id, callback) {
  // Fetch website form database
  new Website({id: website_id})
  .fetch()
  .then(function(website) {
    // If website's HTML has been fetched within the last hour, return this HTML
    if (!!(website.get('html')) && helpers.timeDiff(website.get('last_updated')) < process.env.URL_REFRESH_TIME) {
      callback(website.get('html'));
    // Otherwise the HTML hasn't been fetched or it's old, so we fetch again
    } else {
      // Make HTTP request to URL
      requestHTML(website.get('url'), function(error, html) {
        // If there is an error fetching the HTML, the URL must be invalid.  Either way, set new HTML or error message as the value in the html column
        if (error) {
          website.set('html', 'Invalid url');
        } else {
          website.set('html', html);
        }
        // Update last_updated time to now
        website.set('last_updated', new Date());
        website.save();

        callback();
      });
    }
  });
};

// Fetches HTML from the provided url
var requestHTML = function(url, callback) {
  // First make get request to make sure the url is valid
  http.get(url, function(res) {
    // If response header doesn't have content-length value or has content-length value that is of valid size
    // We check to see if the header does not have a content-length value because response might use transfer encoding instead
    if (!res.headers['content-length'] || parseInt(res.headers['content-length']) <= process.env.MAX_FILE_SIZE) {
      request(url, function(error, response, html) {
        if (!error) {
          callback(null, html);
        } else {
          callback(true);
        }
      });
    }
      
  // If url is not valid, return true for error
  }).on('error', function (err) {
    callback(true);
  });
};

var getBinarySize = function(string) {
  return Buffer.byteLength(string, 'utf8');
};

/////////////////////////////////////////////
/// Initialization
/////////////////////////////////////////////

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

/////////////////////////////////////////////
/// Functions used in other files
/////////////////////////////////////////////

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