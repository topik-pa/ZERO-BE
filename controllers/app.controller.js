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
exports.login = async (req, res) => {
  // Validate request body
  if (
    !req.body || 
    Object.keys(req.body).length === 0 ||
    !req.body.email ||
    !req.body.password
  ) {
    res.status(400).send({
      error: 'Invalid body',
      code: 'invalidBody'
    });
    return;
  }

  const user = await findUserByEmail(req.body.email);

  if (!user) {
    res.status(404).send({ 
      error: 'User not found',
      code: 'userNotFound'
    });
    return;
  }

  if (user.password !== req.body.password) {
    res.status(404).send({ 
      error: 'Wrong password',
      code: 'wrongPassword'
    });
    return;
  }

  // TODO: add session staff

  res.json(user);
};