 var auth = require('../controllers/auth.controller.js');
 module.exports = function(app) {

  app.post('/api/auth/login', auth.login);
  app.post('/api/auth/create', auth.create);
  app.post('/api/auth/validate', auth.validate);
  app.get('/api/auth/users', auth.getUsers);
 };