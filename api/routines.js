const express = require('express');
const router = express.Router();
const { getAllPublicRoutines, createRoutine, updateRoutine, getRoutineById, destroyRoutine, addActivityToRoutine } = require('../db');
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
    const {name, goal} = req.body;
    const createdRoutine = await createRoutine({creatorId: req.user.id, name, goal, public: req.body.public});
    res.send(createdRoutine)
  } catch (error) {
    next(error);
  }
});

// PATCH /routines/:routineId
router.patch('/:routineId', requireUser, async (req, res, next) => {
  try {
    const {name, goal} = req.body;
    const updatedRoutine = await updateRoutine({id: req.params.routineId, name, goal})
    res.send(updatedRoutine);
  } catch (error) {
    next(error);
  }
});

// DELETE /routines/:routineId
router.delete('/:routineId', requireUser, async (req, res, next) => {
  try {
    const routineToUpdate = await getRoutineById(req.params.routineId);
    if(req.user.id !== routineToUpdate.creatorId) {
      res.sendStatus(403);
    }
    const deletedRoutine = await destroyRoutine(req.params.routineId)
    res.send(deletedRoutine);
  } catch (error) {
    next(error);
  }
});

// POST /routines/:routineId/activities
router.post('/:routineId/activities', async (req, res, next) => {
  try {
    const {activityId, count, duration} = req.body;
    const createdRoutineActivity = await addActivityToRoutine({ routineId: req.params.routineId, activityId, count, duration });
    res.send(createdRoutineActivity)
  } catch (error) {
    next(error);
  }
});

module.exports = router;
