const client = require('./client')
const { getActivitiesByRoutineId } = require('./activities')
const { getUserByUsername } = require('./users')

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
    SELECT *
    FROM routines 
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
    SELECT *
    FROM routines 
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
    SELECT *
    FROM routines 
    WHERE "creatorId" = $1
    AND public = true
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
    SELECT *
    FROM routines 
    WHERE public = true
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
    SELECT routines.*
    FROM routines 
    JOIN routine_activities ON routine_activities."routineId" = routines.id
    WHERE routines.public = true
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

async function createRoutine({creatorId, public: isPublic, name, goal}) {
  try {
    const {rows: [routine]} = await client.query(`
        INSERT INTO routines ("creatorId", "public", "name", "goal")
        VALUES($1, $2, $3, $4)
        RETURNING *;
    `, [creatorId, isPublic, name, goal]);

    return routine;
  } catch (error) {
    console.error(error);
  }
}

async function updateRoutine({id, public: isPublic, name, goal}) {
  try {
    const {rows: [routine]} = await client.query(`
        UPDATE routines 
        SET "public" = $2, "name" = $3, "goal" = $4
        WHERE id = $1
        RETURNING *;
    `, [id, isPublic, name, goal]);

    return routine;
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
    console.log('>>>>>>>>> DELETED routine', routine);
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