 var api = require('../controllers/api.controller.js');
 module.exports = function(app) {

  app.get('/api/v1/url/:url', api.addJob);
  app.get('/api/v1/job/:job_id', api.getJobResult);

 };
