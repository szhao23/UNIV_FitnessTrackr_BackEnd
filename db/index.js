const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 'https://localhost:5432/fitness-dev';

const client = new Client(connectionString);

// database functions

// user functions
async function createUser({ username, password}) {
  try {
    const {rows: [user]} = await client.query(`
      INSERT INTO users(username, password) VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING 
      RETURNING id, username
    `, [username, password]);
    return user;
  } catch (error) {
    throw error;
  }
}
async function getUserById(userId) {
  // first get the user
  try {
    const {rows} = await client.query(`
      SELECT *
      FROM users
      WHERE id = $1;
    `, [userId]);
    // if it doesn't exist, return null
    if (!rows || !rows.length) return null;
    // if it does:
    // delete the 'password' key from the returned object
    const [user] = rows;
    delete user.password; 
    return user;  
  } catch (error) {
    console.error(error)
  }
}
async function getUserByUsername(userName) {
  // first get the user
  try {
    const {rows} = await client.query(`
      SELECT *
      FROM users
      WHERE username = $1;
    `, [userName]);
    // if it doesn't exist, return null
    if (!rows || !rows.length) return null;
    // if it does:
    // delete the 'password' key from the returned object
    const [user] = rows;
    delete user.password;
    return user;
  } catch (error) {
    console.error(error)
  }
}
module.exports = {
  client,
  createUser,
  getUserById,
  getUserByUsername,
}
