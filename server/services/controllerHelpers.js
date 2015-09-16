var Job = require('../models/job.model');
var request = require('request');

// This function is used to rate limit IP addresses to a specified number of new job requests per hour. The function returns a callback with a the number of requests remaining and the number of seconds a user must wait to make another request from the IP address.
exports.IPRateCheck = function(ipAddress, callback) {
  Job.checkIP(ipAddress, function(requestsMadeInLastHour, waitTime) {
    callback(process.env.REQUEST_LIMIT - requestsMadeInLastHour, waitTime);
  });
};

// Standardizes a url by ensuring it begins with http://www. or https://www.
// Note: current routes cannot accept urls that begin with http:// or https:// but I left the functionality for these strings in place in case we enable users to pass in parameters in future versons of the API
exports.urlConverter = function(string) {
  // If url begins with www., add http:// to the beginning
  if (/^www./i.test(string)) {
    return "http://" + string;
  // If url begins with http:// 
  } else if (/^http:\/\//i.test(string)) {
    // If it doesn't have www. add it in
    if (!/^http:\/\/www./i.test(string)) {
      return "http://www." + string.slice(7);
    // Otherwise return string
    } else {
      return string;
    }
  // If url begins with https:// 
  } else if (/^https:\/\//i.test(string)) {
    // If it doesn't have www. add it in
    if (!/^https:\/\/www./i.test(string)) {
      return "https://www." + string.slice(7);
    } else {
      // Otherwise return string
      return string;
    }
  // If it doesn't have http/https or www., add both
  } else {
    return "http://www." + string;
  }
};

// Returns new date that is a given number of seconds later than the start date.  If startDate is not provided, it defaults to now
exports.laterDate = function(secondsLater, startDate) {
  startDate = startDate || new Date();
  return new Date(startDate.setSeconds(startDate.getSeconds() + secondsLater));
};

