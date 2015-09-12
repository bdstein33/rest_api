var request = require('request');


exports.fetchHTML = function(url, callback) {
  request(url, function(error, response, html) {
    if (!error) {
      callback(null, html);
    } else {
      callback(true);
    }
  });
};


exports.timeDiff = function(fromDate, toDate) {
  toDate = toDate || new Date();
  return Math.ceil((toDate.getTime() - fromDate.getTime()) / 1000);
};