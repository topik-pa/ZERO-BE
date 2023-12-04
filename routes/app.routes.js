const express = require('express');

// middleware to test if authenticated
function isAuthenticated (req, res, next) {
  if (req.session.user) next();
  else next('route');
}

module.exports = app => {
  const ctrl = require('../controllers/app.controller.js');
  var router = require('express').Router();

  //Login
  router.post('/login', express.urlencoded({ extended: false }), ctrl.login);

  app.get('/', isAuthenticated, function (req, res) {
    // this is only called when there is an authentication user due to isAuthenticated
    res.send('Hello, ' + req.session.user.name + '!' +
      ' <a href="/logout">Logout</a>');
  });
  app.get('/', function (req, res) {
    res.send('<form action="/login" method="post">' +
      'Email: <input name="email"><br>' +
      'Password: <input name="password" type="password"><br>' +
      '<input type="submit" text="Login"></form>');
  });

  app.get('/logout', function (req, res, next) {
    // logout logic
  
    // clear the user from the session object and save.
    // this will ensure that re-using the old session id
    // does not have a logged in user
    req.session.user = null;
    req.session.save(function (error) {
      if (error) next(error);
  
      // regenerate the session, which is good practice to help
      // guard against forms of session fixation
      req.session.regenerate(function (error) {
        if (error) next(error);
        res.redirect('/');
      });
    });
  });

  app.use('/', router);
};