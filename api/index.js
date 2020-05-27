const express = require('express');
const router = express.Router();

router.get('/health', (req, res, next) => {
  res.send({message: 'healthy'})
});

// Routers
const usersRouter = require('./users');
router.use('/users', usersRouter);

module.exports = router;
