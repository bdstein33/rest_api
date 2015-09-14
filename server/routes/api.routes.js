 var api = require('../controllers/api.controller.js');
 module.exports = function(app) {

  app.get('/api/v1/url/:url', api.addJob);
  app.get('/api/v1/job/:job_id', api.getJobResult);

 };

/*
 User submits www.google.com to your endpoint.  The user gets back a job id. Your system fetches www.google.com (the result of which would be HTML) and stores the result.  

 The user asks for the status of the job id and if the job is complete, he gets a response that includes the HTML for www.google.com
 */

//When initial GET request is made, check to make sure that less than 60 jobs have been created by IP address in last hour

// If 60+ jobs have been created in the last hour, send an error message telling user to try again in (60 minutes less time of first request in the hour)

// Otherwise add new job to a queue


//Have a queue iterator that continuously iterates through queue until no jobs left

// If queue iterator is not running and a queue is added, initiate queue iterator

