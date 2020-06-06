const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createUser, getUserByUsername, getPublicRoutinesByUser, getUser } = require('../db');
const SALT_COUNT = 10;

// POST /api/users/login
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  // request must have both
  if (!username || !password) {
    next({
      name: 'MissingCredentialsError',
      message: 'Please supply both a username and password'
    });
  }

  try {
    const user = await getUser({username, password});
    if(!user) {
      next({
        name: 'IncorrectCredentialsError',
        message: 'Username or password is incorrect',
      })
    } else {
      const token = jwt.sign({id: user.id, username: user.username}, process.env.JWT_SECRET, { expiresIn: '1w' });
        res.send({ message: "you're logged in!", token });
    };
  } catch (error) {
    console.log(error);
    next(error);
  }
});
// POST /api/users/register
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

// GET /api/users/:username/routines
router.get('/:username/routines', async (req, res, next) => {
  try {
    console.log('>>>>>>>>> req.params.username', req.params.username);
    const routines = await getPublicRoutinesByUser({username: req.params.username});
    res.send(routines);
  } catch (error) {
    next(error)
  }
})
module.exports = router;
