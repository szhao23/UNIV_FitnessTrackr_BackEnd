const { createUser, getAllActivities, createActivity, getRoutinesWithoutActivities, getAllRoutines, createRoutine, addActivityToRoutine } = require('./');
const client = require('./client');
const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

const faker = require('faker');

async function dropTables() {
  console.log('Dropping All Tables...');
  try {
      await  client.query(`
      DROP TABLE IF EXISTS routine_activities;
      DROP TABLE IF EXISTS routines;
      DROP TABLE IF EXISTS activities;
      DROP TABLE IF EXISTS users;
  `)
  } catch (error) {
      throw error; 
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");

    await  client.query(`
      CREATE TABLE users(
        id  SERIAL PRIMARY KEY, 
        username VARCHAR(255) UNIQUE NOT NULL, 
        password VARCHAR(255) NOT NULL
      );
    `)

    await  client.query(`
      CREATE TABLE activities(
        id SERIAL PRIMARY KEY, 
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT NOT NULL
      );
    `)
    await  client.query(`
      CREATE TABLE routines(
        id SERIAL PRIMARY KEY, 
        "creatorId" INTEGER REFERENCES users(id),
        public BOOLEAN DEFAULT false,
        name VARCHAR(255) UNIQUE NOT NULL,
        goal TEXT NOT NULL
      );
    `)
    await  client.query(`
      CREATE TABLE routine_activities(
        id SERIAL PRIMARY KEY, 
        "routineId" INTEGER REFERENCES routines(id),
        "activityId" INTEGER REFERENCES activities(id),
        duration INTEGER,
        count INTEGER,
        UNIQUE ("routineId", "activityId")
        );
    `)
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
    const users = await Promise.all(usersToCreate.map(createUser));

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
      { name: 'wide-grip standing barbell curl', description: 'Lift that barbell!' },
      { name: 'Incline Dumbbell Hammer Curl', description: 'Lie down face up on an incline bench and lift thee barbells slowly upward toward chest' },
      { name: 'bench press', description: '3 sets of 10. Lift a safe amount, but push yourself!' },
      { name: 'Push Ups', description: 'Pretty sure you know what to do!' },
      { name: 'squats', description: 'Heavy lifting.' },
      { name: 'treadmill', description: '30 minutes of running' },
      { name: 'stairs', description: '20 minutes of climbing' },
    ]
    const activities = await Promise.all(activitiesToCreate.map(createActivity));

    console.log('activities created:');
    console.log(activities);

    console.log('Finished creating activities!');
  } catch (error) {
    console.error('Error creating activities!');
    throw error;
  }
}


async function createInitialRoutines() {
  try {
    console.log('starting to create routines...');

    const routinesToCreate = [
      {creatorId: 2, public: false, name: 'Bicep Day', goal: 'Work the Back and Biceps.'},
      {creatorId: 1, public: true, name: 'Chest Day', goal: 'To beef up the Chest and Triceps!'},
      {creatorId: 1, public: false, name: 'Leg Day', goal: 'Running, stairs, squats'},
      {creatorId: 2, public: true, name: 'Cardio Day', goal: 'Running, stairs. Stuff that gets your heart pumping!'},
    ]
    const routines = await Promise.all(routinesToCreate.map(routine => createRoutine(routine)));
    console.log('Routines Created: ', routines)
    console.log('Finished creating routines.')
  } catch (error) {
      throw error;
  }
}

async function createInitialRoutineActivities() {
  try {
    console.log('starting to create routine_activities...');
    const [bicepRoutine, chestRoutine, legRoutine, cardioRoutine] = await getRoutinesWithoutActivities();
    const [bicep1, bicep2, chest1, chest2, leg1, leg2, leg3] = await getAllActivities();

    const routineActivitiesToCreate = [
      {
        routineId: bicepRoutine.id,
        activityId: bicep1.id,
        count: 10,
        duration: 10000 
      },
      {
        routineId: bicepRoutine.id,
        activityId: bicep2.id,
        count: 10,
        duration: 10000 
      },
      {
        routineId: chestRoutine.id,
        activityId: chest1.id,
        count: 10,
        duration: 10000 
      },
      {
        routineId: chestRoutine.id,
        activityId: chest2.id,
        count: 10,
        duration: 10000 
      },
      {
        routineId: legRoutine.id,
        activityId: leg1.id,
        count: 10,
        duration: 10000 
      },
      {
        routineId: legRoutine.id,
        activityId: leg2.id,
        count: 10,
        duration: 10000 
      },
      {
        routineId: legRoutine.id,
        activityId: leg3.id,
        count: 10,
        duration: 10000 
      },
      {
        routineId: cardioRoutine.id,
        activityId: leg2.id,
        count: 10,
        duration: 10000 
      },
      {
        routineId: cardioRoutine.id,
        activityId: leg3.id,
        count: 10,
        duration: 10000 
      },
    ]
    const routineActivities = await Promise.all(routineActivitiesToCreate.map(addActivityToRoutine));
    console.log('routine_activities created: ', routineActivities)
    console.log('Finished creating routine_activities!')
  } catch (error) {
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
    await createInitialRoutines();
    await createInitialRoutineActivities();
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
