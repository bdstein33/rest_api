// Returns number of seconds that seperate two dates
exports.timeDiff = function(fromDate, toDate) {
  toDate = toDate || new Date();
  return Math.ceil((toDate.getTime() - fromDate.getTime()) / 1000);
};

// Returns a date one hour later than the inputted date
exports.hourLater = function(date) {
  return new Date(date.setMinutes(date.getMinutes() + 60));
};