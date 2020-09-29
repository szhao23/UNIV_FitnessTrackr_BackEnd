const client = require('./client');
const util = require('./util');

// database functions
async function getAllActivities(){
  try {
    const {rows} = await client.query(`
      SELECT * FROM activities;
    `);
    return rows;
  } catch (error) {
    throw error;
  }
}
async function getActivityById(id){
  try {
    const {rows: [activity]} = await client.query(`
      SELECT * FROM activities
      WHERE id = $1
    `, [id]);
    return activity;
  } catch (error) {
    throw error;
  }
}
async function getActivitiesByRoutineId(id) {
  try {
    const { rows: activities } = await client.query(`
    SELECT activities.*, routine_activities.duration, routine_activities.count
    FROM activities 
    JOIN routine_activities ON routine_activities."activityId" = activities.id
    WHERE routine_activities."routineId" = $1;
  `, [id]);
  return activities;
  } catch (error) {
    console.error(error);
  }
}
// select and return an array of all activities
async function createActivity({ name, description }){
  try {
    const {rows: [activity]} = await client.query(`
      INSERT INTO activities(name, description) VALUES ($1, $2)
      ON CONFLICT (name) DO NOTHING 
      RETURNING *
    `, [name, description]);
    return activity;
  } catch (error) {
    throw error;
  }}
// return the new activity
async function updateActivity(fields = {}){
  const { id } = fields;
  const toUpdate = Object.assign({}, fields);
  delete toUpdate.id;
  let activity;
  try {
    if (util.dbFields(toUpdate).insert.length > 0) {
      const {rows} = await client.query(`
        UPDATE activities
        SET ${ util.dbFields(toUpdate).insert }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(toUpdate));
      activity = rows[0];
    }
  } catch (error) {
    console.error(error)
  }

  return activity;
}
// don't try to update the id
// do update the name and description
// return the updated activity
module.exports = {
  getAllActivities,
  getActivityById,
  getActivitiesByRoutineId,
  createActivity,
  updateActivity,
}
