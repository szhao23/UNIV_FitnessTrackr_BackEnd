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
      RETURNING *
    `, [username, password]);

    return user;
  } catch (error) {
    throw error;
  }
}
module.exports = {
  client,
  createUser,
}
