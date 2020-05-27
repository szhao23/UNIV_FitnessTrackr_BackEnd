const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { createUser } = require('../db');

router.post('/register', async (req, res, next) => {
  res.send({user: {}});
})

module.exports = router;
