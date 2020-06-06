const express = require('express');
const router = express.Router();
const { getAllActivities, createActivity, updateActivity, getPublicRoutinesByActivity } = require('../db');
const { requireUser } = require('./utils')

// GET /activities/:activityId/routines
router.get('/:activityId/routines', async (req, res, next) => {
  try {
    const routines = await getPublicRoutinesByActivity({id: req.params.activityId});
    res.send(routines);
  } catch (error) {
    next(error);
  }
});

// GET /activities
router.get('/', async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send(activities);
  } catch (error) {
    next(error)
  }
})

// POST /activities
router.post('/', requireUser, async (req, res, next) => {
  try {
    const {name, description} = req.body;
    const createdActivity = await createActivity({name, description});
    res.send(createdActivity)
  } catch (error) {
    next(error);
  }
});

// PATCH /activities/:activityId
router.patch('/:activityId', requireUser, async (req, res, next) => {
  try {
    const {name, description} = req.body;
    const updatedActivity = await updateActivity({id: req.params.activityId, name, description})
    res.send(updatedActivity);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
