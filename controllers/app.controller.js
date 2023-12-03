//const crypto = require('crypto');
//const jwt = require('jsonwebtoken');
//const db = require('../models');
//const User = db.users;

/*function hashPWD(pwd) {
  return crypto.createHash('sha256').update(pwd).digest('base64').toString();
}*/

/*function validatePWD(plainPwd, hashedPwd) {
  return hashPWD(plainPwd) === hashedPwd;
}*/


// Login user
exports.login = (req, res) => {
  res.status(200).send({
    code: 'OK'
  });
  return;
  
  // Validate request
  if (Object.keys(req.body).length === 0) {
    res.status(400).send({
      error: 'Request body can not be empty!',
      code: 'emptyBodyError'
    });
    return;
  }
  var user, logging_user = {
    email: req.body.email,
    password: req.body.password || undefined
  };
  User.findOne({ email: logging_user.email })
    .then(data => {
      if (!data) {
        res.status(404).send({ 
          error: 'Cannot find the specified user!',
          code: 'userNotFound'
        });
      } else {
        user = data.toJSON();
        // Authentication success
        if (user.password === logging_user.password) { //TODO: check the hash
        //if (user && validatePWD(logging_user.password, user.password)) {
          delete user.password;
          req.session.regenerate(function () {
            req.session.user = user;
            req.session.success = 'Authenticated as ' + user.email;
          });
          const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.SESSION_EXPIRES_IN_MILLISECONDS
          });
          User.findByIdAndUpdate(user._id, { accessToken }, { useFindAndModify: false })
            .then( () => {
              res.json(user);
            })
            .catch( (err) =>{
              console.log(err);
            });
        } else {
          // Authentication failed
          req.session.regenerate(function () {
            req.session.error = 'Authentication failed!';
          });
          res.status(401).send({
            error: 'Authentication failed!',
            code: 'loginFailed'
          });
        }
      }
    })
    .catch(err => {
      res.status(500).send({
        error: err + ' -> Some error occurred while login user.',
        code: 'genericServerError'
      });
    });
};