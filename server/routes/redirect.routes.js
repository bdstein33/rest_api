
 module.exports = function(app) {

  app.get('/login', function(req, res) {
    res.redirect('/#/login');
  });
  app.get('/private/home', function(req, res) {
    res.redirect('/#/private/home');
  });
 };