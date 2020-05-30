const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getUserById } = require('../db');
const { JWT_SECRET } = process.env;

router.get('/health', (req, res, next) => {
  res.send({message: 'healthy'})
});


// set `req.user` if possible
router.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');
  
  if (!auth) { // nothing to see here
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    console.log('>>>>>>>>> token', token);
    
    try {
      const parsedToken = jwt.verify(token, JWT_SECRET);
      console.log('>>>>>>>>> parsedToken', parsedToken);
      
      const id = parsedToken && parsedToken.id
      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch (error) {
      next(error);
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${ prefix }`
    });
  }
});

router.use((req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }
  next();
});

// Routers
const usersRouter = require('./users');
router.use('/users', usersRouter);

const activitiesRouter = require('./activities');
router.use('/activities', activitiesRouter);

module.exports = router;
