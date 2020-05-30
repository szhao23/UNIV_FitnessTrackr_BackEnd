const { createUser, createActivity } = require('./');
const client = require('./client');
const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    // have to make sure to drop in correct order
    await client.query(`
      DROP TABLE IF EXISTS activities;
      DROP TABLE IF EXISTS users;
    `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL
      );
      CREATE TABLE activities (
        id SERIAL PRIMARY KEY,
        name varchar(255) UNIQUE NOT NULL,
        description TEXT NOT NULL
      );
    `);

    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log('Starting to create users...');

    const usersToCreate = [
      { username: 'albert', password: 'bertie99' },
      { username: 'sandra', password: 'sandra123' },
      { username: 'glamgal', password: 'glamgal123' },
    ]
    const users = await Promise.all(usersToCreate.map(async user => {
      const hashedPassword = bcrypt.hashSync(user.username, SALT_COUNT);
      const createdUser = await createUser({
        username: user.username,
        password: hashedPassword // not the plaintext
      });
      console.log('>>>>>>>>> user', user);
      return createdUser
    }));

    console.log('Users created:');
    console.log(users);

    console.log('Finished creating users!');
  } catch (error) {
    console.error('Error creating users!');
    throw error;
  }
}
async function createInitialActivities() {
  try {
    console.log('Starting to create activities...');

    const activitiesToCreate = [
      { name: 'bench press', description: '3 sets of 10. Lift a safe amount, but push yourself!' },
      { name: 'squats', description: 'Heavy lifting.' },
      { name: 'treadmill', description: '30 minutes of running' },
      { name: 'stairs', description: '20 minutes of climbing' },
    ]
    const activities = await Promise.all(activitiesToCreate.map(activity => createActivity(activity)));

    console.log('activities created:');
    console.log(activities);

    console.log('Finished creating activities!');
  } catch (error) {
    console.error('Error creating activities!');
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialActivities();
  } catch (error) {
    console.log('Error during rebuildDB')
    throw error;
  }
}

const testDB = async () => {
  try {
    console.log('Running testDB');

    console.log('Finished DB Tests');
  } catch (error) {
    throw new Error('Error Testing Database: ', error)
  }
}

module.exports = {
  rebuildDB,
  testDB
};
