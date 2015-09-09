 module.exports = function(app) {

  app.get('/login', function(req, res) {
    res.redirect('/#/login');
  });
  app.get('/home', function(req, res) {
    res.redirect('/#/home');
  });
 };