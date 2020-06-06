const express = require('express');
const router = express.Router();
const { updateRoutineActivity, canEditRoutineActivity, destroyRoutineActivity } = require('../db');
const client = require('../db/client');
const { requireUser } = require('./utils')



// PATCH /routine_activities/:routineActivityId
router.patch('/:routineActivityId', requireUser, async (req, res, next) => {
  try {
    const {count, duration} = req.body;
    if(!await canEditRoutineActivity(req.params.routineActivityId, req.user.id)) {
      next({name: "Unauthorized", message: "You cannot edit this routine_activity!"});
    } else {
      const updatedRoutineActivity = await updateRoutineActivity({id: req.params.routineActivityId, count, duration})
      res.send(updatedRoutineActivity);
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /routine_activities/:routineActivityId
router.delete('/:routineActivityId', requireUser, async (req, res, next) => {
  try {
    if(!await canEditRoutineActivity(req.params.routineActivityId, req.user.id)) {
      next({name: "Unauthorized", message: "You cannot edit this routine_activity!"});
    } else {
      const deletedRoutineActivity = await destroyRoutineActivity(req.params.routineActivityId)
      res.send(deletedRoutineActivity);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
