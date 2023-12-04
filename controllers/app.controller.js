const Users = [
  {
    id: 0,
    name: 'Pippo',
    surname: 'Baudo',
    email: 'pippo.baudo@rai.it',
    password: '123secretPWD'
  },
  {
    id: 1,
    name: 'Paola',
    surname: 'Barale',
    email: 'paola.barale@mediaset.it',
    password: 'ciccioBello$$1'
  }
];

let findUserByEmail = async (email) => {
  return await Users.find((user) => {
    return user.email === email;
  });
};

// Login user
exports.login = async (req, res, next) => {
  // Validate request body
  if (
    !req.body || 
    Object.keys(req.body).length === 0 ||
    !req.body.email ||
    !req.body.password
  ) {
    return res.status(400).send({
      error: 'Invalid body',
      code: 'invalidBody'
    });
  }

  const user = await findUserByEmail(req.body.email);

  if (!user) {
    return res.status(404).send({ 
      error: 'User not found',
      code: 'userNotFound'
    });
  }

  if (user.password !== req.body.password) {
    return res.status(401).send({ 
      error: 'Wrong password',
      code: 'wrongPassword'
    });
  }

  // Session
  // regenerate the session, which is good practice to help
  // guard against forms of session fixation
  req.session.regenerate(function (error) {
    if (error) {return next(error);}

    // store user information in session, typically a user id
    req.session.user = {};
    req.session.user.name = user.name;
    req.session.user.surname = user.surname;
    req.session.user.email = user.email;

    // save the session before redirection to ensure page
    // load does not happen before session is saved
    req.session.save(function (error) {
      if (error) {return next(error);}
      res.redirect('/');
    });
  });

  //res.json(user);
};