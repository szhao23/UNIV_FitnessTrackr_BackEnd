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
  delete fields.id;
  let activity;
  try {
    if (util.dbFields(fields).insert.length > 0) {
      const {rows} = await client.query(`
        UPDATE activities
        SET ${ util.dbFields(fields).insert }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(fields));
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
  createActivity,
  updateActivity,
}
