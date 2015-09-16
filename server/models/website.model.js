var db = require('../config/db');
var Website = require('../config/schema').Website;
var helpers = require('../services/timeHelpers');

// Checks to see if the given url exists in the websites table.  If it does, return that website's id.  If it does not, add new website to database and return newly created website's id.
Website.add = function(url, callback) {
  new Website({url: url})
    .fetch()
    .then(function(website) {
      if (website) {
        callback(website.get('id'));
      } else {
        new Website({url: url})
          .save()
          .then(function(website) {
            callback(website.get('id'));
          });
      }
    });
};

module.exports = Website;