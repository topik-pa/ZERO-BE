module.exports = app => {
  const ctrl = require('../controllers/app.controller.js');
  var router = require('express').Router();

  //Login user
  router.post('/login', ctrl.login);

  app.use('/api', router);

};