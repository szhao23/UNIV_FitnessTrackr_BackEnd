const client = require('./client')
const { getActivitiesByRoutineId } = require('./activities')
const { getUserByUsername } = require('./users')
const util = require('./util');

async function getRoutineById(id){
  try {
    const {rows: [routine]} = await client.query(`
      SELECT * FROM routines
      WHERE id = $1
    `, [id]);
    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutinesWithoutActivities(){
  try {
    const {rows} = await client.query(`
    SELECT * FROM routines;
    `);
    return rows;
  } catch (error) {
    console.error(error)
  }
}
async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id 
    `);
    for (let routine of routines) {
      routine.activities = await getActivitiesByRoutineId(routine.id);
    }
    return routines;
  } catch (error) {
    console.error(error)
  }
}
async function getAllRoutinesByUser({username}) {
  try {
    const user = await getUserByUsername(username);
    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id 
    WHERE "creatorId" = $1
    `, [user.id]);
    for (let routine of routines) {
      routine.activities = await getActivitiesByRoutineId(routine.id);
    }
    return routines;
  } catch (error) {
    console.error(error)
  }
}
async function getPublicRoutinesByUser({username}) {
  try {
    const user = await getUserByUsername(username);
    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id 
    WHERE "creatorId" = $1
    AND "isPublic" = true
    `, [user.id]);
    for (let routine of routines) {
      routine.activities = await getActivitiesByRoutineId(routine.id);
    }
    return routines;
  } catch (error) {
    console.error(error)
  }
}
async function getAllPublicRoutines() {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    WHERE "isPublic" = true
    `);
    for (let routine of routines) {
      routine.activities = await getActivitiesByRoutineId(routine.id);
    }
    return routines;
  } catch (error) {
    console.error(error)
  }
}
async function getPublicRoutinesByActivity({id}) {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    JOIN routine_activities ON routine_activities."routineId" = routines.id
    WHERE routines."isPublic" = true
    AND routine_activities."activityId" = $1;
  `, [id]);
    for (let routine of routines) {
      routine.activities = await getActivitiesByRoutineId(routine.id);
    }
    return routines;
  } catch (error) {
    console.error(error);
  }
}

async function createRoutine({creatorId, isPublic, name, goal}) {
  try {
    const {rows: [routine]} = await client.query(`
        INSERT INTO routines ("creatorId", "isPublic", "name", "goal")
        VALUES($1, $2, $3, $4)
        RETURNING *;
    `, [creatorId, isPublic, name, goal]);

    return routine;
  } catch (error) {
    console.error(error);
  }
}

async function updateRoutine({id, ...fields}) {
  try {
    if (util.dbFields(fields).insert.length > 0) {
      const {rows: [routine]} = await client.query(`
          UPDATE routines 
          SET ${ util.dbFields(fields).insert }
          WHERE id=${ id }
          RETURNING *;
      `, Object.values(fields));
      return routine;
    }
  } catch (error) {
    console.error(error);
  }
}
async function destroyRoutine(id) {
  try {
    await client.query(`
        DELETE FROM routine_activities 
        WHERE "routineId" = $1;
    `, [id]);
    const {rows: [routine]} = await client.query(`
        DELETE FROM routines 
        WHERE id = $1
        RETURNING *
    `, [id]);
    return routine;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
}