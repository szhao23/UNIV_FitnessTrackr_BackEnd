const express = require('express');
const router = express.Router();
const { getAllPublicRoutines, createRoutine, updateRoutine, getRoutineById, destroyRoutine, addActivityToRoutine } = require('../db');
const { requireUser, requiredNotSent } = require('./utils')



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
router.post('/', requireUser, requiredNotSent({requiredParams: ['name', 'goal']}), async (req, res, next) => {
  try {
    const {name, goal} = req.body;
    const createdRoutine = await createRoutine({creatorId: req.user.id, name, goal, isPublic: req.body.isPublic});
    res.send(createdRoutine)
  } catch (error) {
    next(error);
  }
});

// PATCH /routines/:routineId
router.patch('/:routineId', requireUser, requiredNotSent({requiredParams: ['name', 'goal'], atLeastOne: true}), async (req, res, next) => {
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
      res.status(403);
      next({
        name: "WrongUserError",
        message: "You must be the same user who created this routine to perform this action"
      });
    }
    const deletedRoutine = await destroyRoutine(req.params.routineId)
    res.send(deletedRoutine);
  } catch (error) {
    next(error);
  }
});

// POST /routines/:routineId/activities
router.post('/:routineId/activities', requiredNotSent({requiredParams: ['activityId', 'count', 'duration']}), async (req, res, next) => {
  try {
    const {activityId, count, duration} = req.body;
    const createdRoutineActivity = await addActivityToRoutine({ routineId: req.params.routineId, activityId, count, duration });
    res.send(createdRoutineActivity)
  } catch (error) {
    next(error);
  }
});

module.exports = router;
