const { Router } = require('express');
const User = require('../models/User');
const { HttpError } = require('../middleware/error');


const auth = Router()
  .post('/signup', (req, res, next) => {
    const { email, password } = req.body;
    User
      .create({ email, password })
      .then(user => {
        res.send({ user, token: user.authToken() });
      })
      .catch(next);
  })

  .post('/signin', (req, res, next)=> {
    const { email, password } = req.body;
    User
      .findOne({ email })
      .then(user => {
        return Promise.all([
          Promise.resolve(user),
          user.compare(password)
        ]);
      })
      .then(([user, correctPassword]) => {
        if(correctPassword) {
          res.send({ user, token: user.authToken() });
        }
        else next(new HttpError(401, 'invalid username or password'));
      })
      .catch(next);
  });
 
module.exports = auth;
