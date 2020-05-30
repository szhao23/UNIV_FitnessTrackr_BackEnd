const client = require('./client')

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
async function updateActivity({ id, name, description }){
  return
}
// don't try to update the id
// do update the name and description
// return the updated activity
module.exports = {
  getAllActivities,
  createActivity,
  updateActivity,
}
