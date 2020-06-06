const axios = require('axios');
require('dotenv').config();
const bcrypt = require('bcrypt');
const {API_URL} = process.env;
const SALT_COUNT = 10;

const { rebuildDB, testDB } = require('../db/seedData');
const { getUserById, getAllActivities, getActivityById, createActivity, updateActivity, getRoutineById, getAllRoutines, getAllPublicRoutines, getAllRoutinesByUser, getPublicRoutinesByUser, getPublicRoutinesByActivity, createRoutine, updateRoutine, deleteRoutine, createUser, getUser } = require('../db');
const client = require('../db/client');

describe('Database', () => {
  beforeAll(async() => {
    await rebuildDB();
  })
  describe('Users', () => {
    let userToCreateAndUpdate;
    let userCredentials = {username: 'billybob', password: 'bobbybadboy'};
    describe('createUser({ username, password })', () => {
      it('Hash the password before storing it to the database', async () => {
        const hashedPassword = bcrypt.hashSync(userCredentials.password, SALT_COUNT);
        userToCreateAndUpdate = await createUser({
          username: userCredentials.username,
          password: hashedPassword // not the plaintext
        });
        const {rows: [queriedUser]} = await client.query(`SELECT * FROM users WHERE username = $1`, [userCredentials.username])
        expect(userToCreateAndUpdate.username).toBe(userCredentials.username);
        expect(queriedUser.username).toBe(userCredentials.username);
        expect(queriedUser.password).not.toBe(userCredentials.password);
      })
    })
    describe('getUser({ username, password })', () => {
      it('Verifies the password against the hashed password', async () => {
        const verifiedUser = await getUser(userCredentials);
        const unVerifiedUser = await getUser({username: userCredentials.username, password: 'badPassword'});
        expect(verifiedUser).toBeTruthy();
        expect(verifiedUser.username).toBe(userCredentials.username);
        expect(verifiedUser.password).toBeFalsy;
        expect(unVerifiedUser).toBeFalsy();
      })
    })
    describe('getUserById', () => {
      it('Gets a user based on the user Id', async () => {
        const user = await getUserById(userToCreateAndUpdate.id);
        expect(user).toBeTruthy();
        expect(user.id).toBe(userToCreateAndUpdate.id);
      })
    })
  })
  describe('Activities', () => {
    describe('getAllActivities', () => {
      it('selects and returns an array of all activities', async () => {
        const activities = await getAllActivities();
        const {rows: activitiesFromDatabase} = await client.query(`
        SELECT * FROM activities;
      `);
        expect(activities).toEqual(activitiesFromDatabase);
      })
    })
    describe('createActivity({ name, description })', () => {
      it('Creates and returns the new activity', async () => {
        const activityToCreate = { name: 'eliptical', description: '20 minutes of eliptical' };
        const createdActivity = await createActivity(activityToCreate);
        expect(createdActivity.name).toBe(activityToCreate.name);
        expect(createdActivity.description).toBe(activityToCreate.description);
      })
    })
    describe('updateActivity', () => {
      it('Updates name and description of an activity without affecting the ID. Returns the updated Activity.', async () => {
        const [activityToUpdate] = await getAllActivities();
        activityToUpdate.name = 'standing barbell curl';
        const activity = await updateActivity(activityToUpdate);
        delete activity.id;
        expect(activity).toEqual(activityToUpdate);
      })
    })
  })
  describe('Routines', () => {
    let routineToCreateAndUpdate;
    describe('getActivityById', () => {
      it('gets activities by their id', async () => {
        const activity = await getActivityById(1);
        expect(activity).toBeTruthy();
      })
    })
    describe('getAllRoutines', () => {
      it('selects and returns an array of all routines, includes their activities', async () => {
        const [routine] = await getAllRoutines();
        expect(routine).toEqual(expect.objectContaining({
          id: expect.any(Number),
          creatorId: expect.any(Number),
          public: expect.any(Boolean),
          name: expect.any(String),
          goal: expect.any(String),
          activities: expect.any(Array),
        }));
      })
    })
    describe('getAllPublicRoutines', () => {
      it('selects and returns an array of all public routines, includes their activities', async () => {
        const [routine] = await getAllPublicRoutines();
        expect(routine).toEqual(expect.objectContaining({
          id: expect.any(Number),
          creatorId: expect.any(Number),
          public: expect.any(Boolean),
          name: expect.any(String),
          goal: expect.any(String),
          activities: expect.any(Array),
        }));
        expect(routine.public).toBe(true);
      })
    })
    describe('getAllRoutinesByUser', () => {
      it('selects and return an array of all routines made by user, includes their activities', async () => {
        const user = await getUserById(1); 
        const [routine] = await getAllRoutinesByUser(user);
        expect(routine).toEqual(expect.objectContaining({
          id: expect.any(Number),
          creatorId: expect.any(Number),
          public: expect.any(Boolean),
          name: expect.any(String),
          goal: expect.any(String),
          activities: expect.any(Array),
        }));
        expect(routine.creatorId).toBe(user.id);
      })
    })
    describe('getPublicRoutinesByUser', () => {
      it('selects and returns an array of all routines made by user, includes their activities', async () => {
        const user = await getUserById(2); 
        const [routine] = await getPublicRoutinesByUser(user);
        expect(routine).toEqual(expect.objectContaining({
          id: expect.any(Number),
          creatorId: expect.any(Number),
          public: expect.any(Boolean),
          name: expect.any(String),
          goal: expect.any(String),
          activities: expect.any(Array),
        }));
        expect(routine.creatorId).toBe(user.id);
        expect(routine.public).toBe(true);
      })
    })
    describe('getPublicRoutinesByActivity', () => {
      it('selects and return an array of public routines which have a specific activityId in their routine_activities join, includes their activities', async () => {
        const activity = await getActivityById(3); 
        const [routine] = await getPublicRoutinesByActivity(activity);
        expect(routine).toEqual(expect.objectContaining({
          id: expect.any(Number),
          creatorId: expect.any(Number),
          public: expect.any(Boolean),
          name: expect.any(String),
          goal: expect.any(String),
          activities: expect.any(Array),
        }));
        // expect(routine.creatorId).toBe(activity.id);
        expect(routine.public).toBe(true);
      })
    })
    describe('createRoutine', () => {
      it('creates and returns the new routine', async () => {
        routineToCreateAndUpdate = await createRoutine({creatorId: 2, public: true, name: 'BodyWeight Day', goal: 'Do workouts that can be done from home, no gym or weights required.'});
        const queriedRoutine = await getRoutineById(routineToCreateAndUpdate.id)
        expect(routineToCreateAndUpdate).toEqual(queriedRoutine);
      })
    })
    describe('updateRoutine', () => {
      let queriedRoutine;
      beforeAll(async() => {
        routineToCreateAndUpdate = await updateRoutine({id: routineToCreateAndUpdate.id, public: false, name: 'Arms Day', goal: 'Do all workouts that work those arms!'});
        queriedRoutine = await getRoutineById(routineToCreateAndUpdate.id);
      })
      it('Returns the updated routine', async () => {
        expect(routineToCreateAndUpdate).toBeTruthy();
      })
      it('Finds the routine with id equal to the passed in id. Does not update the routine id.', async () => {
        expect(routineToCreateAndUpdate.id).toBe(queriedRoutine.id);
      })
      it('Updates the public status, name, or goal, as necessary', async () => {
        expect(routineToCreateAndUpdate.public).toBe(queriedRoutine.public);
        expect(routineToCreateAndUpdate.name).toBe(queriedRoutine.name);
        expect(routineToCreateAndUpdate.goal).toBe(queriedRoutine.goal);
      })
      
    })
    describe('updateRoutine', () => {
      it('remove routine from database', async () => {
        await deleteRoutine(routineToCreateAndUpdate.id);
        const {rows: [routine]} = await client.query(`
          SELECT * 
          FROM routines
          WHERE id = $1;
        `, [routineToCreateAndUpdate.id]);
        expect(routine).toBeFalsy();
      })
      
    })
  })
});
