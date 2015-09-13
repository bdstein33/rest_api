var db = require('../config/db');
var Website = require('../config/schema').Website;
var helpers = require('../services/modelHelpers');

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

// Fetch new HTML for a given website if the HTML has not been fetch recently (as defined by global URL_REFRESH_TIME variable)
Website.fetchData = function(website_id, callback) {
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
      helpers.fetchHTML(website.get('url'), function(error, html) {
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

module.exports = Website;

