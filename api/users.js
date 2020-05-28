const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createUser, getUserByUsername } = require('../db');
const SALT_COUNT = 10;

router.post('/register', async (req, res, next) => {
  try {
    const {username, password} = req.body;
    const queriedUser = await getUserByUsername(username);
    if (queriedUser) {
      next({
        name: 'UserExistsError',
        message: 'A user by that username already exists'
      });
    } else if (password.length < 8) {
      next({
        name: 'PasswordLengthError',
        message: 'Password Too Short!'
      });
    } else {
      bcrypt.hash(password, SALT_COUNT, async function(err, hashedPassword) {
        const user = await createUser({
          username,
          password: hashedPassword // not the plaintext
        });
        if (err) {
          next(err);
        } else {
          console.log('>>>>>>>>> user', user);

          res.send({user});
        }
      });
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router;
