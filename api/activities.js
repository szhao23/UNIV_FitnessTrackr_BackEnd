const express = require('express');
const router = express.Router();
const {getAllActivities} = require('../db');

router.get('/', async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send(activities);
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  console.log('>>>>>>>>> inside api/activities route');
  
  console.log('>>>>>>>>> req.body', req.body);
  
})

module.exports = router;
