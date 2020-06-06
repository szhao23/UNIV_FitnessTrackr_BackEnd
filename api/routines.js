const express = require('express');
const router = express.Router();
const { getAllPublicRoutines, createRoutine, updateRoutine } = require('../db');
const { requireUser } = require('./utils')



// GET /routines
router.get('/', async (req, res, next) => {
  try {
    const routines = await getAllPublicRoutines();
    res.send(routines);
  } catch (error) {
    next(error)
  }
})

// POST /routines
router.post('/', requireUser, async (req, res, next) => {
  try {
    const {name, description} = req.body;
    const createdRoutine = await createRoutine({name, description});
    res.send(createdRoutine)
  } catch (error) {
    next(error);
  }
});

// PATCH /routines/:routineId
router.patch('/:routineId', requireUser, async (req, res, next) => {
  try {
    const {name, description} = req.body;
    const updatedRoutine = await updateRoutine({id: req.params.routineId, name, description})
    res.send(updatedRoutine);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
